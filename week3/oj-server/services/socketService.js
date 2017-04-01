let redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {
    let collaborations = [];

    let socketIdToSessionId = [];

    let sessionPath = "/yidong_coj_sessions";

    io.on("connection", (socket) => {

        let sessionId = socket.handshake.query["sessionId"];
        socketIdToSessionId[socket.id] = sessionId;

        if (sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            let key = keyOfSession(sessionId);
            redisClient.get(key, function(data) {
                if (data) {
                    console.log("Session has been terminated previously, pulling back from Redis!");
                    collaborations[sessionId] = {
                        "cachedChangeEvents": JSON.parse(data),
                        "participants": []
                    }
                } else {
                    console.log("Create a new session!");
                    collaborations[sessionId] = {
                        "cachedChangeEvents": [],
                        "participants": []
                    }
                }
                collaborations[sessionId]["participants"].push(socket.id);
            })
        }

        socket.on("change", delta => {
            let sessionId = socketIdToSessionId[socket.i];

            forwardEvent(socket.id, "change", delta);

            if (sessionId in collaborations) {
                collaborations[sessionId]["cachedChangeEvents"].push(["change", delta, Date().now]);
            }
        });

        socket.on("cursorMove", cursor => {
            console.log("get the event of cursor from client!");
            cursor = JSON.parse(cursor);
            cursor["socketId"] = socket.id;

            forwardEvent(socket.id, "cursorMove", JSON.stringify(cursor));
        });

        socket.on("restoreBuffer", () => {
            let sessionId = socketIdToSessionId[socket.id];
            console.log("Get the restore event from client!");
            if (sessionId in collaborations) {
                console.log("The sessionId is in collaborations!");
                let changeEvents = collaborations[sessionId]["cachedChangeEvents"];
                for (let i = 0; i < changeEvents.length; i++) {
                    console.log("The changeEvent is %s", changeEvents[i][0]);
                    socket.emit(changeEvents[i][0], changeEvents[i][1]);
                }
            }
        });

        socket.on("disconnect", () => {
            let sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                let index = participants.indexOf(socket.id);
                if (index >= 0) {
                    participants.slice(index, 1);
                    if (participants.length == 0) {
                        let key = keyOfSession(sessionId);
                        let value = JSON.stringify(collaborations[sessionId]["cachedChangeEvents"]);
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }
                }
            }
        });

        function forwardEvent(socketId, eventName, dataString) {
            let sessionId = socketIdToSessionId[socketId];
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants']
                for (let i = 1; i < participants.length; i++) {
                    if (socketId != participants[i]) {
                        io.to(participants[i]).emit(eventName, dataString);
                    }
                }
            } else {
                console.log("WARNING!!! Could not tie socket_id to any collaborations!");
            }
        }

        function keyOfSession(sessionId) {
            return sessionPath + '/' + sessionId;
        }
    })
}
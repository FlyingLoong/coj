import { Injectable } from '@angular/core';
import { COLORS} from '../../assets/colors';

declare let io: any;
declare let ace: any;

@Injectable()
export class CollaborationService {

  collaborationSocket: any;
  clientsInfo: Object = {};
  clientNum: number = 0;

  constructor() { }

  init(editor: any, sessionId: string): void {
    this.collaborationSocket = io(window.location.origin, {query: "sessionId=" + sessionId});

    this.collaborationSocket.on("message", (message) => {
      console.log("received " + message)
    });

    this.collaborationSocket.on("change", (delta:string) => {
      delta = JSON.parse(delta)
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });

    this.collaborationSocket.on("cursorMove", (cursor) => {
      console.log("get the cursor move from server!");
      let session = editor.getSession();
      cursor = JSON.parse(cursor);
      let x = cursor["row"];
      let y = cursor["column"];
      let changeClientId = cursor["socketId"];

      if (changeClientId in this.clientsInfo) {
        session.removeMarker(this.clientsInfo[changeClientId]["marker"]);
      } else {
        this.clientsInfo[changeClientId] = {};

        let css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".editor_cursor" + changeClientId
            + " { position:absolute; background:" + COLORS[this.clientNum] + ";"
            + " z-index: 100; width:3px !important; }";

        document.body.appendChild(css);
        this.clientNum++;
      }

      let Range = ace.require('ace/range').Range;
      let newMarker = session.addMarker(new Range(x, y, x, y+1), 'editor_cursor'+changeClientId, true);
      this.clientsInfo[changeClientId]["marker"] = newMarker;
    })
  }

  change(delta: string): void {
    this.collaborationSocket.emit("change", delta);
    console.log("send the event change to server!");
  }

  cursorMove(cursor: string): void {
    this.collaborationSocket.emit("cursorMove", cursor);
  }

  restoreBuffer(): void {
    this.collaborationSocket.emit("restoreBuffer");
  }

}

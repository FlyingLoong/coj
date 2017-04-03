import json

from flask import Flask
from flask import jsonify
from flask import request

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/build_and_run", methods=["POST"])
def build_and_run():
    data = json.loads(request.data)

    if "code" not in data or "lang" not in data:
        return ("You should provide both code and lang!")

    code = data["code"]
    lang = data["lang"]

    return jsonify({"Hello": "World"})

if __name__ == "__main__":
    app.run(debug=True)
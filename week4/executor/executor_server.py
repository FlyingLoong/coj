"""
Python server
"""
import json
import executor_utils as eu

from flask import Flask
from flask import jsonify
from flask import request

APP = Flask(__name__)

@APP.route("/")

@APP.route("/build_and_run", methods=["POST"])
def build_and_run():
    """
    Build and Run
    """
    print "Got called %s" % (request.data)
    data = json.loads(request.data)

    if "code" not in data or "lang" not in data:
        return "You should provide both code and lang!"

    code = data["code"]
    lang = data["lang"]

    result = eu.build_and_run(code, lang)
    return jsonify(result)

if __name__ == "__main__":
    eu.load_image()
    APP.run(debug=True)

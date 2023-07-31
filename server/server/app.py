import io
from flask import Flask
from server.test import predict
from flask import request

app = Flask("Flask Server")


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/test", methods=["GET", "POST"])
def image_classification():
    file = request.files["file"]
    fileBytes = io.BytesIO(file.read())
    return predict(fileBytes, app.logger)


def main():
    app.run(host="0.0.0.0", port=8080)

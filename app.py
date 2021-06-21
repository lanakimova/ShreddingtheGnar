from flask import Flask, render_template, redirect, jsonify

import csv

app = Flask(__name__)


# Routes

@app.route("/")
def home():
    return render_template("index.html", template_folder='Templates')


if __name__ == "__main__":
    app.run(debug=True)



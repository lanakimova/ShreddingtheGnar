from flask import Flask, render_template, redirect, jsonify
from flask.json import tojson_filter

import csv
# from sqlalchemy import create_engine
# import json, psycopg2
# # from flask_pymongo import PyMongo
# from config import postgrepass
# import sys

app = Flask(__name__)

# Establish Mongo connection with PyMongo
# conn = PyMongo(app, uri="mongodb://localhost:27017/resort_app")
# db_path = f'postgresql://postgres:{postgrepass}@localhost:5432/SkiResorts'
# engine = create_engine(db_path)

# # Set routes
@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)



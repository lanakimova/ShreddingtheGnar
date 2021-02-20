from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
# Import scraping .py file name here
import 
import sys

app = Flask(__name__)

# Establish Mongo connection with PyMongo
conn = PyMongo(app, uri="mongodb://localhost:27017/resort_app")

# # Set routes
# @app.route("/")
# def home():
#     all_resort_info = conn.db.all_resort_info.find_one() # Add the name of the dictionary created with the resort info 
#     return render_template("index.html", resort=all_resort_info)

def index():
    resort_info = mongo.db.weather_info.find_one()
    return render_template("index.html", resort_info=weather_dict)

@app.route("/resort_scrape")
def scrape():
    data = scraping.scrape() # Update name of the .py file here
    all_resort_info = conn.db.all_resort_info

    all_resort_info.update({}, data, upsert=True)
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import scraping
import sys

app = Flask(__name__)

# Establish Mongo connection with PyMongo
conn = PyMongo(app, uri="mongodb://localhost:27017/resort_app")

# # Set routes
@app.route("/")
def home():
    new_resort_info = conn.db.resorts.find_one() # Add the name of the dictionary created with the resort info 
    print(new_resort_info)
    return render_template("index.html", resorts=new_resort_info["data"])

# Route to DB


# Route to scrape website
# @app.route("/scrape")
# def scrape():
#     resorts = conn.db.resorts
#     resorts_data = scraping.scrape() # Update name of the .py file here
#     # for x in resorts_data: 
#     #     resorts.update({}, x, upsert=True)
#     resorts.update_one({}, {"$set": {"data":resorts_data}}, upsert=True)
#     return redirect("/")

    # return jsonify(resorts_data)


if __name__ == "__main__":
    app.run(debug=True)

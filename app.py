from flask import Flask, render_template, redirect, jsonify
from sqlalchemy import create_engine
# from flask_pymongo import PyMongo
from config import postgrepass
import sys

app = Flask(__name__)

# Establish Mongo connection with PyMongo
# conn = PyMongo(app, uri="mongodb://localhost:27017/resort_app")
db_path = f'postgresql://postgres:{postgrepass}@localhost:5432/SkiResorts'
engine = create_engine(db_path)

# # Set routes
@app.route("/")
def home():
    # new_resort_info = conn.db.resorts.find_one() # Add the name of the dictionary created with the resort info 
    # print(new_resort_info)
    return render_template("index.html")

# Route to DB
@app.route("/available_states")
def getStates():
    with engine.connect() as conn:
        query = f"SELECT state FROM resorts_info WHERE state NOT IN ('Empty', 'Unknown')"
        states = conn.execution_options(stream_results=True).execute(query).fetchall()
    return states

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

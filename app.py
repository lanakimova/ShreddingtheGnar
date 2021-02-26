from flask import Flask, render_template, redirect, jsonify
from flask.json import tojson_filter
from sqlalchemy import create_engine
import json, psycopg2
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
    return render_template("index.html", states=getStates(), weather=getWeather(), resorts=getResorts(), lopes=getSlopes())

# Route for states
@app.route("/available_states")
def getStates():
    with engine.connect() as conn:
        query = f"SELECT state FROM resorts_info WHERE state IS NOT NULL GROUP BY state ORDER BY state ASC"
        tempStates = conn.execution_options(stream_results=True).execute(query).fetchall()
        states = []
        for state in tempStates:
            state = str(state)
            states.append(state[2:len(state)-3])
        # states = json.dumps(states)
    return states

@app.route("/_getResortInfo/")
def getResortInfo():
    resortInfo = {}
    with engine.connect() as conn:
        # query = f"SELECT price FROM resorts_info WHERE name = '{resortName}'"
        # price = conn.execution_options(stream_results=True).execute(query).fetchall()
        # price = str(price)
        # price = price[2:len(price)-3]
        # resortInfo['price'] = float(price)

        # query = f"SELECT closest_town FROM resorts_info WHERE name = '{resortName}'"
        # closest_town = conn.execution_options(stream_results=True).execute(query).fetchall()
        # closest_town = str(closest_town)
        # closest_town = closest_town[3:len(closest_town)-4]
        # resortInfo['Closest town'] = closest_town

        query = f"SELECT price, closest_town, total_len, easy_len, intermediate_len, difficult_len, website \
                FROM resorts_info"
                # WHERE name = '{resortName}'"
        resort_info = conn.execution_options(stream_results=True).execute(query).fetchall()
    return resort_info

@app.route("/getCoordinates/<resortName>")
def getCoordinates(resortName):

    with engine.connect() as conn:
        geo = {}
        query = f"SELECT lat, lon  FROM resorts_info WHERE name = '{resortName}'"
        coordinates = conn.execution_options(stream_results=True).execute(query).fetchall()
        coordinates = list(coordinates[0])
        geo['lon'] = coordinates[1]
        geo['lat'] = coordinates[0]
    return geo
    # jsonify([coordinates[1], coordinates[0]])
    # geo

@app.route("/getResortsNameByState/<state>")
def getResortsNameByState(state):
    resortNames = []
    with engine.connect() as conn:
        query = f"SELECT name FROM resorts_info WHERE state = '{state}'"
        names = conn.execution_options(stream_results=True).execute(query).fetchall()
        for name in names:
            name = str(name)
            resortNames.append(name[2:len(name)-3])
    return jsonify(resortNames)
# States route
@app.route("/resorts")
def getResorts():
    with engine.connect() as conn:
        query =  f"SELECT name FROM resorts_info"
        resorts = conn.execution_options(stream_results=True).execute(query).fetchall()
    return resorts

@app.route("/weather")
def getWeather():
    with engine.connect() as conn:
        query =  f"SELECT name, temp_min, temp_max, feels_like, daily_chance_snow FROM resorts_info"
        weather = conn.execution_options(stream_results=True).execute(query).fetchall()
    return weather

@app.route("/slopes")
def getSlopes():
    with engine.connect() as conn:
        query =  f"SELECT name, easy_len, intermediate_len, difficult_len FROM resorts_info"
        slopes = conn.execution_options(stream_results=True).execute(query).fetchall()
    return slopes

if __name__ == "__main__":
    app.run(debug=True)



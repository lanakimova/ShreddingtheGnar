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
    return states

@app.route("/getResortByPriceRange/<min_value>/<max_value>")
def getResortByPriceRange(min_value, max_value):
    geo = {'lon': [], 'lat': []}
    with engine.connect() as conn:
        query = f"SELECT lat, lon FROM resorts_info WHERE price >= {min_value} \
                AND price < {max_value} AND lat IS NOT NULL AND lon IS NOT NULL"
                # WHERE name = '{resortName}'"
        coordinates = conn.execution_options(stream_results=True).execute(query).fetchall()
        for i in range(len(coordinates)):
            geo['lon'].append(coordinates[i][1])
            geo['lat'].append(coordinates[i][0])
    # return jsonify(resortsPrice)
    return jsonify(geo)
# test = getResortByPriceRange([0, 50])
# print(test['lon'])

# function bellow is working.
@app.route("/getCoordinates/<resortName>")
def getCoordinates(resortName): 
    geo = {'lon': [], 'lat': []}
    query = ''   
    with engine.connect() as conn:
        if resortName == 'All States':
            query = f"SELECT lat, lon  FROM resorts_info WHERE lat IS NOT NULL AND lon IS NOT NULL" 
        else:
            query = f"SELECT lat, lon  FROM resorts_info WHERE name = '{resortName}' and lat IS NOT NULL AND lon IS NOT NULL"

        coordinates = conn.execution_options(stream_results=True).execute(query).fetchall()
        for i in range(len(coordinates)):
            geo['lon'].append(coordinates[i][1])
            geo['lat'].append(coordinates[i][0])

    return jsonify(geo)
    # return geo


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
    resortsList = []
    with engine.connect() as conn:
        query =  f"SELECT name FROM resorts_info"
        resorts = conn.execution_options(stream_results=True).execute(query).fetchall()
        for resort in resorts:
            resort = str(resort)
            resortsList.append(resort[2:len(resort)-3])
    return resortsList

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



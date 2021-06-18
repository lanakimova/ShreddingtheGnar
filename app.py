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
    # , states=getStates(), weather=getWeather(), resorts=getResorts(), slopes=getSlopes())



# comparison page
# @app.route('/comparison')
# def comparison():    
#     return render_template('comparison.html', states=getStates(), weather=getWeather(), resorts=getResorts(), slopes=getSlopes())


# Route for states
# @app.route("/available_states")
# def getStates():
#     with engine.connect() as conn:
#         query = f"SELECT state FROM resorts_info WHERE state IS NOT NULL GROUP BY state ORDER BY state ASC"
#         tempStates = conn.execution_options(stream_results=True).execute(query).fetchall()
#         states = []
#         for state in tempStates:
#             state = str(state)
#             states.append(state[2:len(state)-3])
#     return states

# @app.route("/getResortByPriceRange/<min_value>/<max_value>")
# def getResortByPriceRange(min_value, max_value):
#     geo = {'lon': [], 'lat': []}
#     with engine.connect() as conn:
#         query = f"SELECT lat, lon FROM resorts_info WHERE price >= {min_value} \
#                 AND price < {max_value} AND lat IS NOT NULL AND lon IS NOT NULL"
#                 # WHERE name = '{resortName}'"
#         coordinates = conn.execution_options(stream_results=True).execute(query).fetchall()
#         for i in range(len(coordinates)):
#             geo['lon'].append(coordinates[i][1])
#             geo['lat'].append(coordinates[i][0])
#     # return jsonify(resortsPrice)
#     return jsonify(geo)
# # test = getResortByPriceRange([0, 50])
# # print(test['lon'])

# # function bellow is working.
# @app.route("/getCoordinates/<resortName>")
# def getCoordinates(resortName): 
#     geo = {'lon': [], 'lat': []}
#     query = ''   
#     with engine.connect() as conn:
#         if resortName == 'All States':
#             query = f"SELECT lat, lon  FROM resorts_info WHERE lat IS NOT NULL AND lon IS NOT NULL" 
#         else:
#             query = f"SELECT lat, lon  FROM resorts_info WHERE name = '{resortName}' and lat IS NOT NULL AND lon IS NOT NULL"

#         coordinates = conn.execution_options(stream_results=True).execute(query).fetchall()
#         for i in range(len(coordinates)):
#             geo['lon'].append(coordinates[i][1])
#             geo['lat'].append(coordinates[i][0])

#     return jsonify(geo)
#     # return geo


# @app.route("/getCheepestResortInState/<state>")
# def getCheepestResortInState(state):
#     resortInfo = {}
#     with engine.connect() as conn:
#         query = f"SELECT MIN(price) FROM resorts_info WHERE state = '{state}' LIMIT 1"
#         lowPrice = conn.execution_options(stream_results=True).execute(query).fetchall()
#         lowPrice = str(lowPrice)
#         lowPrice = lowPrice[2: len(lowPrice)-3]
#         query = f"SELECT name, price, closest_town, zip, total_len, easy_len, intermediate_len, difficult_len \
#                 , temperature, feels_like, website FROM resorts_info \
#                  WHERE state = '{state}' AND lat IS NOT NULL AND price = {lowPrice}"
#         names = conn.execution_options(stream_results=True).execute(query).fetchall()
        
#         resortInfo['name'] = names[0][0]
#         resortInfo['price'] = names[0][1]
#         resortInfo['closest_town'] = names[0][2]
#         resortInfo['zip'] = names[0][3]
#         resortInfo['total_len'] = names[0][4]
#         resortInfo['easy_len'] = names[0][5]
#         resortInfo['inter_len'] = names[0][6]
#         resortInfo['dif_len'] = names[0][7]
#         resortInfo['temp'] = names[0][8]
#         resortInfo['feels_like'] = names[0][9]
#         resortInfo['website'] = names[0][10]

#     return jsonify(resortInfo)


# @app.route("/getExpenciveResortInState/<state>")
# def getExpencivetResortInState(state):
#     resortInfo = {}
#     with engine.connect() as conn:
#         query = f"SELECT MAX(price) FROM resorts_info WHERE state = '{state}' LIMIT 1"
#         highPrice = conn.execution_options(stream_results=True).execute(query).fetchall()
#         highPrice = str(highPrice)
#         highPrice = highPrice[2: len(highPrice)-3]
#         query = f"SELECT name, price, closest_town, zip, total_len, easy_len, intermediate_len, difficult_len \
#                 , temperature, feels_like, website FROM resorts_info \
#                  WHERE state = '{state}' AND lat IS NOT NULL AND price = {highPrice}"
#         names = conn.execution_options(stream_results=True).execute(query).fetchall()
        
#         resortInfo['name'] = names[0][0]
#         resortInfo['price'] = names[0][1]
#         resortInfo['closest_town'] = names[0][2]
#         resortInfo['zip'] = names[0][3]
#         resortInfo['total_len'] = names[0][4]
#         resortInfo['easy_len'] = names[0][5]
#         resortInfo['inter_len'] = names[0][6]
#         resortInfo['dif_len'] = names[0][7]
#         resortInfo['temp'] = names[0][8]
#         resortInfo['feels_like'] = names[0][9]
#         resortInfo['website'] = names[0][10]

#     return jsonify(resortInfo)


# # States route
# @app.route("/resorts")
# def getResorts():
#     resortsList = []
#     with engine.connect() as conn:
#         query =  f"SELECT name FROM resorts_info"
#         resorts = conn.execution_options(stream_results=True).execute(query).fetchall()
#         for resort in resorts:
#             resort = str(resort)
#             resortsList.append(resort[2:len(resort)-3])
#     return resortsList

# @app.route("/weather")
# def getWeather():
#     with engine.connect() as conn:
#         query =  f"SELECT name, temp_min, temp_max, feels_like, daily_chance_snow FROM resorts_info"
#         weather = conn.execution_options(stream_results=True).execute(query).fetchall()
#     return weather

# @app.route("/slopes")
# def getSlopes():
#     with engine.connect() as conn:
#         query =  f"SELECT name, easy_len, intermediate_len, difficult_len FROM resorts_info"
#         slopes = conn.execution_options(stream_results=True).execute(query).fetchall()
#     return slopes

if __name__ == "__main__":
    app.run(debug=True)



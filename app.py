from flask import Flask, render_template, redirect, jsonify

import csv

app = Flask(__name__)

def getData():
    # read csv file and return all rows as a list
    resorts_rows = []
    resorts_fields = []

    with open('static/data/US_Snow_Resorts.csv', 'r') as csvfile_res:
        csvreader_res = csv.reader(csvfile_res)
        resorts_fields = next(csvreader_res)

        for row in csvreader_res:
            resorts_rows.append(row)
    return resorts_rows

# Routes

@app.route("/")
def home():
    return render_template("index.html", template_folder='Templates')

@app.route("/states", methods=['GET'])
def states():
    # function return unique states with snow resorts

    states = []   
    stateName = 12 # field 12 contain the name of a state

    data = getData()

    for i in range(len(data)):
        if data[i][stateName] not in states:
            states.append(data[i][stateName])
    states.sort()

    return jsonify(states)

@app.route("/getAllResorts", methods=['GET'])
def getAllResorts():
    # Function return list of dictionary with data about snow resorts

    data = getData()

    resorts_list = []
    for i in range(len(data)):
        coordinates = data[i][7].replace("[", "").replace("]", "").split(",")
        numericCoord = [float(coordinates[0]), float(coordinates[1])]

        resorts_list.append({"name": data[i][1]
                            ,"price": data[i][3]
                            , "closest_town": data[i][4]
                            , "coordinates": numericCoord
                            , "total_length": data[i][8]
                            , "easy_length": data[i][9]
                            , "intermidiate_length": data[i][10]
                            , "difficult_length": data[i][11]
                            , "state": data[i][12]}) 
    return jsonify(resorts_list)

if __name__ == "__main__":
    app.run(debug=True)



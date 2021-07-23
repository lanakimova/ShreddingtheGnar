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
    # return unique states with snow resorts
    states = []   
    stateName = 12 # field 12 contain the name of a state

    data = getData()

    for i in range(len(data)):
        if data[i][stateName] not in states:
            states.append(data[i][stateName])
    states.sort()

    return jsonify(states)

if __name__ == "__main__":
    app.run(debug=True)



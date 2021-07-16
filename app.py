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

@app.route("/states")
def states():
    # return unique states with snow resorts
    states = []   
    stateName = 12 # field 12 contain the name of a state

    data = getData()

    for i in range(len(data)):
        if data[i][stateName] not in states:
            states.append(data[i][stateName])

    return jsonify(states)


@app.route("/getAllResorts", methods=['GET'])
def getAllResorts():
    # Function return list of dictionary with data about snow resorts

    resorts_rows = []
    resorts_fields = []

    with open('static/data/complete_resorts_info.csv', 'r') as csvfile_res:
        csvreader_res = csv.reader(csvfile_res)
        resorts_fields = next(csvreader_res)

        for row in csvreader_res:
            resorts_rows.append(row)

    resorts_list = []
    for i in range(len(resorts_rows)):

        resorts_list.append({resorts_fields[1]: resorts_rows[i][1]
                            , resorts_fields[2]: resorts_rows[i][2]
                            , resorts_fields[3]: resorts_rows[i][3]
                            , resorts_fields[4]: resorts_rows[i][4]
                            , resorts_fields[5]: resorts_rows[i][5]
                            , resorts_fields[6]: resorts_rows[i][6]
                            , resorts_fields[7]: resorts_rows[i][7]
                            , resorts_fields[8]: resorts_rows[i][8]
                            , resorts_fields[9]: resorts_rows[i][9]
                            , resorts_fields[10]: resorts_rows[i][10]
                            , resorts_fields[11]: resorts_rows[i][11]
                            , resorts_fields[12]: resorts_rows[i][12]
                            , resorts_fields[13]: resorts_rows[i][13]
                            , resorts_fields[14]: resorts_rows[i][14]}) 
    return jsonify(resorts_list)

@app.route('/isResortInState')
def isResortInState(resort_name):
    resortInState = False

    return resortInState

@app.route('averagePrice/<state>')
def averagePrice(state='All States'):
    # function return average price for given state. 
    average_price = 0
    # if state == 'All States':

    return average_price



if __name__ == "__main__":
    app.run(debug=True)



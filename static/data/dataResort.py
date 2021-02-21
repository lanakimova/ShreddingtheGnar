import json

f = open("statis/data/ski_areas.geojson")
data = json.load(f)

resorts_location = []

for i in range(len(data['features'])):
    
    if data['features'][i]['properties']['location'] != None and data['features'][i]['properties']['location']['iso3166_1Alpha2'] == 'US':
        resorts_location.append({'resort_name': data['features'][i]['properties']['name']
                                ,'state': data['features'][i]['properties']['location']['localized']['en']['region']
                                ,'geometry': data['features'][i]['geometry']['coordinates']
                                ,"website": data['features'][0]['properties']["website"]})

print(resorts_location)


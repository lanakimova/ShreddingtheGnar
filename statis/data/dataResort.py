import json

f = open("statis/data/ski_areas.geojson")
data = json.load(f)

resorts_location = []

for i in range(len(data['features'])):
    
    if data['features'][i]['properties']['location'] != None and data['features'][i]['properties']['location']['iso3166_1Alpha2'] == 'US':
        resorts_location.append({'resort_name': data['features'][i]['properties']['name']
                                ,'state': data['features'][i]['properties']['location']['localized']['en']['region']
                                ,'geometry': data['features'][i]['geometry']['coordinates']})
        # resorts_location['resort_name'] = data['features'][i]['properties']['name']
        # resorts_location['state'] = data['features'][i]['properties']['location']['localized']['en']['region']
        # resorts_location['geometry'] = data['features'][i]['geometry']['coordinates']
        

# print(data['features'][0]['geometry']['coordinates'])

print(len(resorts_location))
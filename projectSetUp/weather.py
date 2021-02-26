def get_weather():
    # Dependencies and Setup
    import matplotlib.pyplot as plt
    import pandas as pd
    import numpy as np
    import requests
    from datetime import datetime
    from scipy.stats import linregress
    import scipy.stats as st
    from pprint import pprint

    # Import API key
    from config import weather_api_key
    from config import snow_api_key



    resort_data = pd.read_csv("statis/data/resorts.csv")
    resort_df = pd.DataFrame(resort_data)
    # resort_df.head()

    # Set index to name
    # resort = resort_df.set_index('name')
    updated_resort = resort_df.drop(['Unnamed: 0'], axis = 1)
    # updated_resort['country'] = country

    test_df = updated_resort[updated_resort['closest_town'].notna()]

    cities = list(test_df['closest_town'])

    resort_names = list(test_df['name'])

    # Lists to call
    new_city = []
    date = [] # Make this date updated
    lat = []
    long = []
    temp_main = [] # Use this to get current temperature
    feels_like = []
    temp_min = []
    temp_max = []
    temp_description = []
    hum = []
    wind_speed = []
    cloudiness = []

    x = 0 

    print('Beginning Data Retrieval')
    print("-"*64)  
    for city in cities:
        url = "http://api.openweathermap.org/data/2.5/weather?"
        units = 'metric'
        query_url = f'{url}appid={weather_api_key}&q={city}&units={units}'
        
        
        try:
            response = requests.get(query_url + city).json()
            x = x + 1
            print(f'Processing Record {x} | {city}')
            new_city.append(response['name'])
            date.append((datetime.fromtimestamp(response['dt'])).strftime('%m/%d/%y'))
            lat.append(response['coord']['lat'])
            long.append(response['coord']['lon'])
            temp_main.append(response['main']['temp'])
            feels_like.append(response['main']['feels_like'])
            temp_min.append(response['main']['temp_min'])
            temp_max.append(response['main']['temp_max'])
            temp_description.append(response['weather'][0]['description'])       
            hum.append(response['main']['humidity'])
            wind_speed.append(response['wind']['speed'])
            cloudiness.append(response['clouds']['all'])
        except KeyError:
            print("City not found", city)

    # SNOW API
    daily_chance_snow = []
    hourly_chance_snow = []
    local_time = []
    hour = []

    x = 0 
    print('Beginning Data Retrieval')
    print("-"*64)  
    for city in new_city:
    #     url = "http://api.openweathermap.org/data/2.5/weather?"
        url = "http://api.weatherapi.com/v1/forecast.json?"
    #     units = 'metric'
        days = "1"
        query_url = f'{url}key={snow_api_key}&q={city}&days={days}'
        
        
        try:
            # Get metrics from api doc/response
            response = requests.get(query_url + city).json()
            x = x + 1
            print(f'Processing Record {x} | {city}')
            daily_chance_snow.append(response['forecast']['forecastday'][0]['day']['daily_chance_of_snow'])
            hourly_chance_snow.append(response['forecast']['forecastday'][0]['hour'][0]['chance_of_snow'])
            local_time.append(response['location']['localtime'])
            hour.append(response['forecast']['forecastday'][0]['hour'][0]['time'])
        except KeyError:
            print("City not found", city)

    combined = {
        "city": new_city,
        "date": date,
        "latitude": lat,
        "longitude": long,
        "temperature": temp_main,
        "feels_like":  feels_like,
        "temp_min": temp_min,
        "temp_max": temp_max,
        "temp_description": temp_description,
        "humidity": hum,
        "cloudiness": cloudiness,
        "wind_speed": wind_speed, 
        "local_time": local_time,
        "daily_chance_snow": daily_chance_snow,
        "hourly_chance_snow": hourly_chance_snow,
    }
    combined_df = pd.DataFrame(combined)

    combined_df['local_time'] = pd.to_datetime(combined_df['local_time'])

    combined_df['new_date'] = [d.date() for d in combined_df['local_time']]
    combined_df['time'] = [d.time() for d in combined_df['local_time']]


    final_df = combined_df.drop(columns = ['local_time', 'new_date'])

    new_final_df = final_df[['city', 'date', 'time', 'latitude', 'longitude', 'temperature', 'feels_like', 'temp_min', 'temp_max', 'temp_description', 'humidity', 'cloudiness', 'wind_speed', 'daily_chance_snow', 'hourly_chance_snow']]
    
    weather_dict = new_final_df.to_dict()
    # new_final_df.to_csv('statis/data/city_weather.csv', index=False)
    


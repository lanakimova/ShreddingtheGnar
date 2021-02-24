# Dependencies
# import pandas as pd
from sqlalchemy import create_engine
from config import postgrepass

db_path = f'postgresql://postgres:{postgrepass}@localhost:5432/SkiResorts'
engine = create_engine(db_path)
# conn = engine.connect()

def getCoordinates(state):
    coords = []
    with engine.connect() as conn:
        query = f"SELECT CAST (lat as FLOAT) FROM resorts_info WHERE state = '{state}'"
        lat = conn.execution_options(stream_results=True).execute(query).fetchall()

        query = f"SELECT CAST (lon as FLOAT) FROM resorts_info WHERE state = '{state}'"
        lon = conn.execution_options(stream_results=True).execute(query).fetchall()

        if len(lat) == len(lon):
            for i in range(len(lat)):
                print(i, lat[i], lon[i])
                coords.append([lat[i], lon[i]])



    return coords
    

print(getCoordinates('California'))

def getStates():
    with engine.connect() as conn:
        query = f"SELECT state FROM resorts_info WHERE state NOT IN ('Empty', 'Unknown')"
        states = conn.execution_options(stream_results=True).execute(query).fetchall()
    return states

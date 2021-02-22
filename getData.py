# Dependencies
# import pandas as pd
from sqlalchemy import create_engine
from config import postgrepass

db_path = f'postgresql://postgres:{postgrepass}@localhost:5432/SkiResorts'
engine = create_engine(db_path)
# conn = engine.connect()

def getCoordinates(state):
    with engine.connect() as conn:
        query = f"SELECT geometry FROM resorts_info WHERE state = '{state}'"
        result = conn.execution_options(stream_results=True).execute(query).fetchall()

        coordinates = []
        for i in range(len(result)):
            temp = type(result[i])

    return temp
    

print(getCoordinates('California'))


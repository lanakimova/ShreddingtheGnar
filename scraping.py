#!/usr/bin/env python
# coding: utf-8

# In[ ]:


# Scraping 
# https://www.skiresort.info/ski-resorts/usa/


# In[2]:


# Import dependencies
import pandas as pd
import requests
# import pymongo
from splinter import Browser
from bs4 import BeautifulSoup as bs
from flask import Flask, render_template, redirect
# from flask_pymongo import PyMongo
from webdriver_manager.chrome import ChromeDriverManager
from pprint import pprint


# In[15]:


# GETTING ALL NAMES AND LINKS FOR RESORTS
url = 'https://www.skiresort.info/ski-resorts/usa/'

resort_names = []
resort_links = []

for x in range(1, 5):
    request1 = requests.get(url)

    soup1 = bs(request1.text, 'html.parser')
    
    panel = soup1.find('div', class_= "panel panel-primary")
    resort_panels = panel.find_all("div", class_="panel panel-default resort-list-item resort-list-item-image--big")

    for resort in resort_panels:
        title = resort.find("a", class_="h3")
        resort_names.append(title.text)
        resort_links.append(title["href"])
        
    url = f'https://www.skiresort.info/ski-resorts/usa/page/{x+1}'


# In[49]:


len(resort_names), len(resort_links)


# In[16]:


# GOING THROUGH RESORT PAGES AND GATHERING RESORT SLOPE LENGTHS
# RETURNS A LIST OF DICTIONARIES WITH SLOPE INFORMATION 
resort_slopes=[]
for x in resort_links:

    request1 = requests.get(x)
    soup1 = bs(request1.text, 'html.parser')
    
    if (soup1.find("a", class_="detail-links link-img shaded zero-pad-bottom chart")):
        
        stuff1 = soup1.find("a", class_="detail-links link-img shaded zero-pad-bottom chart").find("div", class_="description")
        total_slope= stuff1.find("div").text
        slope_type_lengths = stuff1.find("div", class_="table-graph-first").find_all("td", class_="distance")
    
        splitter = total_slope.split()
    
        splits = []
        for y in slope_type_lengths:
            split = float(y.text.split()[0])
            splits.append(split)
    
        slope_lengths={'total': float(splitter[1]), 'easy': splits[0], 'intermediate': splits[1], 'difficult': splits[2]}
        resort_slopes.append(slope_lengths)
    else:
        resort_slopes.append('N/A')


# In[18]:


len(resort_slopes)


# In[17]:


# GOING THROUGH RESORT PAGES AND GATHERING RESORT PRICES
# RETURNS LIST OF RESORT PRICES
resort_prices = []
for x in resort_links:

    request1 = requests.get(x)

    soup1 = bs(request1.text, 'html.parser')


    if (soup1.find(id="selTicketA")):
        
        price = soup1.find(id="selTicketA").text


        split1 = price.split()
        split2 = float(split1[1].split(',')[0])

        resort_prices.append(split2)
    else:
        resort_prices.append('N/A')


# In[7]:


len(resort_prices)


# In[56]:


#GETTING CLOSEST TOWNS
closest_towns = []

for x in resort_links:

    request1 = requests.get(x)
    soup1 = bs(request1.text, 'html.parser')
    
    if (soup1.find("ul", class_="detail-overview-citylist")):
        
        stuff1 = soup1.find("ul", class_="detail-overview-citylist")
        town = stuff1.find("li").find("a").text

        closest_town.append(town)
    
    else:
        closest_town.append('N/A')

    


# In[22]:


len(closest_towns)


# In[52]:


#GETTING STATES
regions = []

for x in resort_links:

    request1 = requests.get(x)
    soup1 = bs(request1.text, 'html.parser')
    stuff1 = soup1.find(id="main-content")
    
    try:
        town = stuff1.find_all("p")[1].find("a").text

        regions.append(town)
    
    except:
        regions.append('N/A')


# In[54]:


len(regions)


# In[62]:


# GATHERS ALL INFORMATION AND RETURNS A DICTIONARY

#AREA HERE IS COMMENTED OUT BECAUSE IT IS RUN ABOVE
# NAMES AND LINKS

# url = 'https://www.skiresort.info/ski-resorts/usa/'

# resort_names = []
# resort_links = []

# for x in range(1, 5):
#     request1 = requests.get(url)

#     soup1 = bs(request1.text, 'html.parser')
    
#     panel = soup1.find('div', class_= "panel panel-primary")
#     resort_panels = panel.find_all("div", class_="panel panel-default resort-list-item resort-list-item-image--big")

#     for resort in resort_panels:
#         title = resort.find("a", class_="h3")
#         resort_names.append(title.text)
#         resort_links.append(title["href"])
        
#     url = f'https://www.skiresort.info/ski-resorts/usa/page/{x+1}'

# GOING THROUGH RESORT PAGES AND GATHERING RESORT SLOPE LENGTHS
all_resort_info=[]

for x in range(0, len(resort_links)):
    
    resort_info = {'name': resort_names[x], 'link': resort_links[x]}
    
# LENGTHS

    request1 = requests.get(resort_links[x])
    soup1 = bs(request1.text, 'html.parser')
    
    if (soup1.find("a", class_="detail-links link-img shaded zero-pad-bottom chart")):
        
        stuff1 = soup1.find("a", class_="detail-links link-img shaded zero-pad-bottom chart").find("div", class_="description")
        total_slope= stuff1.find("div").text
        slope_type_lengths = stuff1.find("div", class_="table-graph-first").find_all("td", class_="distance")
    
        splitter = total_slope.split()
    
        splits = []
        for y in slope_type_lengths:
            split = float(y.text.split()[0])
            splits.append(split)
    
        slope_lengths={'total': float(splitter[1]), 'easy': splits[0], 'intermediate': splits[1], 'difficult': splits[2]}
        resort_info["slopes"] = slope_lengths  
    else:
        resort_info["slopes"] = 'N/A'  

    
# PRICES

    if (soup1.find(id="selTicketA")):
        
        price = soup1.find(id="selTicketA").text
        
        split1 = price.split()
        split2 = float(split1[1].split(',')[0])

        resort_info["price"]= split2
        
    else:
        
        resort_info["price"]='N/A'
    
    
#GETTING CLOSEST TOWNS

    
    if (soup1.find("ul", class_="detail-overview-citylist")):
        
        stuff1 = soup1.find("ul", class_="detail-overview-citylist")
        town = stuff1.find("li").find("a").text

        resort_info['closest_town']= town
    
    else:
        resort_info['closest_town']= 'N/A'

        
#GETTING Regions


    reg = soup1.find(id="main-content")
    
    try:
        reg1 = reg.find_all("p")[1].find("a").text

        resort_info['region']= reg1
    
    except:
        resort_info['region']= 'N/A'
        
    
    
    all_resort_info.append(resort_info)


# In[63]:


all_resort_info


# In[64]:


len(all_resort_info)


# In[68]:


all_resort_info_pd = pd.DataFrame(all_resort_info)
all_resort_info_pd.head(287)


# In[34]:


all_resort_info[0]['slopes']


# In[69]:


total_len = []
easy_len = []
intermediate_len = []
difficult_len = []

for i in range(len(all_resort_info)):
    if all_resort_info[i]['slopes'] != 'N/A':
        total_len.append(all_resort_info[i]['slopes']['total'])
        easy_len.append(all_resort_info[i]['slopes']['easy'])
        intermediate_len.append(all_resort_info[i]['slopes']['intermediate'])
        difficult_len.append(all_resort_info[i]['slopes']['difficult'])
    else :
        total_len.append(None)
        easy_len.append(None)
        intermediate_len.append(None)
        difficult_len.append(None)


# In[70]:


all_resort_info_pd['total_len'] = total_len
all_resort_info_pd['easy_len'] = easy_len
all_resort_info_pd['intermediate_len'] = intermediate_len
all_resort_info_pd['difficult_len'] = difficult_len
all_resort_info_pd.head()


# In[71]:


all_resort_info_pd = all_resort_info_pd.drop(columns = ['slopes'])
all_resort_info_pd.head()


# In[46]:


from sqlalchemy import create_engine
from config import postgrepass


# In[48]:


# Set up connection to DB
db_path = f'postgresql://postgres:{postgrepass}@localhost:5432/SkiResorts'
engine = create_engine(db_path)
conn = engine.connect()


# In[51]:


all_resort_info_pd.to_sql('resorts', conn, if_exists='append')


# In[72]:


all_resort_info_pd.to_csv("statis/data/resorts.csv")


# In[ ]:





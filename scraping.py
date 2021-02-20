# Import dependencies
import pandas as pd
import requests
import pymongo
from splinter import Browser
from bs4 import BeautifulSoup as bs
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
from webdriver_manager.chrome import ChromeDriverManager


def scrape():
    # # GETTING ALL NAMES AND LINKS FOR RESORTS
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


    # # len(resort_names), len(resort_links)

    # # GOING THROUGH RESORT PAGES AND GATHERING RESORT SLOPE LENGTHS
    # # RETURNS A LIST OF DICTIONARIES WITH SLOPE INFORMATION 
    # resort_slopes=[]
    # for x in resort_links:

    #     request1 = requests.get(x)
    #     soup1 = bs(request1.text, 'html.parser')
        
    #     if (soup1.find("a", class_="detail-links link-img shaded zero-pad-bottom chart")):
            
    #         stuff1 = soup1.find("a", class_="detail-links link-img shaded zero-pad-bottom chart").find("div", class_="description")
    #         total_slope= stuff1.find("div").text
    #         slope_type_lengths = stuff1.find("div", class_="table-graph-first").find_all("td", class_="distance")
        
    #         splitter = total_slope.split()
        
    #         splits = []
    #         for y in slope_type_lengths:
    #             split = float(y.text.split()[0])
    #             splits.append(split)
        
    #         slope_lengths={'total': float(splitter[1]), 'easy': splits[0], 'intermediate': splits[1], 'difficult': splits[2]}
    #         resort_slopes.append(slope_lengths)
    #     else:
    #         resort_slopes.append('N/A')

    # # len(resort_slopes)

    # # GOING THROUGH RESORT PAGES AND GATHERING RESORT PRICES
    # # RETURNS LIST OF RESORT PRICES
    # resort_prices = []
    # for x in resort_links:

    #     request1 = requests.get(x)

    #     soup1 = bs(request1.text, 'html.parser')


    #     if (soup1.find(id="selTicketA")):
            
    #         price = soup1.find(id="selTicketA").text


    #         split1 = price.split()
    #         split2 = float(split1[1].split(',')[0])

    #         resort_prices.append(split2)
    #     else:
    #         resort_prices.append('N/A')

    # # len(resort_prices)

    # #GETTING CLOSEST TOWNS
    # closest_towns = []

    # for x in resort_links:

    #     request1 = requests.get(x)
    #     soup1 = bs(request1.text, 'html.parser')
        
    #     if (soup1.find("ul", class_="detail-overview-citylist")):
            
    #         stuff1 = soup1.find("ul", class_="detail-overview-citylist")
    #         town = stuff1.find("li").find("a").text

    #         closest_towns.append(town)
        
    #     else:
    #         closest_towns.append('N/A')

    # # len(closest_towns)

    # #GETTING STATES
    # regions = []

    # for x in resort_links:

    #     request1 = requests.get(x)
    #     soup1 = bs(request1.text, 'html.parser')
    #     stuff1 = soup1.find(id="main-content")
        
    #     try:
    #         town = stuff1.find_all("p")[1].find("a").text

    #         regions.append(town)
        
    #     except:
    #         regions.append('N/A')

    # # len(regions)

    # GATHERS ALL INFORMATION AND RETURNS A DICTIONARY

    # AREA HERE IS COMMENTED OUT BECAUSE IT IS RUN ABOVE
    # NAMES AND LINKS

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

    return all_resort_info








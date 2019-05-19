from imdb import IMDb
import requests
import re
import json;
from bs4 import BeautifulSoup
from string import ascii_uppercase
from pymongo import MongoClient
from datetime import datetime

client = MongoClient("127.0.0.1")
db = client.movie_list
collect = db.top250

top250_url = "http://akas.imdb.com/chart/top"


def get_top250():
    r = requests.get(top250_url)
    html = r.text.split("\n")
    result = []
    for line in html:
        line = line.rstrip("\n")
        m = re.search(r'data-titleid="tt(\d+?)">', line)
        if m:
            _id = m.group(1)
            result.append(_id)
    #
    return result
# create an instance of the IMDb class
ia = IMDb()


# get a movie
print(get_top250()[0])

def makeJsonForTop250():
    movie_ids = get_top250();
    movie_info = []

    for i in range(2):
        print("working")
        movies = ia.get_movie(movie_ids[i])

        movie = {
            'title': movies['title'],
            'year': movies['year'],
            'urlPoster': movies['full-size cover url'],
            'idIMDB': "tt"+movie_ids[i],
            'rating': movies['rating'],
            'ranking': i+1
        }
        collect.replace_one({"boxOfficeId": movie["idIMDB"]}, movie, upsert=True)
    print(movie_info)
makeJsonForTop250()











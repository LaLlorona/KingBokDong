import json, requests, re
from bs4 import BeautifulSoup
from string import ascii_uppercase
from pymongo import MongoClient

client = MongoClient("127.0.0.1")
db = client.movie_list
mojo100 = db.mojo100

non_decimal = re.compile(r'[^\d.]+')
major_sites = ["NUM"]
movies = []

# feed alphabet into major_site crawl
for c in ascii_uppercase:
    major_sites.append(c)

# loop major sites

url = "https://www.boxofficemojo.com/alltime/world/"
r = requests.get(url)
print(url)

soup = BeautifulSoup(r.text, "html.parser")

rows = soup.find_all("tr")

rank = 1
for row in rows:
    if "<a href=\"/movies/?id=" in str(row) and "$" in str(row):

        cells = row.find_all("td")

        # total gross
        movie_name = cells[1].get_text()
        print(movie_name)

        movie_url = cells[1].a['href']
        print(movie_url)

        totalGross = cells[3].get_text().replace("$", "").replace(",", "")
        print(totalGross)

        image_page = requests.get("https://www.boxofficemojo.com"+movie_url)

        soup = BeautifulSoup(image_page.text, "html.parser")

        images = soup.find_all("img")

        image_url = ""

        for img in images:
            if 'border="1"' in str(img):
                image_url = img['src']
                print(image_url)
        movie = {
            "title": movie_name,
            "totalGross": totalGross,
            "image_url": image_url,
            "movie_url": "https://www.boxofficemojo.com"+movie_url,
            "rank": rank


        }

        print(movie)
        mojo100.replace_one({"title": movie["title"]}, movie, upsert=True)
        rank += 1


print("done")

import json, requests, re
from bs4 import BeautifulSoup
from string import ascii_uppercase
from pymongo import MongoClient
from datetime import datetime

client = MongoClient("127.0.0.1")
db = client.movie_list
collect = db.collect

non_decimal = re.compile(r'[^\d.]+')
major_sites = ["NUM"]
movies = []

# feed alphabet into major_site crawl
for c in ascii_uppercase:
    major_sites.append(c)

# loop major sites
for site in major_sites:

    page = 1
    while True:

        # fetch table
        url = "http://www.boxofficemojo.com/movies/alphabetical.htm?letter=" + site + "&p=.htm&page=" + str(page)
        r = requests.get(url)

        print(url)

        # load html file into parser
        soup = BeautifulSoup(r.text, "html.parser")

        # crawl rows
        rows = soup.find_all("tr")

        parsedCounter = 0

        for row in rows:
            if "<a href=\"/movies/?id=" in str(row) and "$" in str(row):

                cells = row.find_all("td")
                parsedCounter += 1

                # total gross
                totalGross = cells[2].get_text().replace("$", "").replace(",", "")
                totalGross = non_decimal.sub('', totalGross)

                if totalGross:
                    totalGross = int(totalGross)

                # start date
                startDate = cells[6].get_text()

                if startDate and "/" in startDate:
                    startDate = startDate.split("/")

                    if len(startDate) == 3:
                        year = int(startDate[2])
                        month = int(startDate[0])
                        day = int(startDate[1])
                        startDate = datetime(year, month, day)
                    else:
                        startDate = None
                else:
                    startDate = None

                # box office if
                link = cells[0].find("a").get("href")
                if link:
                    link = link.replace("/movies/?id=", "").replace(".htm", "")

                # fetch director
                dir_url = "http://www.boxofficemojo.com/movies/?id=" + link + ".htm"
                dir_r = requests.get(dir_url)

                # load html file into parser
                dir_soup = BeautifulSoup(dir_r.text, "html.parser")

                images = dir_soup.find_all("img")

                image_url = ""

                for img in images:
                    if 'border="1"' in str(img):
                        image_url = img['src']
                        #print(image_url)

                directors = []
                for a in dir_soup.find_all("a"):
                    if "/people/chart/?view=Director" in a.get("href"):
                        directors.append(a.get_text())

                movie = {
                    "title": cells[0].get_text(),
                    "boxOfficeId": link,
                    "gross": totalGross,
                    "urlPoster": image_url,
                    "movie_url" : dir_url,
                    "release": startDate,
                    "directors": directors

                }

                print(movie)
                collect.replace_one({"boxOfficeId": movie["boxOfficeId"]}, movie, upsert=True)

        page += 1

        if site == "NUM" or parsedCounter == 0:
            break

print("done")

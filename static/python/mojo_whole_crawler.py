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
count = 0

# feed alphabet into major_site crawl
for c in ascii_uppercase:
    major_sites.append(c)

# loop major sites
for site in major_sites:

    page = 1
    print(site)

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
            if "<a href=\"/movies/?id=" in str(row):
                gross = 0

                cells = row.find_all("td")
                parsedCounter += 1

                # total gross
                # totalGross = cells[2].get_text().replace("$", "").replace(",", "")
                # totalGross = non_decimal.sub('', totalGross)
                #
                # if totalGross:
                #     totalGross = int(totalGross)


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

                b = dir_soup.find_all("b")
                print(cells[0].get_text())
                for i in range(len(b)-1, 0, -1):
                    if 'Worldwide:' in b[i]:
                        gross = int((b[i+1].text.replace("$", "").replace(",", "")))
                        print(gross)
                        break
                    elif 'Domestic:' in b[i]:
                        gross = int((b[i+1].text.replace("$", "").replace(",", "")))
                        print(gross)


                movie = {
                    "title": cells[0].get_text(),
                    "boxOfficeId": link,
                    "gross": gross,
                    "urlPoster": image_url,
                    "movie_url" : dir_url,
                    "release": startDate,
                    "directors": directors

                }

                #print(movie)
                collect.replace_one({"boxOfficeId": movie["boxOfficeId"]}, movie, upsert=True)
                print("currently working %d  element" %count)
                count +=1

        page += 1

        if site == "NUM" or parsedCounter == 0:
            break

print("done")

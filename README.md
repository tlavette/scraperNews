# Scraper News

The design is to allows users to view high level news data and add custom notations. The website being scraped is BlackAmericaWeb.com.  

Web Scraping is the process in which data is targeted and extracted by specific elements and rendered in a separate file for rendering. In this project, I've selected trending news titles and links.  There are also additional features pending to include saving and adding notes which will be stored in a MongoDB backend for retrieval.  


## Technologies Used:
[ ] Cheerio Nodejs library
[ ] MongoDB
[ ] Express - Handlebars
[ ] Mongojs
[ ] Heroku
[ ] jQuery




## Unique Challenges
The unique challenges presented was the use of mongojs vs mongoose for the later features to support adding notes.  This will require creating new schema structures. 





## Use
Upon loading the page you are presented with option for "What's Trending" this will generate a new scrape from what is saved in the database.  The user is then presented with a list of articles listing title and button links to the actual article.  

## Pending Features
[ ] Checkbox functionality currently logs the boolean state of checked or not checked.  It also logs the ID associated. This will need functionality to not clear articles that have the boolean value of "true" isChecked.

[ ] Notes - functionality is needed to add specific notes to the associated article ID and save upon checked as well.  All of which will need a new schema implementation via mongoose.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var path = require("path");
var mongoose = require("mongoose");




// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");

// Making public folder public
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// Database configuration
var databaseUrl = process.env.MONGODB_URI||"scraper";
var collections = ["newScrapedData"];
var notes = ["note"];


// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route to Home Page
app.get("/", function(req, res) {
  res.render("contact");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.newScrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      console.log(found)
      res.render("allnews", { articles: found });
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  db.newScrapedData.remove({});
  
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://blackamericaweb.com").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // For each element with a "title" class
    $("div.post-title").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).text();
      // var title = $(element).parent("a").text();
      var link = $(element).parent("a").attr("href");

      // adding comment

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        db.newScrapedData.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);

            
          }
        });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
  // res.render("allnews");
});

// submit action to insert note in the notes collection.
app.post("/notes", function(req, res){
  console.log(req.body);

  // insert notes into the notes collection
  db.note.insert(req.body, function(error, noted){
    // log errors
    if (error){
    console.log(error);
  }
  else {
    res.send(noted);
  }
  });
})



// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});


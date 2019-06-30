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
var databaseUrl = "newscraper";
var collections = ["newScrapedData"];
var notes = ["note"];

// mongoose connect
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines");


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

















// // Dependency list
// var cheerio = require("cheerio");
// var axios = require("axios");
// var express = require("express");
// const path = require("path");

// // Set up Express App
// var app = express();
// var PORT = process.env.PORT || 8080

// // Set up Express to handle data parsing.- standard
// app.use(express.urlencoded({ extended: true }));

// app.use(express.json());
// app.use(express.static("./public"));


// // Routes
// // require("./routes/api-routes.js")(app);
// require("./routes/html-routes.js")(app);


// // Making a request via axios for reddit's "webdev" board. We are sure to use old.reddit due to changes in HTML structure for the new reddit. The page's Response is passed as our promise argument.
// axios.get("https://blackamericaweb.com/").then(function(response) {

//   // Load the Response into cheerio and save it to a variable
//   // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//   var $ = cheerio.load(response.data);

//   // An empty array to save the data that we'll scrape
//   var results = [];

//   // With cheerio, find each p-tag with the "title" class
//   // (i: iterator. element: the current element)
//   $("div.post-title").each(function(i, element) {

//     // Save the text of the element in a "title" variable
//     var title = $(element).text();

//     // In the currently selected element, look at its child elements (i.e., its a-tags),
//     // then save the values for any "href" attributes that the child elements may have
//     var link = $(element).parent().attr("href");

//     // Save these results in an object that we'll push into the results array we defined earlier
//     results.push({
//       title: title,
//       link: link
//     });
//   });

//   // Log the results once you've looped through each of the elements found with cheerio
//   res.json(results);
// });

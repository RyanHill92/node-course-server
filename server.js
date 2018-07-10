const express = require('express');
const hbs = require('hbs');
const fs = require('fs');


var app = express();

//Again, needs an ABSOLUTE path to know where those partials are coming from.
hbs.registerPartials(__dirname + '/views/partials');

//To create helpers...
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());

hbs.registerHelper('upDownIt', (text) => {
  let output = [];
  for (let i=0; i<text.length; i++) {
    if (i === 0 || i % 2 === 0) {
      output.push(text[i].toUpperCase());
    } else {
      output.push(text[i].toLowerCase());
    }
  }
  return output.join('');
});

//Line of code necessary, besides the require, to use the Handlebars plug-in.
app.set('view engine', 'hbs');

//One way to push a directory to the server. Note the need for an ABSOLUTE path.
//app.use(express.static(__dirname + '/public'));

//More middleware.
app.use((req, res, next) => {
  let now = new Date().toString();

//Again, the req object contains all sorts of HTTP data.
  let log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
  //Calling an async function without a callback is now deprecated.
    if (err) {
      console.log('Unable to write to server.log.');
    }
  });
  next();
})

//The middleware below, if enabled, keeps anything else below it from running.
// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageName: 'Site Under Maintenance'
//   });
// })

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageName: 'Home Page',
    welcomeMessage: "Welcome to the site!"
  });
})

app.get('/about', (req, res) => {
//Another way to push files to the server--templates.
//Allows you to render any of the templates in your views folder.
//You can also pass this function a data object, whose key-value pairs
//can plug dynamically into your template.
  res.render('about.hbs', {
    pageName: 'About Me',
  });
})

app.get('/to-do', (req, res) => {
  res.render('to-do.hbs', {
    pageName: 'To-Do List',
  });
})

app.listen(3000, () => console.log('Server up on Port 3000'));

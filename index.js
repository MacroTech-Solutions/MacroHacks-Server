const express = require('express');
var admin = require('firebase-admin');
const path = require('path');
var bodyParser = require('body-parser');
var serviceAccount = require("./macrohacks-macrotech-firebase-adminsdk-ycmff-dc86532e3b.json");
const PORT = process.env.PORT || 80;

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://macrohacks-macrotech.firebaseio.com"
});

var database = admin.database();

express()
  .use(express.static(path.join(__dirname, 'build')))
  .use(bodyParser.urlencoded({ extended: false }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/register', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'register.html'));
  })
  .get('/terms', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'terms.html'));
  })
  .get('/privacy', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'privacy.html'));
  })
  .get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  })
  .post('/register', async function (req,res){
    res.setHeader('Access-Control-Allow-Origin', 'https://macrohacks.macrotechsolutions.us');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    let email = req.headers.email;
    let firstName = req.headers.firstname;
    let lastName = req.headers.lastname;
    let discord = req.headers.discord;
    if (!email) {
      returnVal = {
        data: 'Please enter an email address.'
      };
      res.send(returnVal);
      return;
    }
    let myVal = await database.ref("participants").orderByChild('discord').equalTo(discord).once("value");
    myVal = myVal.val();
    let myVal2 = await database.ref("participants").orderByChild('email').equalTo(email).once("value");
    myVal2 = myVal2.val();
    if (myVal) {
      returnVal = {
        data: 'Email address has already been used for a registration.'
      };
    } else if (myVal2){
      returnVal = {
        data: 'Discord username has already been used for a registration.'
      };
    } else if(discord == "Sai#3914" || discord == "Arya#7047" || discord == "JoshRak#8450" || discord == "Helix#1504"){
      returnVal = {
        data: 'This Discord username belongs to a judge. Please use your own Discord username.'
      };
    }else if (firstName.length == 0 || lastName.length == 0) {
      returnVal = {
        data: 'Invalid Name'
      };
    } else if (!(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(firstName) && /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(lastName))) {
      returnVal = {
        data: 'Invalid Name'
      };
    } else if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      .test(email))) {
      returnVal = {
        data: 'Invalid email address.'
      };
    } else if(!(/^[a-zA-z ]+#\d\d\d\d$/.test(discord))){
      returnVal = {
        data: 'Invalid Discord username. Please use the format Username#0000'
      };
    } else if(req.headers.terms == false || req.headers.terms == "false"){
      returnVal = {
        data: 'Please agree to the terms and conditions.'
      };
    } else{
      database.ref("participants").push({
        email: email,
        discord: discord,
        name: `${firstName} ${lastName}`
      });
      returnVal = {
        data: 'Success'
      };
    }
    res.send(returnVal);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);

var checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);

var cors_proxy = require('./lib/cors-anywhere');
cors_proxy.createServer({
  originBlacklist: originBlacklist,
  originWhitelist: originWhitelist,
  requireHeader: ['origin', 'x-requested-with'],
  checkRateLimit: checkRateLimit,
  removeHeaders: [
    'cookie',
    'cookie2',
    'x-heroku-queue-wait-time',
    'x-heroku-queue-depth',
    'x-heroku-dynos-in-use',
    'x-request-start',
  ],
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: false,
  },
})
  .listen(4911, () => console.log(`Listening on ${4911}`))
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
  .get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
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
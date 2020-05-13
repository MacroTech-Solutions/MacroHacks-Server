const express = require('express');
var Discord = require('discord.io');
var logger = require('winston');
var admin = require('firebase-admin');
const path = require('path');
var bodyParser = require('body-parser');
var serviceAccount = require("./mobilehacks-macrotech-firebase-adminsdk-oyl9c-5685056c46.json");
const PORT = process.env.PORT || 80;

var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mobilehacks-macrotech.firebaseio.com"
});

var database = admin.database();

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: "NzEwMTc2NDQ2MjIzNDgzMDIx.XrwpZA.DhUEXWGgQxR1hmrJ2dryAxcaHao",
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        if (channelID == "710182346640326807") {
            switch (cmd) {
                case 'verify':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Verifying...'
                    });
                    break;
            }
        }
    }
});

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
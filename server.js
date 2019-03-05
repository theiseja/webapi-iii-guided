const express = require('express'); // importing a CommonJS module
const logger = require('morgan');
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');
const parser = express.json();
const logMiddleware = logger('dev');
const securityMiddleware = helmet();

server.use(parser, logMiddleware, securityMiddleware, teamNamer, teamLogger);

server.use('/api/hubs', restricted, hubsRouter);

function teamNamer(req, res, next) {  // custom middleware function
  req.team = "pt3";
  next(); // can pass a value, usually use an error
}

function teamLogger(req, res, next) {
  if (req.team) {
    console.log('team is:', req.team);
  }
  next();
}



function restricted(req, res, next) {
  const password = req.headers.authorization;

  if (password === 'mellon') {
    next();
  } else if (password) {
    res.status(401).json({ err: 'Invalid credentials'});
  } else {
    next({ err: 'no credentials provided'});
  }
}

server.get('/', (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team}, to the Lambda Hubs API</p>
    `);
});

server.use((err, req, res, next) => {  // error handler
  res.status(400).json({ message: 'error thrown in server',
err: err
});
});

module.exports = server;

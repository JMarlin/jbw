// List of libs that will be globally accesible 
// to all server code
var cluster = require('cluster'),
    http    = require('http'),
    url     = require('url'),
    pg      = require('pg');

// List of libs that will be globally accesible 
// to all server code
var cluster,
    http,
    url,
    fs,
    pg;

function Libs() {

    cluster = require('cluster');
    http    = require('http');
    url     = require('url');
    fs      = require('fs');
    pg      = require('pg');
}

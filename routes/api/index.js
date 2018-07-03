const api = require("express").Router();

require("./auth")(api);
require("./user")(api);

module.exports = api;

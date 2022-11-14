const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");

afterAll(() => connection.end());

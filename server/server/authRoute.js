import bodyParser from "body-parser";
import runQuery ,{extractData} from './Queries.js';
import connectToDatabase from './connectToDataBase.js';
import cors from "cors";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "./config.js";

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('Inside auth function');
    res.send('Hello World!');
});

export default router;
import bodyParser from "body-parser";
import express from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "./config.js";

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('Inside auth function');
    res.send('Hello World!');
});

router.get('/supplier', async (req, res) => {
    console.log('Inside supplier auth function');
    const token = req.headers.authorization;
    console.log(token);
    if (token==null || !token) {
        console.log('No token provided.');
        return res.json({ auth: false, id: 0, message: 'No token provided.' });
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log('Failed to authenticate token.');
            return res.json({ auth: false, id: 0, message: 'Failed to authenticate token.' });
        }
        console.log(decoded);
        if (decoded.userRole === 'supplier') {
            const resobj = {auth: true, id: decoded.userId, message: 'Authorized.'};
            console.log(resobj);
            return res.json(resobj);
        }
        else {
            return res.send({ auth: false, id:0, message: 'Unauthorized user.' });
        }
    });
});

router.get('/customer', async (req, res) => {
    console.log('Inside customer auth function');
    const token = req.headers.authorization;
    console.log(token);
    if (token==null || !token) {
        console.log('No token provided.');
        return res.json({ auth: false, id: 0, message: 'No token provided.' });
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log('Failed to authenticate token.');
            return res.json({ auth: false, id: 0, message: 'Failed to authenticate token.' });
        }
        console.log(decoded);
        if (decoded.userRole === 'customer') {
            const resobj = {auth: true, id: decoded.userId, message: 'Authorized.'};
            console.log(resobj);
            return res.json(resobj);
        }
        else {
            return res.send({ auth: false, id:0, message: 'Unauthorized user.' });
        }
    });
});

router.get('/employee', async (req, res) => {
    console.log('Inside supplier auth function');
    const token = req.headers.authorization;
    console.log(token);
    if (token==null || !token) {
        console.log('No token provided.');
        return res.json({ auth: false, id: 0, message: 'No token provided.' });
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log('Failed to authenticate token.');
            return res.json({ auth: false, id: 0, message: 'Failed to authenticate token.' });
        }
        console.log(decoded);
        if (decoded.userRole === 'employee') {
            const resobj = {auth: true, id: decoded.userId, message: 'Authorized.'};
            console.log(resobj);
            return res.json(resobj);
        }
        else {
            return res.send({ auth: false, id:0, message: 'Unauthorized user.' });
        }
    });
});

export default router;
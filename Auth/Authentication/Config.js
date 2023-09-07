import dotenv from 'dotenv';
dotenv.config();

export const config = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    connectString: process.env.DATABASE_CONNECTION_STRING,
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

export const ACCESS_TOKEN_SECRET = '206f45aa357ec075ae80517080db00849ec632e485d1514ff0ff2d6be6562536f0d4b9437a016e995daf99eaba1b24274396fdd928539c58a8726bfdade23e50';

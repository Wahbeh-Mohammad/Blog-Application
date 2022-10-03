import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const JWT_EXPIRETIME = process.env.JWT_EXPIRETIME || "4h";
const SERVER_PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI!;

const server = { port: SERVER_PORT, mongoUri: MONGO_URI };
const jwt = { secret: JWT_SECRET, expireTime: JWT_EXPIRETIME };

const config = {
    server,
    jwt,
};

export default config;

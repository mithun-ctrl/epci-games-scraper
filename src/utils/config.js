import { configDotenv } from "dotenv";
configDotenv();

const Config = {
    PORT: process.env.PORT,
    EPIC_URL: process.env.EPIC_URL
}

export default Config;
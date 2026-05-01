// TOKEN MANAGEMENT

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const NIBSS_BASE_URL = process.env.NIBSS_BASE_URL;

let nibssToken = null;
let tokenExpiry = null;

const getNibssToken = async () => {
  
  if (nibssToken && tokenExpiry && Date.now() < tokenExpiry) {
    return nibssToken;
  }

  try {
    const response = await axios.post(`${NIBSS_BASE_URL}/api/auth/token`, {
      apiKey: process.env.NIBSS_API_KEY,
      apiSecret: process.env.NIBSS_API_SECRET,
    });

    nibssToken = response.data.token;
    tokenExpiry = Date.now() + 55 * 60 * 1000; // 55 mins (before 1hr expiry)

    return nibssToken;
  } catch (error) {
    console.error("NIBSS token fetch failed:", error.message);
    throw new Error(`NIBSS authentication failed: ${error.message}`);
  }
  
};

export default getNibssToken;
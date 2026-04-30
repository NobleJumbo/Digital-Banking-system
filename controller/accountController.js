import Account from "../models/Account.js";
import axios from "axios";

export const createAccount = async (req, res) => {
  try {
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW50ZWNoSWQiOiI2OWVmYzMzZGEyZjUyNzBjMjk3NTc5NDUiLCJuYW1lIjoiQ2FwdGF5biBCYW5rIiwiZW1haWwiOiJub2JsZWluZW1lc2l0QGdtYWlsLmNvbSIsImJhbmtDb2RlIjoiOTIxIiwiYmFua05hbWUiOiJDQVAgQmFuayIsImlhdCI6MTc3NzUzNjMwMSwiZXhwIjoxNzc3NTM5OTAxfQ.x2LTqbAtL-LeigaJg4YY4V-9xN2CU4aWbfA7fe9omkA";

    const { kycID, kycType, dob, bankCode, bankName } = req.body;

    console.log("REQUEST BODY:", req.body);

    if (!kycID || !kycType || !dob || !bankCode || !bankName) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const response = await axios.post(
      "https://nibssbyphoenix.onrender.com/api/account/create",
      {
        kycID,
        kycType,
        dob
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const apiData = response.data?.data || response.data;

    console.log("API RESPONSE:", response.data);

    // 🚨 STOP if API failed
    if (!apiData || !apiData.accountNumber) {
      return res.status(400).json({
        message: "Account creation failed from provider",
        error: response.data
      });
    }

    // ✅ SAVE ONLY IF VALID
    const account = await Account.create({
      acctNo: apiData.accountNumber,
      kycid: kycID,
      kyctype: kycType,
      dob: new Date(dob),
      bankCode,
      bankName,
      balance: 15000,
      status: "active",
      rawApiResponse: apiData
    });

    console.log("SAVED ACCOUNT:", account);

    return res.status(201).json({
      message: "Account created successfully",
      account
    });

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);

    return res.status(400).json({
      message: "Failed to create account",
      error: error.response?.data || error.message
    });
  }
};
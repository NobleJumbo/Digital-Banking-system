import Account from "../models/Account.js";
import axios from "axios";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import getNibssToken from "../util/nibss.js";

const NIBSS_BASE_URL = process.env.NIBSS_BASE_URL;




export const createAccount = async (req, res) => {
  try {
    const token = await getNibssToken();

    const { kycID, kycType, dob, bankCode, bankName } = req.body;

    console.log("REQUEST BODY:", req.body);

    if (!kycID || !kycType || !dob || !bankCode || !bankName) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const response = await axios.post(
      `${NIBSS_BASE_URL}/api/account/create`,
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

    // VALIDATE API RESPONSE
    if (!apiData || !apiData.accountNumber) {
      return res.status(400).json({
        message: "Account creation failed from provider",
        error: response.data
      });
    }

    // SAVE ONLY IF VALID
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



export const transferMoney = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fromAccount, toAccount, amount, narration } = req.body;

    console.log("TRANSFER REQUEST:", req.body);

    if (!fromAccount || !toAccount || !amount) {
      throw new Error("Missing required fields");
    }

    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    
    const sender = await Account.findOne({ acctNo: fromAccount }).session(session);

    if (!sender) {
      throw new Error("Sender account not found");
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }


    let receiver = await Account.findOne({ acctNo:toAccount}).session(session);

    let isExternal = false;

    //  external transfer
    if (!receiver) {
      isExternal = true;

      

      const token = await getNibssToken();

      const response = await axios.post(
        `${NIBSS_BASE_URL}/api/account/verify`,
        {
          accountNumber: toAccount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const apiData = response.data?.account;

      if (!apiData) {
        throw new Error("Receiver account not found externally");
      }

      console.log("External account verified:", apiData);
    }

    
    sender.balance -= amount;
    await sender.save({ session });

  
    if (!isExternal) {
      receiver.balance += amount;
      await receiver.save({ session });
    }


    const transaction = await Transaction.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          narration,
          reference: "TXN-" + Date.now(),
          status: "success",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: isExternal
        ? "Transfer successful (External)"
        : "Transfer successful (Internal)",
      transaction: transaction[0],
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log("TRANSFER ERROR:", error.message);

    return res.status(400).json({
      message: "Transfer failed",
      error: error.message,
    });
  }
};
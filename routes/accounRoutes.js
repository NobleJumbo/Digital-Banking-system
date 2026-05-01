import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();


// router.post("/fintech/onboard", onboardCustomer);




import {
  createAccount,
  transferMoney
} from '../controller/accountController.js';



router.post('/account/create', createAccount);//working
router.post('/transfer', transferMoney);//working
// router.get('/accounts/balance/:accountNumber', authMiddleware, getBalance);//working


export default router;
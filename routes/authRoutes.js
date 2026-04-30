import express from "express";
const router = express.Router();



import { insertBvn, validateBvn} from "../controller/authController.js";


router.post('/insertBvn', insertBvn);//working
router.get('/validateBvn', validateBvn);//working



export default router;
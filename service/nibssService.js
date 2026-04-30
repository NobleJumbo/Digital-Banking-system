// import nibssRequest from "../config/nibss.js";
// import axios from "axios";




// const nibssPublicRequest = () => {
//   return axios.create({
//     baseURL: process.env.NIBSS_BASE_URL,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };





// const insertNin = async (nin, firstName, lastName, dob) => {
//   const client = await nibssPublicRequest();

//   const response = await client.post("/api/insertNin", {
//     nin,
//     firstName,
//     lastName,
//     dob,
//   });

//   return response.data;
// };

import axios from "axios";

const instance = axios.create({
  // baseURL:'https://iteamoa-api.brynnpark.cloud',
  baseURL:'https://api-iteamoa.brynnpark.xyz',
  // baseURL:'api-iteamoa.brynnpark.cloud',
  headers: { 'Content-Type': 'application/json' }
});


export default instance;
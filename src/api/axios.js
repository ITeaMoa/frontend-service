import axios from "axios";

const instance = axios.create({
  baseURL:'https://iteamoa-api.brynnpark.cloud',
  headers: { 'Content-Type': 'application/json' }
});


export default instance;
import axios from "axios";

const instance = axios.create({
  baseURL:'https://api-iteamoa.brynnpark.cloud',
  headers: { 'Content-Type': 'application/json' }
});

export default instance;
import axios from "axios";

const instance = axios.create({
  baseURL: "http://iteamoa.brynnpark.cloud"
});

export default instance;
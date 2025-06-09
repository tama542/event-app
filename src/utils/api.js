import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/' // Change this URL as needed
});

export default API;

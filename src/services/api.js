import axios from 'axios'
import API_key from '../private/api_key'



const api = {base: '', key: API_key};

api.base = axios.create({
    baseURL: 'https://api.nasa.gov/planetary'
});





export default api;
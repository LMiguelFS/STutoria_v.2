import axios from 'axios';
window.axios = axios;

window.axios.defaults.baseURL = 'https://stutoriav2-production.up.railway.app'; 
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

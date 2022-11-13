import axios from 'axios';

const client = axios.create();

client.defaults.xsrfCookieName = 'csrftoken';
client.defaults.xsrfHeaderName = 'X-CSRFToken';

export default client;

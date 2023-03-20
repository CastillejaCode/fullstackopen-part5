import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/login';

const login = async (credentials) => {
	const reponse = await axios.post(baseUrl, credentials);
	return reponse.data;
};

export default { login };

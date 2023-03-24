import axios from 'axios';

const baseUrl = '/api/login';

const login = async (credentials) => {
	const reponse = await axios.post(baseUrl, credentials);
	return reponse.data;
};

export default { login };

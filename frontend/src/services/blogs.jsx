import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/blogs';

let token = null;
const setToken = (newToken) => {
	token = `bearer ${newToken}`;
};

const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

const create = async (blog) => {
	const config = { headers: { Authorization: token } };
	const response = await axios.post(baseUrl, blog, config);
	return response.data;
};

const udpate = async (id, blog) => {
	const response = await axios.put(`${baseUrl}/${id}`, blog);
	return response.data;
};

const remove = async (id) => {
	const config = { headers: { Authorization: token } };

	const response = await axios.delete(`${baseUrl}/${id}`, config);
	return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, udpate, remove, setToken };

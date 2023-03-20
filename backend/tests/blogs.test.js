const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await User.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);
	const passwordHash = await bcrypt.hash('secret', 10);
	const user = new User({ username: 'test', passwordHash });
	await user.save();
});

describe('INITIAL Notes', () => {
	test('notes returned as JSON', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	}, 10000);

	test('correct number of notes', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test('correct id property exists', async () => {
		const response = await helper.blogsInDB();
		response.forEach((blog) => expect(blog.id).toBeDefined());
		expect(response[0]._id).toBeFalsy();
	});
});

describe('user token works', () => {
	test('user token contains original user', async () => {
		const user = { username: 'test', password: 'secret' };
		const result = await api.post('/api/login').send(user);
		expect(result.body.username).toEqual('test');

		const decodedToken = jwt.verify(result.body.token, process.env.SECRET);

		expect(decodedToken.username).toEqual('test');
	});
});

describe('POST new blog', () => {
	test('successful POST to DB', async () => {
		const user = { username: 'test', password: 'secret' };
		const result = await api.post('/api/login').send(user);
		const token = result.body.token;

		const newBlog = {
			title: 'Successful POST',
			author: 'POST',
			url: 'POST.com',
			likes: 20,
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const response = await api.get('/api/blogs');
		expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
		expect(response.body[2].title).toBe('Successful POST');
	});
	test('unsuccessful POST to DB if invalid token', async () => {
		const newBlog = {
			title: 'Successful POST',
			author: 'POST',
			url: 'POST.com',
			likes: 20,
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		const response = await api.get('/api/blogs');
		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test('no likes defaults to 0 likes', async () => {
		const user = { username: 'test', password: 'secret' };
		const result = await api.post('/api/login').send(user);
		const token = result.body.token;

		const newBlog = {
			title: 'Successful POST',
			author: 'POST',
			url: 'POST.com',
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const response = await api.get('/api/blogs');
		expect(response.body[2].likes).toBe(0);
	});

	test('no title returns 400 bad request', async () => {
		const newBlog = {
			author: 'POST',
			url: 'POST.com',
			likes: 20,
		};

		await api.post('/api/blogs').send(newBlog).expect(400);
	});

	test('no author returns 400 bad request', async () => {
		const newBlog = {
			title: 'POST',
			url: 'POST.com',
			likes: 20,
		};

		await api.post('/api/blogs').send(newBlog).expect(400);
	});
});

describe('DELETE', () => {
	test('delete one specific blog', async () => {
		const user = { username: 'test', password: 'secret' };
		const result = await api.post('/api/login').send(user);
		const token = result.body.token;

		const blog = { title: 'delete me', author: 'me', url: 'cats.com', likes: 20 };

		await api.post('/api/blogs').send(blog).set('Authorization', `bearer ${token}`);

		const initialBlogs = await helper.blogsInDB();
		const deletedBlog = await Blog.findOne({ title: 'delete me' });

		await api.delete(`/api/blogs/${deletedBlog._id}`).set('Authorization', `bearer ${token}`).expect(204);

		const blogsAtEnd = await helper.blogsInDB();
		expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

		const contents = blogsAtEnd.map((blog1) => blog1.title);
		expect(contents).not.toContain(deletedBlog.title);
	});
});

describe('PUT', () => {
	test('update a blog', async () => {
		const initialBlogs = await helper.blogsInDB();
		const blogToUpdate = initialBlogs[0];

		const newBlog = {
			title: 'Good job with the PUT',
			author: 'cats',
			url: 'stuff',
			likes: 123,
		};

		await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog);
		expect(204);

		const laterBlogs = await helper.blogsInDB();
		expect(laterBlogs).toHaveLength(helper.initialBlogs.length);
		const contents = laterBlogs.map((blog) => blog.title);
		expect(contents).toContain('Good job with the PUT');
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});

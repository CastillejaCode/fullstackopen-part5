const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

describe('inital user in the database', () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash('secret', 10);
		const user = new User({ username: 'test', passwordHash });
		await user.save();
	});

	test('can add one user', async () => {
		const usersAtStart = await helper.usersInDB();

		const newUser = {
			username: 'Test Test',
			name: 'Powell Cat',
			password: 'password',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDB();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((user) => user.username);
		expect(usernames).toContain(newUser.username);
	});

	test('creation of username only if unique', async () => {
		const usersAtStart = await helper.usersInDB();

		const newUser = {
			username: 'test',
			name: 'William',
			password: 'stuff',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('expected `username` to be unique');

		const usersAtEnd = await helper.usersInDB();
		expect(usersAtEnd).toEqual(usersAtStart);
	});

	test('username has min of 3', async () => {
		const newUser = {
			username: 'as',
			name: 'phil',
			password: 'stuff',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});

	test('password has min of 3', async () => {
		const newUser = {
			username: 'something more than 2',
			name: 'ph',
			password: 'pa',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('password must have a minimum of 3 characters');
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});

const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('bearer ')) {
		request.token = authorization.replace('bearer ', '');
	}
	next();
};

const userExtractor = async (request, response, next) => {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('bearer ')) {
		const decodedToken = jwt.verify(authorization.replace('bearer ', ''), process.env.SECRET);
		if (!decodedToken.id) {
			return response.status(401).json({ error: 'invalid token' });
		}

		request.user = await User.findById(decodedToken.id);
	}

	next();
};

const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method);
	logger.info('Path:  ', request.path);
	logger.info('Body:  ', request.body);
	logger.info('---');
	next();
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}
	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}
	if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'invalid id' });
	}

	next(error);
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
};

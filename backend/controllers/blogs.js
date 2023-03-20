const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1 });
	response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id).populate('user', { username: 1 });
	response.json(blog);
});

blogsRouter.post('/', async (request, response) => {
	if (!request.body.title || !request.body.author) response.status(400).end();
	if (!request.body.likes) request.body.likes = 0;

	const user = await request.user;
	if (user === undefined) return response.status(401).json({error: 'invalid token'});

	const blog = new Blog({ ...request.body, user: user.id });
	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();
	response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	const user = request.user;
	if (user.id.toString() !== blog.user._id.toString()) {
		return response.status(401).json({ error: 'token does not match blog user' });
	}
	await Blog.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
	// const blog = request.body;
	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
	response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;

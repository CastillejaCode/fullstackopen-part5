/* eslint-disable no-unused-vars */
const countBy = require('lodash.countby');
const groupBy = require('lodash.groupby');

const dummy = (blogs) => 1;

const likes = (blogs) => {
	if (blogs.length === 0) return 0;
	return blogs.reduce((previous, current) => previous + current.likes, 0);
};

const favorite = (blogs) => {
	const sorted = blogs.sort((a, b) => a.likes - b.likes);
	return sorted[sorted.length - 1];
};

const mostBlogs = (blogs) => {
	const count = countBy(blogs, 'author');

	const countArray = Object.entries(count);
	const arr = Object.values(count);
	const max = Math.max(...arr);
	const author = countArray.find((auth) => auth[1] === max);
	return { author: author[0], blogs: author[1] };
};

const mostLikes = (blogs) => {
	const authorsArray = Object.keys(countBy(blogs, 'author'));
	const array = [];
	const authorBlogs = (author) => blogs.filter((blog) => blog.author === author);
	const total = (blogsFiltered) => blogsFiltered.reduce((previous, current) => previous + current.likes, 0);

	authorsArray.forEach((author) => {
		array.push([author, total(authorBlogs(author))]);
	});

	const mostLiked = array.sort((a, b) => a[1] - b[1]).at(array.length - 1);
	return { author: mostLiked[0], likes: mostLiked[1] };
};

module.exports = {
	dummy,
	likes,
	favorite,
	mostBlogs,
	mostLikes,
};

import { useState, useEffect } from 'react';

const Blog = ({ blog, handleUpdate, handleDelete, user }) => {
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	};
	const [expand, setExpand] = useState(false);
	const [likes, setLikes] = useState(0);
	useEffect(() => {
		setLikes(blog.likes);
	}, []);

	const addLikes = (event) => {
		event.preventDefault();
		const tempLikes = ++blog.likes;
		handleUpdate(blog.id, {
			title: blog.title,
			author: blog.author,
			url: blog.url,
			user: blog.user.id,
			likes: tempLikes,
		});
		setLikes(tempLikes);
	};

	const toggleExpand = () => {
		setExpand(!expand);
	};
	return (
		<div style={blogStyle}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				{blog.title} by {blog.author}
				<button onClick={toggleExpand}>{expand ? 'hide' : 'view'}</button>
			</div>
			{expand ? (
				<div>
					{blog.url}
					<br />
					Likes: {likes} <button onClick={addLikes}>like!</button>
					<br />
					User: {blog.user.name}
					<br />
					{user.username === blog.user.username ? (
						<button onClick={() => handleDelete(blog.id, blog)}>remove</button>
					) : (
						''
					)}
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default Blog;

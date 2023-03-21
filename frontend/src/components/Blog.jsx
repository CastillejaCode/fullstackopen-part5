import { useState } from 'react';

const Blog = ({ blog }) => {
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	};
	const [expand, setExpand] = useState(false);

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
					Likes: {blog.likes} <button>like!</button>
					<br />
					User: {blog.user.name}
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default Blog;

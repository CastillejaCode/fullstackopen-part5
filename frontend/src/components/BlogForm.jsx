import { useState } from 'react';

const BlogForm = ({ handleCreate }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const addBlog = (event) => {
		event.preventDefault();
		handleCreate({
			title,
			author,
			url,
		});
		setTitle('');
		setAuthor('');
		setUrl('');
	};
	return (
		<form onSubmit={addBlog}>
			<div>
				Title
				<input
					className='title'
					type='text'
					value={title}
					onChange={(event) => setTitle(event.target.value)}
				/>
			</div>
			<div>
				Author
				<input
					className='author'
					type='text'
					value={author}
					onChange={(event) => setAuthor(event.target.value)}
				/>
			</div>
			<div>
				url
				<input
					className='url'
					type='text'
					value={url}
					onChange={(event) => setUrl(event.target.value)}
				/>
			</div>
			<button
				type='submit'
				className='create'>
				create
			</button>
		</form>
	);
};

export default BlogForm;

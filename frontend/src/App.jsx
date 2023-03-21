import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import NewForm from './components/NewForm';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	useEffect(() => {
		const userJSON = window.localStorage.getItem('user');
		if (userJSON) {
			const user = JSON.parse(userJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const response = await loginService.login({ username, password });

			window.localStorage.setItem('user', JSON.stringify(response));
			setUser(response);
			blogService.setToken(user.token);
			setUsername('');
			setPassword('');
		} catch (exception) {
			setErrorMessage('Wrong credentials');
			setTimeout(() => setErrorMessage(null), 5000);
		}
	};

	const handleLogout = (event) => {
		event.preventDefault();
		window.localStorage.removeItem('user');
		setUser(null);
	};

	const handleCreate = async (event) => {
		event.preventDefault();
		const blog = {
			title,
			author,
			url,
		};
		const response = await blogService.create(blog);

		setErrorMessage(`NEW BLOG: ${response.title} by ${response.author} added !`);
		setTimeout(() => setErrorMessage(null), 5000);

		setBlogs(blogs.concat(response));
		setTitle('');
		setAuthor('');
		setUrl('');
	};

	const loginForm = () => {
		return (
			<div>
				<h2>Log in to application</h2>
				<form onSubmit={handleLogin}>
					<div>
						username
						<input
							type='text'
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
					</div>
					<div>
						password
						<input
							type='password'
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>
					</div>
					<button type='submit'>Login</button>
				</form>
			</div>
		);
	};

	const blogsForm = () => {
		return (
			<div>
				<h2>blogs</h2>
				<h3>
					{user.name} logged in <button onClick={handleLogout}>Logout</button>
				</h3>
				<h2>Create New</h2>
				<NewForm
					title={title}
					author={author}
					url={url}
					handleTitle={(event) => setTitle(event.target.value)}
					handleAuthor={(event) => setAuthor(event.target.value)}
					handleUrl={(event) => setUrl(event.target.value)}
					handleCreate={handleCreate}
				/>
				{blogs.map((blog) => (
					<Blog
						key={blog.id}
						blog={blog}
					/>
				))}
			</div>
		);
	};

	return (
		<div>
			<Notification error={errorMessage} />

			{user ? blogsForm() : loginForm()}
		</div>
	);
};

export default App;

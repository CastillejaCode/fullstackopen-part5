import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();

		const reponse = await loginService.login({ username, password });
		setUser(reponse);
		setUser('');
		setPassword('');
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

				{blogs.map((blog) => (
					<Blog
						key={blog.id}
						blog={blog}
					/>
				))}
			</div>
		);
	};

	return <div>{user ? blogsForm() : loginForm()}</div>;
};

export default App;

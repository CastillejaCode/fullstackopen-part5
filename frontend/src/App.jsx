import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);

	const newBlogRef = useRef();

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

	const addBlog = async (blog) => {
		const response = await blogService.create(blog);

		setErrorMessage(`NEW BLOG: ${response.title} by ${response.author} added !`);
		setTimeout(() => setErrorMessage(null), 5000);
		newBlogRef.current.toggleVisible();
		setBlogs(blogs.concat(response));
	};

	const blogsSection = () => {
		return (
			<div>
				<h2>blogs</h2>
				<h3>
					{user.name} logged in <button onClick={handleLogout}>Logout</button>
				</h3>
				<Togglable
					label={'new note'}
					ref={newBlogRef}>
					<h3>Create new note</h3>
					<BlogForm handleCreate={addBlog} />
				</Togglable>
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

			{user ? (
				blogsSection()
			) : (
				<LoginForm
					handleLogin={handleLogin}
					username={username}
					password={password}
					handleUsernameChange={(event) => setUsername(event.target.value)}
					handlePasswordChange={(event) => setPassword(event.target.value)}
				/>
			)}
		</div>
	);
};

export default App;

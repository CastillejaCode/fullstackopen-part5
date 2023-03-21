const LoginForm = ({ handleLogin, username, password, handleUsernameChange, handlePasswordChange }) => {
	return (
		<div>
			<h2>Log in to application</h2>
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type='text'
						value={username}
						onChange={handleUsernameChange}
					/>
				</div>
				<div>
					password
					<input
						type='password'
						value={password}
						onChange={handlePasswordChange}
					/>
				</div>
				<button type='submit'>Login</button>
			</form>
		</div>
	);
};

export default LoginForm;

const NewForm = ({ handleCreate, title, author, url, handleTitle, handleAuthor, handleUrl }) => {
	return (
		<form onSubmit={handleCreate}>
			<div>
				Title
				<input
					type='text'
					value={title}
					onChange={handleTitle}
				/>
			</div>
			<div>
				Author
				<input
					type='text'
					value={author}
					onChange={handleAuthor}
				/>
			</div>
			<div>
				url
				<input
					type='text'
					value={url}
					onChange={handleUrl}
				/>
			</div>
			<button type='sumbit'>create</button>
		</form>
	);
};

export default NewForm;

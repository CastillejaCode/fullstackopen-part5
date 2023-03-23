import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { describe, test, expect, vi } from 'vitest';
import Blog from '../components/Blog';
import userEvent from '@testing-library/user-event';

const blog = {
	title: 'Cat Names',
	author: 'Peanut',
	url: 'cats.com',
	likes: 0,
	user: { name: 'Julian' },
};

test('blog renders ony title and author', () => {
	const { container } = render(<Blog blog={blog} />);

	const title = screen.getByText('Cat Names', { exact: false });
	const author = screen.getByText('Peanut', { exact: false });
	const expand = container.querySelector('.expand');

	expect(title).toBeDefined();
	expect(author).toBeDefined();
	expect(expand).toBeNull();
});

test('button expands view', async () => {
	const username = { username: 'Julian' };
	const user = userEvent.setup();

	const { container } = render(
		<Blog
			blog={blog}
			user={username}
		/>
	);

	const button = screen.getByText('view');
	await user.click(button);
	const url = screen.getByText('cats.com', { exact: false });
	const likes = screen.getByText('0', { exact: false });

	expect(url).toBeDefined();
	expect(likes).toBeDefined();
});

test('like button clicked twice', async () => {
	const mock = vi.fn();

	const username = { username: 'Julian' };

	render(
		<Blog
			blog={blog}
			user={username}
			handleUpdate={mock}
		/>
	);

	const user = userEvent.setup();
	const button = screen.getByText('view');

	await user.click(button);

	const likeButton = screen.getByText('like!');

	await user.dblClick(likeButton);

	expect(mock).toHaveBeenCalledTimes(2);
});

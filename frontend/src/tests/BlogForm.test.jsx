import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { test, expect, vi } from 'vitest';
import BlogForm from '../components/BlogForm';
import userEvent from '@testing-library/user-event';

test('new blog calls event handler', async () => {
	const mockHandler = vi.fn();
	const user = userEvent.setup();

	const { container } = render(<BlogForm handleCreate={mockHandler} />);

	const titleInput = container.querySelector('.title');
	const authorInput = container.querySelector('.author');
	const urlInput = container.querySelector('.url');

	const button = container.querySelector('.create');

	await user.type(titleInput, 'cats are cool');
	await user.type(authorInput, 'cats are really cool');
	await user.type(urlInput, 'cats.com');

	await user.click(button);

	expect(mockHandler).toHaveBeenCalledOnce();
	expect(mockHandler.mock.calls[0][0].title).toBe('cats are cool');
	expect(mockHandler.mock.calls[0][0].author).toBe('cats are really cool');
	expect(mockHandler.mock.calls[0][0].url).toBe('cats.com');
});

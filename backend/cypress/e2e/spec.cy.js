describe('Blog App', function () {
	beforeEach(function () {
		cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
		const user = {
			name: 'test',
			username: 'test',
			password: 'password',
		};
		cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);
		cy.visit('');
	});

	it('login form is shown', function () {
		cy.contains('Log in to application');
	});

	describe('Logging in', function () {
		it('correct credential', function () {
			cy.get('input:first').type('test');
			cy.get('input:last').type('password');
			cy.contains('Login').click();
			cy.contains('test logged in');
		});

		it('wrong credentials', function () {
			cy.get('input:first').type('test');
			cy.get('input:last').type('wrongpassword');
			cy.contains('Login').click();
			cy.contains('Wrong credentials');
		});
	});

	describe('When logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'test', password: 'password' });
		});

		describe('single note is createed', function () {
			beforeEach(function () {
				cy.createBlog({ title: 'blog', author: 'bob', url: 'bob.com' });
			});

			it('The blog shows up', function () {
				cy.contains('blog');
				cy.contains('bob');
				cy.contains('view').click();
				cy.contains('bob.com');
			});

			it('blog can be liked', function () {
				cy.contains('view').click();
				cy.contains('Likes: 0');
				cy.contains('like!').as('likeButton');
				cy.get('@likeButton').click();
				cy.contains('Likes: 1');
			});
		});

		describe('two users', function () {
			beforeEach('add another user', function () {
				const user = {
					name: 'test2',
					username: 'test2',
					password: 'password',
				};
				cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);
			});

			it('can logout and login with the second user', function () {
				cy.contains('Logout').click();
				cy.login({ username: 'test2', password: 'password' });
				cy.contains('test2 logged in');
			});
		});
	});
});

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

		describe('multiple notes created', function () {
			beforeEach(function () {
				cy.createBlog({ title: 'Third most likes', author: 'Dill', url: 'dill.com' });
				cy.createBlog({ title: 'First most likes', author: 'Phil', url: 'phil.com' });
				cy.createBlog({ title: 'Second most likes', author: 'Will', url: 'will.com' });
			});

			it('notes are organized in ascending order', function () {
				cy.contains('First most likes').parent().as('first');
				cy.contains('Second most likes').parent().as('second');
				cy.contains('Third most likes').parent().as('third');

				cy.get('@first').contains('view').click();
				cy.get('@first').contains('like!').click();
				cy.get('@first').contains('like!').click();
				cy.get('@first').contains('like!').click();

				cy.get('@second').contains('view').click();
				cy.get('@second').contains('like!').click();
				cy.get('@second').contains('like!').click();

				cy.get('@third').contains('view').click();
				cy.get('@third').contains('like!').click();

				cy.get('.blog').eq(0).should('contain', 'First most likes');
				cy.get('.blog').eq(1).should('contain', 'Second most likes');
				cy.get('.blog').eq(2).should('contain', 'Third most likes');
			});
		});

		describe('single note is created', function () {
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

			it('can delete own blog', function () {
				cy.contains('view').click();
				cy.get('.blog').as('blog');
				cy.get('@blog').should('exist');
				cy.contains('remove').click();
				cy.get('@blog').should('not.exist');
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

			it('other user cannnot delete own post', function () {
				cy.createBlog({ title: 'blog', author: 'bob', url: 'bob.com' });
				cy.contains('view').click();
				cy.get('.remove').as('removeButton');
				cy.contains('Logout').click();
				cy.login({ username: 'test2', password: 'password' });
				cy.contains('view').click();
				cy.contains('bob.com');
				cy.get('@removeButton').should('not.exist');
			});
		});
	});
});

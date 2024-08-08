describe('добавления игредиентов работает правильно', function(): void {
    beforeEach(function (): void {
        cy.intercept('GET', 'api/ingredients', { fixture: "ingredients.json" }).as('ingredients');
        cy.viewport(1300, 800);
        cy.visit('http://localhost:4000/');
    });

    it('Добавиться ли ингридиент в конструктор', function (): void {
        cy.get('[data-cy="main-ingredients"]')
        .contains('Добавить')
        .should('exist')
        .click();
        cy.get('[data-cy="contructor-middle"]')
        .contains('ing_2')
        .should('exist');
    });
});

describe('Протестирована работа модальных окон', function(): void {  
    beforeEach(function (): void {
        cy.intercept('GET', 'api/ingredients', { fixture: "ingredients.json" }).as('ingredients');
        cy.viewport(1300, 800);
        cy.visit('http://localhost:4000/');
    });

    it('Открывается ли модально окно', function(): void {
        cy.contains('Детали ингредиента').should('not.exist');
        cy.contains('ing_2')
        .click();
        cy.contains('Детали ингредиента').should('exist');
    });

    it('Закрывается ли модальное окно', function (): void {
        cy.contains('ing_2')
        .click();
        cy.contains('Детали ингредиента').should('exist');
        cy.get('[data-cy="cross-button"]')
        .should('exist')
        .click();
        cy.contains('Детали ингредиента').should('not.exist');
    });
});

describe('Проверка отправки заказал', function (): void {
    beforeEach(function (): void {
        cy.intercept('GET', 'api/ingredients', { fixture: "ingredients.json" }).as('ingredients');
        cy.setCookie('accessToken', 'test-accessToken');
        window.localStorage.setItem('refreshToken', JSON.stringify('test-refreshToken'));
        window.localStorage.setItem('accessToken', JSON.stringify('test-accessToken'));
        cy.intercept('GET', 'api/auth/user', { fixture: "user.json" }).as('user');
        cy.intercept('POST', 'api/orders', { fixture: "order.json" }).as('order');
        cy.viewport(1300, 800);
        cy.visit('http://localhost:4000/');
    })

    it('Будет ли работать заказ', function (): void {
        cy.get('[data-cy="main-ingredients"]')
        .contains('Добавить')
        .click();
        cy.get('[data-cy="bun-ingredients"]')
        .contains('Добавить')
        .click();


        cy.get('[data-cy="contructor-middle"]').should('exist');

        cy.contains('Оформить заказ')
        .click();

        cy.wait('@order')
        .its('request.body')
        .should('deep.equal', {
            ingredients: ["1", "2"]
        });

        cy.get('[data-cy="orderNumber"]').contains('123456').should('exist');

        cy.get('[aria-label="Закрыть"]')
        .should('exist')
        .click();

        cy.get('[data-cy="orderNumber"]').should('not.exist');

        cy.get('[data-cy="contructor-middle"]').should('not.exist');
    });
        

    afterEach(function (): void {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
});

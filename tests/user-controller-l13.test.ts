import {test, expect} from '@playwright/test';

let baseURL: string = 'http://localhost:3000/users';
let userID: number

test.beforeAll(async ({request}) => {
    const response = await request.post(`${baseURL}`);
    const body = await response.json();
    userID = body.id
});

test.describe('User management API', () => {

    test('GET /:id - should return a user by ID', async ({request}) => {
        const response = await request.get(`${baseURL}/${userID}`);
        const responseBody = await response.json()
        console.log(responseBody)
        expect(response.status()).toBe(200)
    });

    test('GET /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.get(`${baseURL}` + '/' + 123);
        expect(response.status()).toBe(404)
    });

    test('POST / - should add a new user', async ({request}) => {
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json()
        expect(response.status()).toBe(201)
        expect.soft(responseBody.id).toBeDefined()
    });

    test('DELETE /:id - should delete a user by ID', async ({request}) => {
        const responseDelUser = await request.delete(`${baseURL}/${userID}`);
        const responseDelUserBody = await responseDelUser.json()
        console.log(responseDelUserBody)
        expect(responseDelUser.status()).toBe(200)
        expect.soft(responseDelUserBody[0].id).toBe(userID)
    });

    test('DELETE /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.delete(`${baseURL}` + '/' + 123);
        expect(response.status()).toBe(404)
    });
});

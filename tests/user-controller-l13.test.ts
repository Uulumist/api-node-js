import {test, expect} from '@playwright/test';
import {StatusCodes} from "http-status-codes";

let baseURL: string = 'http://localhost:3000/users';
let userID: number

test.describe('User management API', () => {

    test('GET / - should return empty when no users', async ({request}) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.OK);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    });

    test('GET /:id - should return a user by ID', async ({request}) => {
        const response = await request.post(`${baseURL}`);
        const body = await response.json();
        userID = body.id
        const responseGetId = await request.get(`${baseURL}/${userID}`);
        const responseBody = await responseGetId.json()
        expect(responseGetId.status()).toBe(StatusCodes.OK)
        expect.soft(responseBody.id).toBe(userID)
    });

    test('GET /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.get(`${baseURL}` + '/' + 123);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND)
    });

    test('POST / - should add a new user', async ({request}) => {
        const response = await request.post(`${baseURL}`);
        const responseBody = await response.json()
        expect(response.status()).toBe(StatusCodes.CREATED)
        expect.soft(responseBody.id).toBeDefined()
    });

    test('DELETE /:id - should delete a user by ID', async ({request}) => {
        const response = await request.post(`${baseURL}`);
        const body = await response.json();
        userID = body.id
        const responseDelUser = await request.delete(`${baseURL}/${userID}`);
        const responseDelUserBody = await responseDelUser.json()
        expect(responseDelUser.status()).toBe(StatusCodes.OK)
        expect.soft(responseDelUserBody[0].id).toBe(userID)
    });

    test('DELETE /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.delete(`${baseURL}` + '/' + 123);
        expect(response.status()).toBe(StatusCodes.NOT_FOUND)
    });
});

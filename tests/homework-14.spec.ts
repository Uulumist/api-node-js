import {test, expect} from '@playwright/test';
import {ApiClient} from "../src/api-client";

let baseURL: string = 'http://localhost:3000/users';

test.describe('homework-14', () => {

    test('Create n users', async ({request}) => {
        const apiClient = await ApiClient.getInstance(request)
        const usersCount = await apiClient.createUsers(10)
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json()
        let numberOfObject = responseBody.length
        expect(numberOfObject).toBe(usersCount)
    });

    test('Delete all available users', async ({request}) => {
        const apiClient = await ApiClient.getInstance(request)
        await apiClient.createUsers(10)
        await apiClient.deleteUsers();
        await apiClient.checkAllUsersDeleted()
    });

    test('Get a user by id', async ({request}) => {
        const apiClient = await ApiClient.getInstance(request)
        const usersCount = await apiClient.createUsers(10)
        expect.soft(usersCount).toBe(10);
        const userByIdResponse = await apiClient.getUserById()
        expect.soft(userByIdResponse.status()).toBe(200)
        const userById = await userByIdResponse.json()
        expect.soft(userById).toHaveProperty('id')
        expect.soft(userById).toHaveProperty('name')
        expect.soft(userById).toHaveProperty('email')
        expect.soft(userById).toHaveProperty('phone')
        expect.soft(userById.id).toBeDefined();
    });
});
// tests/api.spec.ts
import {test, expect} from '@playwright/test';
import {ApiClient} from "../src/api-client";
import {STATUS_CODES} from "node:http";

let baseURL: string = 'http://localhost:3000/users';
let userID: number;

test.beforeAll(async ({request}) => {
    const response = await request.post(`${baseURL}`);
    const body = await response.json();
    console.log("Created user:", body);
    userID = body.id
});

test.beforeEach(async ({request}) => {
    // get all users
    const response = await request.get(`${baseURL}`);
    const responseBody = await response.json()
    // get the number of objects in the array returned
    const numberOfObjects = responseBody.length;

    // create an empty array to store all user ID
    let userIDs = [];

    // loop through all users and store their ID in an array
    for (let i = 0; i < numberOfObjects; i++) {
        // get user ID from the response
        let userID = responseBody[i].id;
        // push is used to add elements to the end of an array
        userIDs.push(userID);
    }

    // delete all users in a loop using previously created array
    for (let i = 0; i < numberOfObjects; i++) {
        // delete user by id
        let response = await request.delete(`${baseURL}/${userIDs[i]}`);
        // validate the response status code
        expect.soft(response.status()).toBe(200);
    }

    // verify that all users are deleted
    const responseAfterDelete = await request.get(`${baseURL}`);
    expect(responseAfterDelete.status()).toBe(200);
    const responseBodyEmpty = await responseAfterDelete.text()
    // validate that the response is an empty array
    expect(responseBodyEmpty).toBe('[]');
})

test.describe('User management API', () => {

    test('GET / - should return empty when no users', async ({request}) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    });

    test('POST create n users', async ({request}) => {
        const apiClient = await ApiClient.getInstance(request)
        const usersCount = await apiClient.createUsers(5)
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json()
        let numberOfObject = responseBody.length
        console.log(responseBody)
        expect(numberOfObject).toBe(usersCount)
    });

    test('DELETE n users', async ({request}) => {
        const apiClient = await ApiClient.getInstance(request)
        const usersCount = await apiClient.createUsers(5)
        let userIDs = [];
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json()
        // get the number of objects in the array returned
        const numberOfObjects = responseBody.length;
        // loop through all users and store their ID in an array
        for (let i = 0; i < usersCount; i++) {
            // get user ID from the response
            let userID = responseBody[i].id;
            // push is used to add elements to the end of an array
            userIDs.push(userID);
        }
        for (let i = 0; i < numberOfObjects; i++) {
            // delete user by id
            let response = await request.delete(`${baseURL}/${userIDs[i]}`);
            // validate the response status code
        }
        const expectResponse = await request.get(`${baseURL}`);
        const expectResponseBody = await expectResponse.json()
        expect(expectResponseBody).toStrictEqual([])
    });

    test('DELETE m users after creating n users', async ({request}) => {
        const apiClient = await ApiClient.getInstance(request)
        const usersCount = await apiClient.createUsers(5)
        let userIDs = [];
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json()
        const numberOfObjects = responseBody.length;
        for (let i = 0; i < usersCount; i++) {
            let userID = responseBody[i].id;
            userIDs.push(userID);
        }
        for (let i = 0; i < numberOfObjects - 2; i++) {
            let response = await request.delete(`${baseURL}/${userIDs[i]}`);
        }
        const expectResponse = await request.get(`${baseURL}`);
        const expectResponseBody = await expectResponse.json()
        expect(expectResponseBody.length).toBe(usersCount - 3)
    });

    test('GET /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.get(`${baseURL}` + "/" + 123);
        expect(response.status()).toBe(404);
    });

    test('DELETE /:id - should delete a user by ID', async ({request}) => {
        const response = await request.post(`${baseURL}`);
        const body = await response.json();
        console.log("Created user:", body);
        userID = body.id
        const responseDelUser = await request.delete(`${baseURL}/${userID}`);
        const responseBodyDelUser = await response.json();
        expect.soft(responseDelUser.status()).toBe(200)
        expect.soft(responseBodyDelUser.id).toBe(userID)
    });

    test('DELETE /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.post(`${baseURL}` + "/" + 111);
        const responseBody = await response.text();
        console.log(responseBody)
        expect.soft(response.status()).toBe(404)
    });
})
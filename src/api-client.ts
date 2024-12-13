import {APIRequestContext} from 'playwright'
import {APIResponse, expect} from "@playwright/test";

let baseURL: string = 'http://localhost:3000/users';

export class ApiClient {
    static instance: ApiClient
    private request: APIRequestContext

    private constructor(request: APIRequestContext) {
        this.request = request
    }

    public static async getInstance(request: APIRequestContext): Promise<ApiClient> {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient(request)
        }
        return ApiClient.instance
    }

    async createUsers(users: number): Promise<number> {
        for (let i = 0; i < users; i++) {
            await this.request.post(baseURL);
        }
        return users
    }

    async deleteUsers(): Promise<void> {
        const response = await this.request.get(`${baseURL}`);
        const responseBody = await response.json()
        const numberOfObjects = responseBody.length;
        let userIDs = [];
        for (let i = 0; i < numberOfObjects; i++) {
            let userID = responseBody[i].id;
            userIDs.push(userID);
        }
        for (let i = 0; i < numberOfObjects; i++) {
            let response = await this.request.delete(`${baseURL}/${userIDs[i]}`);
            expect.soft(response.status()).toBe(200);
        }
    }

    async checkAllUsersDeleted(): Promise<void> {
        const response = await this.request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    }

    async getUserById(): Promise<APIResponse> {
        const response = await this.request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.json()
        const userId = responseBody[0].id
        return await this.request.get(`${baseURL}/${userId}`)
    }
}
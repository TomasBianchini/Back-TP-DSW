import { beforeAll, describe, expect, expectTypeOf, test} from 'vitest';
import { Category } from '../category/category.entity.js';
import { config } from "dotenv";
config()



interface ApiResponse {
  message: string;
  data: Category[];
}

describe('Endpoint POST "/api/category"', () => {
    let body: ApiResponse;
    let response: Response;
  
   describe('With access token', () => {
    beforeAll(async () => {
      const token  = process.env.TOKEN;
      const requestBody=
      { category: 'Prueba category test3', state: 'Archived' }
      response = await fetch(
        'http://localhost:3000/api/category', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );
      body = await response.json();
    });
  
    test('Should have response status 201', () => {
      expect(response.status).toBe(201);
    });
  
    test('The response should has a message', () => {
      expectTypeOf(body.message).toBeString();
    });
    test('The response should has the category data', () => {
      expect(body.data).toBeDefined();
    });
   });
  
   describe('Without access token', () => {
    beforeAll(async () => {
      const requestBody={ category: 'prueba'}
      response = await fetch(
        'http://localhost:3000/api/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );
      body = await response.json();
    });
  
    test('Should have response status 403', () => {
      expect(response.status).toBe(403);
    });
  
    test('The response should has a message', () => {
      expectTypeOf(body.message).toBeString();
    });
   });
  
   describe('With invalid access token', () => {
    beforeAll(async () => {
      const token  = '123';
      const requestBody={ category: 'prueba'}
      response = await fetch(
        'http://localhost:3000/api/category', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );
      body = await response.json();
    });
  
      test('Should have response status 401', () => {
        expect(response.status).toBe(401);
      });
  
      test('The response should has a message', () => {
        expectTypeOf(body.message).toBeString();
      });
    });
  
  });
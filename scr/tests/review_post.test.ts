import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest';
import { Review } from '../review/review.entity.js';
import { config } from 'dotenv';

config();

interface ApiResponse {
  message: string;
  data: Review[];
}
describe('Endpoint POST "/api/review"', () => {
  let body: ApiResponse;
  let response: Response;

  describe('With access token', () => {
    beforeAll(async () => {
      const token = process.env.TOKEN;
      const requestBody = {
        product: '65fefcd9743450fd6acb4b1f',
        rating: 4,
        comment: 'The product is excellent, I totally recommend it',
      };
      response = await fetch('http://localhost:3000/api/review', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      body = await response.json();
    });

    test('Should have response status 201', () => {
      expect(response.status).toBe(201);
    });

    test('The response should have a message', () => {
      expectTypeOf(body.message).toBeString();
    });
    test('The response should have the review data', () => {
      expect(body.data).toBeDefined();
    });
  });

  describe('With access token and inappropriate  lenguage', () => {
    beforeAll(async () => {
      const token = process.env.TOKEN;
      const requestBody = {
        product: '65fefcd9743450fd6acb4b1f',
        rating: 4,
        comment: 'The product is a piece of shit',
      };
      response = await fetch('http://localhost:3000/api/review', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      body = await response.json();
    });

    test('Should have response status 403', () => {
      console.log(response.status);
      expect(response.status).toBe(403);
    });

    test('The response should have a message', () => {
      expect(body.message).toBe('Inappropriate language detected');
    });
  });

  describe('Without access token', () => {
    beforeAll(async () => {
      const requestBody = {
        product: '65fefcd9743450fd6acb4b1f',
        rating: 4,
        comment: 'prueba endpoint post',
      };
      response = await fetch('http://localhost:3000/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      body = await response.json();
    });

    test('Should have response status 403', () => {
      expect(response.status).toBe(403);
    });

    test('The response should have a message', () => {
      expectTypeOf(body.message).toBeString();
    });
  });

  describe('With invalid access token', () => {
    beforeAll(async () => {
      const token = '123';
      const requestBody = {
        product: '65fefcd9743450fd6acb4b1f',
        rating: 4,
        comment: 'prueba endpoint post',
      };
      response = await fetch('http://localhost:3000/api/review', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      body = await response.json();
    });

    test('Should have response status 401', () => {
      expect(response.status).toBe(401);
    });

    test('The response should have a message', () => {
      expectTypeOf(body.message).toBeString();
    });
  });
});

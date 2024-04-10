
import { beforeAll, describe, expect, expectTypeOf, test} from 'vitest';
import { Category } from '../category/category.entity.js';
import express from 'express';
const app = express();

interface ApiResponse {
  message: string;
  data: Category[];
}


describe('Endpoint GET "/api/category"', () => {
  let body: ApiResponse;
  let response: Response;

 describe('With access token', () => {
  beforeAll(async () => {
    const token  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVkM2I1YzRjZGMwMjk2ODkyNzcyZjQ0IiwiY3JlYXRlZEF0IjoiMjAyNC0wMi0xOVQyMDoxMDo0NC44MTNaIiwidXBkYXRlZEF0IjoiMjAyNC0wMy0xMlQxMzo0MDozNS44NDZaIiwidXNlcl9uYW1lIjoiVG9tYXMiLCJlbWFpbCI6InRvbWFzQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTMscD00JGxreWdlRjFTaTRHRkF2VnpGQ3FnWXckd3A1TzJIV1NSOVNDb3IyN0swbnN5MkdVeFM0NSs4TTE5NHkyMlFEMHJWOCIsImFkZHJlc3MiOiJtb250ZXZpZGVvIDEzMzIiLCJ0eXBlIjoiQWRtaW4iLCJzdGF0ZSI6IkFjdGl2ZSJ9LCJpYXQiOjE3MTI1MTkwNjIsImV4cCI6MTcxMjUyNjI2Mn0.Ss7dX6UWUFqU7uWOF2RbtDO8b48To3Qyns9VGlYpziA';
    response = await fetch(
      'http://localhost:3000/api/category', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    body = await response.json();
  });

  test('Should have response status 200', () => {
    expect(response.status).toBe(200);
  });

  test('The response should has a message', () => {
    expectTypeOf(body.message).toBeString();
  });
  test('The response should has the data', () => {
    expect(body.data).toBeDefined();
    expectTypeOf(body.data).toBeArray();
  });
 });

 describe('Without access token', () => {
  beforeAll(async () => {
    response = await fetch('http://localhost:3000/api/category');
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
      const token = '123';
      response = await fetch(
        'http://localhost:3000/api/category', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
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


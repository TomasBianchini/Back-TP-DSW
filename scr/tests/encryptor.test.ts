import { encrypt, decrypt } from '../shared/utils/encryptor';

import { describe, expect, test } from 'vitest';

describe('encryptor', () => {
  describe('encrypt', () => {
    test('should encrypt a string', () => {
      const text = 'hello';
      const encrypted = encrypt(text);
      expect(encrypted).not.toBe(text);
    });
  });

  describe('decrypt', () => {
    test('should decrypt a string', () => {
      const text = 'hello';
      const encrypted = encrypt(text);
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(text);
    });
  });
});

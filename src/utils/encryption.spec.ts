import { encryptDataWithPhrase, deriveKeyFromPassphrase } from './encryption';

describe('encryption', () => {
  it('should encrypt data with a given phrase', () => {
    const phrase = 'test-phrase';
    const data = 'test-data';

    const encryptedData = encryptDataWithPhrase(data, phrase);

    expect(encryptedData).not.toBe(data);  // Verifica que los datos cifrados no sean iguales a los originales
  });

  it('should derive a key from a given passphrase', () => {
    const passphrase = 'test-passphrase';

    const key = deriveKeyFromPassphrase(passphrase);

    expect(key).toBeDefined();  // Verifica que se haya generado una clave
  });
});

import { Nl2brPipe } from './nl2br.pipe'; // Asegúrate de que la ruta sea correcta
describe('Nl2brPipe', () => {
  let pipe: Nl2brPipe;

  beforeEach(() => {
    pipe = new Nl2brPipe();
  });

  it('should transform text with new lines and bold formatting', () => {
    const input = 'Hello, **world**!\nThis is a test.\nAnother line.';
    const expectedOutput = 'Hello, <strong>world</strong>!<br>This is a test.<br>Another line.';
    
    const result = pipe.transform(input);
    
    expect(result).toEqual(expectedOutput);
  });

  it('should return the same value if input is an empty string', () => {
    const input = '';
    
    const result = pipe.transform(input);
    
    expect(result).toEqual('');
  });

  it('should return null for null input', () => {
    expect(pipe.transform('null')).toBe('null'); // Probar el string "null"
  });

  it('should return undefined for undefined input', () => {
    expect(pipe.transform('undefined')).toBe('undefined'); // Probar el string "undefined"
  });

  it('should not alter text without new lines or bold formatting', () => {
    const input = 'Just some plain text.';
    const result = pipe.transform(input);
    
    expect(result).toEqual(input);
  });

  it('should transform multiple bold and new line occurrences', () => {
    const input = '**Bold1**\nNormal text\n**Bold2**\n**Bold3**';
    const expectedOutput = '<strong>Bold1</strong><br>Normal text<br><strong>Bold2</strong><br><strong>Bold3</strong>';
    
    const result = pipe.transform(input);
    
    expect(result).toEqual(expectedOutput);
  });
});

import Greeting from '../Greeting.js';

describe('Greeting', () => {
  it('should generate greeting message correctly', () => {
    const result = Greeting.generate('World');

    expect(result).toBe('Hi, World!');
  });
});

import { getErrorMessage } from '../../src/utils/errorUtils';

describe('getErrorMessage', () => {
  it('returns stack when available', () => {
    const error = new Error('Error message');
    error.stack = 'stack trace here';
    expect(getErrorMessage(error)).toBe('stack trace here');
  });

  it('returns message when stack does not exist', () => {
    const error = new Error('Error message');
    error.stack = undefined as any;
    expect(getErrorMessage(error)).toBe('Error message');
  });

  it('converts non-Error values to string', () => {
    expect(getErrorMessage('simple error')).toBe('simple error');
    expect(getErrorMessage(123)).toBe('123');
    expect(getErrorMessage({})).toBe('[object Object]');
  });
});

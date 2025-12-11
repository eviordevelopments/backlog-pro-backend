import { BaseDomainException } from './index';

class TestDomainException extends BaseDomainException {
  constructor() {
    super('TEST_001', 'Test exception message');
  }
}

class AnotherTestException extends BaseDomainException {
  constructor() {
    super('TEST_002', 'Another test exception');
  }
}

describe('BaseDomainException', () => {
  it('should create exception with unique code', () => {
    const exception = new TestDomainException();

    expect(exception.codigo).toBe('TEST_001');
    expect(exception.mensaje).toBe('Test exception message');
  });

  it('should have different codes for different exceptions', () => {
    const exception1 = new TestDomainException();
    const exception2 = new AnotherTestException();

    expect(exception1.codigo).not.toBe(exception2.codigo);
    expect(exception1.codigo).toBe('TEST_001');
    expect(exception2.codigo).toBe('TEST_002');
  });

  it('should be instance of Error', () => {
    const exception = new TestDomainException();

    expect(exception).toBeInstanceOf(Error);
    expect(exception).toBeInstanceOf(BaseDomainException);
  });

  it('should have correct name property', () => {
    const exception = new TestDomainException();

    expect(exception.name).toBe('TestDomainException');
  });

  it('should capture stack trace', () => {
    const exception = new TestDomainException();

    expect(exception.stack).toBeDefined();
    expect(exception.stack).toContain('TestDomainException');
  });
});

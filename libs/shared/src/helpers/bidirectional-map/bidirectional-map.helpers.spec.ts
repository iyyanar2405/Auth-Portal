import { BidirectionalMap } from './bidirectional-map.helpers';

describe('BidirectionalMap', () => {
  let map: BidirectionalMap<string, number>;

  beforeEach(() => {
    map = new BidirectionalMap<string, number>();
  });

  test('should initialize with given pairs', () => {
    // Arrange
    const pairs: [string, number][] = [
      ['id', 1],
      ['empId', 123],
    ];

    // Act
    map = new BidirectionalMap(pairs);

    // Assert
    expect(map.getValue('id')).toEqual(1);
    expect(map.getValue('empId')).toEqual(123);
    expect(map.getKey(1)).toEqual('id');
    expect(map.getKey(123)).toEqual('empId');
  });

  test('should initialize with empty pairs', () => {
    // Arrange
    const pairs: [string, number][] = [];

    // Act
    map = new BidirectionalMap(pairs);

    // Assert
    expect(map.getValue('id')).toBeUndefined();
    expect(map.getKey(1)).toBeUndefined();
  });

  test('should update and access key-value pairs correctly', () => {
    // Arrange
    const key = 'id';
    const value = 1;

    // Act
    map.set(key, value);
    const expectedValue = map.getValue(key);
    const expectedKey = map.getKey(value);

    // Assert
    expect(expectedValue).toBe(value);
    expect(expectedKey).toBe(key);
  });

  test('should get key by value', () => {
    // Arrange
    const key = 'id';
    const value = 1;

    // Act
    map.set(key, value);
    const expectedKey = map.getKey(value);

    // Assert
    expect(expectedKey).toBe(key);
  });

  test('should get value by key', () => {
    // Arrange
    const key = 'id';
    const value = 1;

    // Act
    map.set(key, value);
    const expectedValue = map.getValue(key);

    // Assert
    expect(expectedValue).toBe(value);
  });

  test('should delete by key', () => {
    // Arrange
    const key = 'id';
    const value = 1;
    map.set(key, value);

    // Act
    map.deleteByKey(key);
    const result = map.getValue(key);

    // Assert
    expect(result).toBeUndefined();
  });

  test('should delete by value', () => {
    // Arrange
    const key = 'id';
    const value = 1;
    map.set(key, value);

    // Act
    map.deleteByValue(value);
    const result = map.getKey(value);

    // Assert
    expect(result).toBeUndefined();
  });

  test('should return undefined for a value that was never set', () => {
    // Arrange
    const valueNotSet = 123;

    // Act
    const expectedKey = map.getKey(valueNotSet);

    // Assert
    expect(expectedKey).toBeUndefined();
  });

  test('should return undefined for a key that was never set', () => {
    // Arrange
    const keyNotSet = 'Name';

    // Act
    const expectedValue = map.getValue(keyNotSet);

    // Assert
    expect(expectedValue).toBeUndefined();
  });

  test('should update the value when the same key is inserted multiple times', () => {
    // Arrange
    map.set('id', 1);
    map.deleteByKey('id');

    // Act
    map.set('id', 2);
    const expectedValue = map.getValue('id');
    const expectedKey = map.getKey(2);

    // Assert
    expect(expectedValue).toBe(2);
    expect(expectedKey).toBe('id');
    expect(map.getKey(1)).toBeUndefined();
  });

  test('should update the key when the same value is inserted multiple times', () => {
    // Arrange
    map.set('id', 1);
    map.deleteByValue(1);

    // Act
    map.set('empId', 1);
    const expectedValue = map.getValue('empId');
    const expectedKey = map.getKey(1);

    // Assert
    expect(expectedValue).toBe(1);
    expect(expectedKey).toBe('empId');
    expect(map.getValue('id')).toBeUndefined();
  });
});

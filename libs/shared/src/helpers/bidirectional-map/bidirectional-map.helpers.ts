export class BidirectionalMap<K, V> {
  private keyToValueMap = new Map<K, V>();
  private valueToKeyMap = new Map<V, K>();

  constructor(pairs?: [K, V][]) {
    if (pairs) {
      pairs.forEach(([key, value]) => {
        this.set(key, value);
      });
    }
  }

  set(key: K, value: V): void {
    this.keyToValueMap.set(key, value);
    this.valueToKeyMap.set(value, key);
  }

  getValue(key: K): V | undefined {
    return this.keyToValueMap.get(key);
  }

  getKey(value: V): K | undefined {
    return this.valueToKeyMap.get(value);
  }

  deleteByKey(key: K): void {
    const value = this.keyToValueMap.get(key);

    if (value !== undefined) {
      this.keyToValueMap.delete(key);
      this.valueToKeyMap.delete(value);
    }
  }

  deleteByValue(value: V): void {
    const key = this.valueToKeyMap.get(value);

    if (key !== undefined) {
      this.valueToKeyMap.delete(value);
      this.keyToValueMap.delete(key);
    }
  }
}

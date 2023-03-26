export const mockLocalStorage = () => {
  let storage: { [key: string]: string } = {};
  return {
    getItem(key: string) {
      return storage[key] || null;
    },
    setItem(key: string, value: string) {
      storage[key] = value;
    },
    removeItem(key: string) {
      delete storage[key];
    },
    clear() {
      storage = {};
    },
  };
};

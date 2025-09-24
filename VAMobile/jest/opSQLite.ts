module.exports = {
  ANDROID_DATABASE_PATH: '',
  IOS_LIBRARY_PATH: '',
  Storage: jest.fn().mockImplementation(() => {
    return {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }
  }),
}

module.exports = {
  getCurrentConnectivity: jest.fn(),
  isConnectionMetered: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  useNetInfo: jest.fn().mockReturnValue({ isConnected: true }),
  isConnected: {
    fetch: () => {
      return Promise.resolve(true)
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}

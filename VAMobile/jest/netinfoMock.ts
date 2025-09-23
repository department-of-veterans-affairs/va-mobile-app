module.exports = {
  addEventListener: jest.fn(),
  useNetInfo: jest.fn().mockReturnValue({ isConnected: true }),
}

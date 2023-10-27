const mockSetDefaultsSpy = jest.fn()

jest.mock('@react-native-firebase/remote-config', () => () => ({
    fetch: jest.fn(() => Promise.resolve()),
    getValue: jest.fn(() => ({
      asBoolean: () => true,
    })),
    getAll: jest.fn(() => false),
    activate: jest.fn(() => Promise.resolve()),
    setConfigSettings: jest.fn(() => Promise.resolve()),
    setDefaults: mockSetDefaultsSpy,
  }))
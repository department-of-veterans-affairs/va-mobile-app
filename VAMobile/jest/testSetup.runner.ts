global.beforeEach(() => {
  jest.useFakeTimers({ legacyFakeTimers: true })
})

global.afterEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

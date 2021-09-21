global.beforeEach(() => {
  jest.useFakeTimers('legacy')
})

global.afterEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

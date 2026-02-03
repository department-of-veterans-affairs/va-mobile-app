import { logScreenViewOnNavChange } from 'utils/analytics'

const mockLogScreenView = jest.fn(() => Promise.resolve())
jest.mock('@react-native-firebase/analytics', () => {
  return jest.fn(() => ({
    logScreenView: mockLogScreenView,
  }))
})

describe('logScreenViewOnNavChange', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should log a screen view when the route name changes', async () => {
    await logScreenViewOnNavChange('Screen1', 'Screen2')
    expect(mockLogScreenView).toHaveBeenCalledWith({
      screen_name: 'Screen2',
      screen_class: 'Screen2',
    })
    mockLogScreenView.mockClear()

    await logScreenViewOnNavChange('Screen1', 'Screen2', false)
    expect(mockLogScreenView).toHaveBeenCalledWith({
      screen_name: 'Screen2',
      screen_class: 'Screen2',
    })
  })

  it('should not log a screen view when route name is the same', async () => {
    await logScreenViewOnNavChange('Screen2', 'Screen2')
    expect(mockLogScreenView).not.toHaveBeenCalled()
    mockLogScreenView.mockClear()

    await logScreenViewOnNavChange('Screen2', 'Screen2', false)
    expect(mockLogScreenView).not.toHaveBeenCalled()
  })

  it('should not log a screen view when ignoring the screen view', async () => {
    await logScreenViewOnNavChange('Screen1', 'Screen2', true)
    expect(mockLogScreenView).not.toHaveBeenCalled()
  })

  it('should not log a screen view when current route name is undefined', async () => {
    await logScreenViewOnNavChange('Screen1', undefined)
    expect(mockLogScreenView).not.toHaveBeenCalled()
  })
})

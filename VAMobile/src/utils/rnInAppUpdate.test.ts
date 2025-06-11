import { NativeModules } from 'react-native'

import { requestStorePopup, requestStoreVersion } from 'utils/rnInAppUpdate'

// Mock NativeModules.RNInAppUpdate
jest.mock('react-native', () => ({
  NativeModules: {
    // Mock the RNInAppUpdate module with mock implementations for its methods
    RNInAppUpdate: {
      requestStoreVersion: jest.fn(), // Mock the requestStoreVersion method
      requestStorePopup: jest.fn(), // Mock the requestStorePopup method
    },
  },
}))

// Get a reference to the mocked native module methods
const mockInAppUpdate = NativeModules.RNInAppUpdate

describe('InAppUpdate API', () => {
  // Clear all mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('requestStoreVersion', () => {
    test('should return the store version string on successful request', async () => {
      // Arrange: Set up the mock to resolve with a specific version string
      mockInAppUpdate.requestStoreVersion.mockResolvedValue('2.50.0')

      // Act: Call the function being tested
      const version = await requestStoreVersion()

      // Assert: Verify the native module method was called and the correct value was returned
      expect(mockInAppUpdate.requestStoreVersion).toHaveBeenCalledTimes(1)
      expect(version).toBe('2.50.0')
    })

    test('should throw an error if the native module call fails', async () => {
      // Arrange: Set up the mock to reject with an error
      const errorMessage = 'Failed to get store version'
      mockInAppUpdate.requestStoreVersion.mockRejectedValue(new Error(errorMessage))

      // Act & Assert: Expect the function to throw the error
      await expect(requestStoreVersion()).rejects.toThrow(errorMessage)
      expect(mockInAppUpdate.requestStoreVersion).toHaveBeenCalledTimes(1)
    })
  })

  describe('requestStorePopup', () => {
    test('should return true when the store popup request is successful', async () => {
      // Arrange: Set up the mock to resolve with true
      mockInAppUpdate.requestStorePopup.mockResolvedValue(true)

      // Act: Call the function being tested
      const popupResult = await requestStorePopup()

      // Assert: Verify the native module method was called and the correct boolean was returned
      expect(mockInAppUpdate.requestStorePopup).toHaveBeenCalledTimes(1)
      expect(popupResult).toBe(true)
    })

    test('should return false when the store popup request is unsuccessful (e.g., user declines)', async () => {
      // Arrange: Set up the mock to resolve with false
      mockInAppUpdate.requestStorePopup.mockResolvedValue(false)

      // Act: Call the function being tested
      const popupResult = await requestStorePopup()

      // Assert: Verify the native module method was called and the correct boolean was returned
      expect(mockInAppUpdate.requestStorePopup).toHaveBeenCalledTimes(1)
      expect(popupResult).toBe(false)
    })

    test('should throw an error if the native module call for popup fails', async () => {
      // Arrange: Set up the mock to reject with an error
      const errorMessage = 'Popup display failed'
      mockInAppUpdate.requestStorePopup.mockRejectedValue(new Error(errorMessage))

      // Act & Assert: Expect the function to throw the error
      await expect(requestStorePopup()).rejects.toThrow(errorMessage)
      expect(mockInAppUpdate.requestStorePopup).toHaveBeenCalledTimes(1)
    })
  })
})

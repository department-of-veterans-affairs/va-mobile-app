import Foundation

@objc(RNDatePickerManager)
class RNDatePickerManager: RCTViewManager {
  override func view() -> UIView! {
    return RNDatePickerView()
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
import Foundation
import React

@objc(RNDatePickerManager)
class RNDatePickerManager: RCTViewManager {
  override func view() -> UIView! {
    return RNDatePicker()
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

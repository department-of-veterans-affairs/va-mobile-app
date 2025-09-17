//
//  RNDatePicekrManager.swift
//  VAMobile
//
//  Created by Adryien Hayes on 8/6/25.
//

import Foundation
import React

/// This module allows React Native to manage and render a custom date picker component
@objc(RNDatePickerManager)
class RNDatePickerManager: RCTViewManager {

  /// Creates and returns an instance of the custom `RNDatePicker` view found in RNDatePicker.swift
  /// - Returns: A `UIView` instance of the custom date picker
  override func view() -> UIView! {
    return RNDatePicker()
  }

  /// Tells Native OS to set this module up on the Main thread
  /// - Returns: true
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

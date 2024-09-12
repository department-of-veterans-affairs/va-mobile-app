//
//  RNCheckExternalKeyboard.swift
//  VAMobile
//
//  Created by Chris Alexander on 9/12/24.
//

import Foundation
import GameController

// This module allows React to check if an external keyboard is connected
@objc(RNCheckExternalKeyboard)
class RNCheckExternalKeyboard: NSObject {
  /// This sends the name of the module to React Native so that it can be imported from NativeModules
  /// - Returns: "RNCheckExternalKeyboard"
  static func moduleName() -> String! {
    return "RNCheckExternalKeyboard"
  }
  
  /// Tells Native OS to set this module up on the Main thread
  /// - Returns: true
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  /// Checks if an external keyboard is connected
  /// - Parameters:
  ///   - resolve: React Native Promise resolver.
  ///   - reject: React Native Promise rejecter.
  /// - Returns: resolves the call and returns a boolean to the resolver block which is read by the Promise call in React Native
  @objc func isExternalKeyboardConnected(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    // GCKeyboard was introduced in iOS 14 (Sept 2020), so avoid it in earlier versions
    if #available(iOS 14.0, *) {
      let isKeyboardConnected = GCKeyboard.coalesced != nil
      resolve(isKeyboardConnected)
    } else {
      resolve(false)
    }
  }
}

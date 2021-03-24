//
//  RNCheckVoiceOver.swift
//  VAMobile
//
//  Created by Komal Yaseen on 3/23/21.
//

import Foundation
import UIKit

// This module allows React to check if VoiceOver is currently running
@objc(RNCheckVoiceOver)
class RNCheckVoiceOver: NSObject {
  /// This sends the name of the module to React Native so that it can be imported from NativeModules
  /// - Returns: "RNCheckVoiceOver"
  static func moduleName() -> String! {
    return "RNCheckVoiceOver"
  }
  
  /// Tells Native OS to set this module up on the Main thread
  /// - Returns: true
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  /// Checks if VoiceOver is currently running
  /// - Parameters:
  ///   - resolve: React Native Promise resolver.
  ///   - reject: React Native Promise rejecter.
  /// - Returns: resolves the call and returns a boolean to the resolver block which is read by the Promise call in React Native
  @objc func isVoiceOverRunning(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    resolve(UIAccessibility.isVoiceOverRunning)
  }
}

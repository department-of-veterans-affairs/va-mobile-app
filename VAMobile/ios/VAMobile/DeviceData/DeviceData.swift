//
//  DeviceData.swift
//  VAMobile
//
//  Created by Pasquale L Saxton on 10/26/20.
//

import Foundation
import UIKit

@objc(DeviceData)
class DeviceData: NSObject, RCTBridgeModule {

   static func moduleName() -> String! {
    return "DeviceData"
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
   }

  @objc(getDeviceName:rejecter:)
  func getDeviceName(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
    resolve(UIDevice.current.name)
  }
  
  @objc(getVersionName:rejecter:)
  func getVersionName(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
    resolve(UIApplication.versionName)
  }
  
  @objc(getBuildNumber:rejecter:)
  func getBuildNumber(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
    resolve(UIApplication.build)
  }
  
}

extension UIApplication {
  static var versionName: String {
    return Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0.0.0"
  }
  static var build: Int {
    if let value = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String {
        return Int(value) ?? -1
    } else {
      return -1
    }
  }
}

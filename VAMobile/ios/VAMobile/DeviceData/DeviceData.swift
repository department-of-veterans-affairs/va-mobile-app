//
//  DeviceData.swift
//  VAMobile
//
//  Created by Pasquale L Saxton on 10/26/20.
//

import Foundation
import UIKit

struct Constants {
 #if RC
 static let versionSuffix = ".RC"
 #elseif QA
 static let versionSuffix = ".QA"
 #else
 static let versionSuffix = ""
 #endif
}

@objc(DeviceData)
class DeviceData: NSObject, RCTBridgeModule {

   static func moduleName() -> String! {
    return "DeviceData"
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
   }


  // Exposes the device name from the global settings.
  // @returns the user-assigned name of the device.
  @objc(getDeviceName:rejecter:)
  func getDeviceName(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
    resolve(UIDevice.current.name)
  }
  
  
  // Exposes the app version name.
  // @returns version name of the app (1.1.1).  
  @objc(getVersionName:rejecter:)
  func getVersionName(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
   resolve("\(UIApplication.versionName)\(Constants.versionSuffix)")
  }
  
  
  //Exposes the app build number.
  // @returns build number of the app (0).
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

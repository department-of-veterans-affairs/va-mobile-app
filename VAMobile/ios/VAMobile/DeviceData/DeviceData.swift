//
//  DeviceData.swift
//  VAMobile
//
//  Created by Pasquale L Saxton on 10/26/20.
//

import Foundation
import UIKit

@objc(DeviceData)
class DeviceData: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
   }
  
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
   return [
    "deviceName" : UIDevice.current.name,
    "versionName" :   UIApplication.versionName,
    "buildNumber" : UIApplication.build
   ]
  }
}

extension UIApplication {
  static var versionName: String {
    return Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0.0.0"
  }
  static var build: String {
    return Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "-1"
  }
}

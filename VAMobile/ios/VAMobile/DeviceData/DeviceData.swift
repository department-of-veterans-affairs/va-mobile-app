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
  func constantsToExport() -> [AnyHashable : Any]! {
   return [
    "deviceName" : UIDevice.current.name
   ]
  }
}

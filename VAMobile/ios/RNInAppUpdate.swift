//
//  RNInAppUpdate.swift
//  VAMobile
//
//  Created by Dylan Nienberg on 11/11/22.
//

import Foundation

@objc(RNInAppUpdate)
class RNInAppUpdate: NSObject, RCTBridgeModule {
  /// This sends the name of the module to React Native so that it can be imported from NativeModules
  /// - Returns: "RNInAppUpdate"
  static func moduleName() -> String! {
    return "RNInAppUpdate"
  }
  
  /// Tells Native OS to set this module up on the Main thread
  /// - Returns: true
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  /// fires a request to store to find app version
  /// - Returns: promise<app version>
  @objc(requestStoreVersion:rejecter:)
  func requestStoreVersion(_  resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
   var request = URLRequest(url: URL(string: "http://itunes.apple.com/lookup?bundleId=gov.va.vamobileapp")!, cachePolicy: NSURLRequest.CachePolicy.reloadIgnoringLocalCacheData, timeoutInterval: Double.infinity)
   request.httpMethod = "GET"
   let task = URLSession.shared.dataTask(with: request) { data, response, error in
     guard let data = data else {
       return
     }
   do {
    if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any], let results = json["results"] as? [[String:Any]], let version = results[0]["version"] as? String, let minimumOsVersion = results[0]["minimumOsVersion"] as? String, let supportedDevices = results[0]["supportedDevices"] as? [String] {
     
     var resolvedString = version + ", " + minimumOsVersion
     
     for device in supportedDevices {
      resolvedString = resolvedString + ": " + device
     }
     resolve(resolvedString)
    }
   } catch _ as NSError {
     resolve("0.0.0")
   }
     
   }
   task.resume()
  }
 
 @objc(requestStorePopup:rejecter:)
 func requestStorePopup(_  resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
  
  let alertController = UIAlertController(title: "", message: "You're leaving the app", preferredStyle: .alert)
  let okAction = UIAlertAction(title: "Ok", style: .default) { (_) in
    resolve(true)
  }
  let cancelAction = UIAlertAction(title: "Cancel", style: .default) { (_) in
   resolve(false)
 }
  alertController.addAction(cancelAction)
  alertController.addAction(okAction)
  if let window: UIWindow = UIApplication.shared.keyWindow, let vc = window.rootViewController {
    DispatchQueue.main.async {
        vc.present(alertController, animated: true, completion: nil)
    }
  }
 }
}

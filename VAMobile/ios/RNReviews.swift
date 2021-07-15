//
//  RNReviews.swift
//  VAMobile
//
//  Created by Pasquale L Saxton on 7/15/21.
//

import Foundation
import StoreKit

@objc(RNReviews)
class RNReviews: NSObject, RCTBridgeModule {
  /// This sends the name of the module to React Native so that it can be imported from NativeModules
  /// - Returns: "RNReviews"
  static func moduleName() -> String! {
    return "RNReviews"
  }
  
  /// Tells Native OS to set this module up on the Main thread
  /// - Returns: true
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  /// fires a request to StoreKit to request a review.
  /// - Returns: promise<boolean>
  @objc(requestReview:rejecter:)
  func requestReview(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)-> Void {
    SKStoreReviewController.requestReviewInCurrentScene()
    resolve(true)
  }
}

/// extension function to use the correct method to run the StoreKit requestReview flow
extension SKStoreReviewController {
  public static func requestReviewInCurrentScene() -> Void {
    if #available(iOS 14.0, *) {
      if let scene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene {
        requestReview(in: scene)
      } else {
        // Fallback on earlier versions
        requestReview()
      }
    }
  }
}

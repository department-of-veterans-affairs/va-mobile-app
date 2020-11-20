//
//  RNCalendar.swift
//  VAMobile
//
//  Created by Pasquale L Saxton on 11/9/20.
//

import Foundation
import UIKit
import EventKitUI

/// This module allows the React-Native bridge to check and request access to the Native Calendar and to add events to the calendar
@objc(RNCalendar)
class RNCalendar: NSObject, EKEventEditViewDelegate, RCTBridgeModule {
  /// This sends the name of the module to React Native so that it can be imported from NativeModules
  /// - Returns: "RNCalendar"
  static func moduleName() -> String! {
    return "RNCalendar"
  }
  
  /// Tells Native OS to set this module up on the Main thread
  /// - Returns: true
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  /// override method to conform to the EKEventEditViewDelegate contract.
  ///
  /// When a user dismisses the add calendar action sheet, this dismisses the EKEventEditViewController and returns to the calling app
  /// - Parameters:
  ///   - controller: EKEventEditViewController in action sheet that is adding the event
  ///   - action: EKEventEditViewAction action that happened in case we want to do other things with different actions.
  func eventEditViewController(_ controller: EKEventEditViewController, didCompleteWith action: EKEventEditViewAction) {
    DispatchQueue.main.async {
      controller.dismiss(animated: false, completion: nil)
    }
  }
  
  /// Checks to see if the app has access to the .event type in the EKEventStore.
  ///
  ///  The return value is a boolean that indicates the authorization is equal to EKAuthorizationStatus.authorized. There are four possible states for EKAuthorizationStatus.
  /// - Parameters:
  ///   - resolve: React Native Promise resolver.
  ///   - reject: React Native Promise rejecter.
  /// - Returns: resolves the call and returns a boolean to the resolver block which is read by the Promise call in React Native.
  @objc func hasPermission(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    resolve(EKEventStore.authorizationStatus(for: EKEntityType.event) == EKAuthorizationStatus.authorized)
  }
  
  /// Requests permission from the user to access the .event type on the EKEventStore
  /// - Parameters:
  ///   - resolve: React Native Promise resolver.
  ///   - reject: React Native Promise rejecter.
  /// - Returns: resolves the call and returns a boolean to the resolver block which is read by the Promise call in React Native or rejects with an error if something goes wrong.
  @objc func requestPermission(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void{
    let store = EKEventStore()
    store.requestAccess(to: .event) { (grant, e) in
      if (e != nil) {
        reject("000", "Permission Error", e)
      } else {
        resolve(grant)
      }
    }
  }
  
  /// Sends a request to the store to present a new event for the listed parameters.
  /// - Parameters:
  ///   - title: Title text to add to the event.
  ///   - beginTime: Start time in UTC seconds since 1970
  ///   - endTime: End time in UTC seconds since 1970
  ///   - location: Address or name of place where the event is taking place
  /// - Returns: Void
  @objc func addToCalendar(_ title: String, beginTime: NSNumber, endTime: NSNumber, location: String)-> Void {
    let store = EKEventStore()
    // create a new event object to save
    let event = EKEvent(eventStore: store)
    event.title = title
    event.startDate = Date(timeIntervalSince1970: TimeInterval(beginTime.doubleValue))
    event.endDate = Date(timeIntervalSince1970: TimeInterval(endTime.doubleValue))
    event.location = location
    event.calendar = store.defaultCalendarForNewEvents
    // get an instance of the ViewController that deals with events
    let eventVC = EKEventEditViewController()
    eventVC.event = event
    eventVC.eventStore = store
    eventVC.editViewDelegate = self
    // get the current application window and present the event viewcontroller
    if let window: UIWindow = UIApplication.shared.keyWindow, let vc = window.rootViewController {
      DispatchQueue.main.async {
          vc.present(eventVC, animated: true, completion: nil)
      }
    }
  }
}

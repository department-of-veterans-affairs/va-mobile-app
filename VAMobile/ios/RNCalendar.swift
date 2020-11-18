//
//  RNCalendar.swift
//  VAMobile
//
//  Created by Pasquale L Saxton on 11/9/20.
//

import Foundation
import UIKit
import EventKitUI

@objc(RNCalendar)
class RNCalendar: NSObject, EKEventEditViewDelegate, RCTBridgeModule {
  static func moduleName() -> String! {
    return "RNCalendar"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  func eventEditViewController(_ controller: EKEventEditViewController, didCompleteWith action: EKEventEditViewAction) {
    DispatchQueue.main.async {
      controller.dismiss(animated: false, completion: nil)
    }
  }
  
  @objc func hasPermission(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    resolve(EKEventStore.authorizationStatus(for: EKEntityType.event) == EKAuthorizationStatus.authorized)
  }
  
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
  
  @objc func addToCalendar(_ title: String, beginTime: NSNumber, endTime: NSNumber, location: String)-> Void {
    let store = EKEventStore()
    let event = EKEvent(eventStore: store)
    store.requestAccess(to: .event) { (grant, e) in
         if(grant) {
          event.title = title
          event.startDate = Date(timeIntervalSince1970: TimeInterval(beginTime.doubleValue))
          event.endDate = Date(timeIntervalSince1970: TimeInterval(endTime.doubleValue))
          event.location = location
          event.calendar = store.defaultCalendarForNewEvents
          
          let eventVC = EKEventEditViewController()
          eventVC.event = event
          eventVC.eventStore = store
          eventVC.editViewDelegate = self
          if let window: UIWindow = UIApplication.shared.keyWindow, let vc = window.rootViewController {
            DispatchQueue.main.async {
                vc.present(eventVC, animated: true, completion: nil)
            }
          }
          
         
          print("ready to save")
         }}
//    do {
//      try store.save(event, span: .thisEvent, commit: true)
//    } catch {
//      print("error")
//      print(error.localizedDescription)
//    }
//    store.requestAccess(to: .event) { (grant, e) in
//      if(grant) {
//        let event = EKEvent(eventStore: store)
//        event.title = title
//        event.startDate = Date(timeIntervalSince1970: TimeInterval(beginTime))
//        event.endDate = Date(timeIntervalSince1970: TimeInterval(endTime))
//        event.location = location
//
//        let eventVC = EKEventEditViewController()
//        eventVC.event = event
//        eventVC.eventStore = store
//        eventVC.editViewDelegate = self
//        do {
//          try store.save(event, span: .thisEvent)
//        } catch {
//          print(error.localizedDescription)
//        }
//      }
//    }
    
  }
}

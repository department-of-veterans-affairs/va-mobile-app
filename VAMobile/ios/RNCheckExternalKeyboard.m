//
//  RNCheckExternalKeyboard.m
//  VAMobile
//
//  Created by Chris Alexander on 9/12/24.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>

@interface RCT_EXTERN_MODULE(RNCheckExternalKeyboard, NSObject)
RCT_EXTERN_METHOD(isExternalKeyboardConnected: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

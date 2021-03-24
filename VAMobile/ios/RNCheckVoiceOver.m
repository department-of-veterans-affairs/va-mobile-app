//
//  RNCheckVoiceOver.m
//  VAMobile
//
//  Created by Komal Yaseen on 3/23/21.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>

@interface RCT_EXTERN_MODULE(RNCheckVoiceOver, NSObject)
RCT_EXTERN_METHOD(isVoiceOverRunning: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

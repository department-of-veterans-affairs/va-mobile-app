//
//  DeviceData.m
//  VAMobile
//
//  Created by Pasquale L Saxton on 10/26/20.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeviceData, NSObject)
RCT_EXTERN_METHOD(getDeviceName: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getVersionName: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBuildNumber: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

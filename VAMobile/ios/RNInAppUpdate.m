//
//  RNInAppUpdate.m
//  VAMobile
//
//  Created by Dylan Nienberg on 11/11/22.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


@interface RCT_EXTERN_MODULE(RNInAppUpdate, NSObject)
RCT_EXTERN_METHOD(requestStoreVersion: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(requestStorePopup: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

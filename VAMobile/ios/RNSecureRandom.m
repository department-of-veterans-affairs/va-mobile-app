//
//  RNSecureRandom.m
//  VAMobile
//
//  Created by Pasquale L Saxton on 6/22/21.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RNSecureRandom, NSObject)
RCT_EXTERN_METHOD(generateBase64: (nonnull NSNumber *)count resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(generateSHA256String: (nonnull NSString *)string resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

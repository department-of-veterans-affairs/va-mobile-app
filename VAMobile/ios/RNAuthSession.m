//
//  RNAuthSession.m
//  VAMobile
//
//  Created by Pasquale L Saxton on 6/3/21.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


@interface RCT_EXTERN_MODULE(RNAuthSession, NSObject)
RCT_EXTERN_METHOD(beginAuthSession: (NSString *)authUrl codeChallenge:(NSString *)codeChallenge resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearCookies: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

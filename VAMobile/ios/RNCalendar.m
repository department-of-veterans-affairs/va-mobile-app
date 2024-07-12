//
//  RNCalendar.m
//  VAMobile
//
//  Created by Pasquale L Saxton on 11/9/20.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


@interface RCT_EXTERN_MODULE(RNCalendar, NSObject)
RCT_EXTERN_METHOD(addToCalendar: (NSString *)title beginTime:(nonnull NSNumber*)beginTime endTime:(nonnull NSNumber*)endTime location:(NSString *)location latitude:(nonnull NSNumber*)latitude longitude:(nonnull NSNumber*)longitude)
RCT_EXTERN_METHOD(hasPermission: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(requestPermission: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end


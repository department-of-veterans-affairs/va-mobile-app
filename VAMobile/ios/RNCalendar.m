//
//  RNCalendar.m
//  VAMobile
//
//  Created by Pasquale L Saxton on 11/9/20.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNCalendar, NSObject)
RCT_EXTERN_METHOD(addToCalendar: (NSString *)title beginTime:(nonnull NSNumber*)beginTime endTime:(nonnull NSNumber*)endTime location:(NSString *)location)
RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(NSNumber *)date)

@end


//
//  RNReviews.m
//  VAMobile
//
//  Created by Pasquale L Saxton on 7/15/21.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


@interface RCT_EXTERN_MODULE(RNReviews, NSObject)
RCT_EXTERN_METHOD(requestReview: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

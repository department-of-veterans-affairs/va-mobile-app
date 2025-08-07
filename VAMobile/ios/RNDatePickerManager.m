#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNDatePickerManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(onDateChange, RCTBubblingEventBlock)

@end
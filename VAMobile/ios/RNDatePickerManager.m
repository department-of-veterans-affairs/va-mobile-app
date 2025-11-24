//
//  RNDatePicekrManager.m
//  VAMobile
//
//  Created by Adryien Hayes on 8/6/25.
//

#import <React/RCTViewManager.h>

/// This interface exposes the RNDatePickerManager module to React Native
/// It allows React Native to interact with the native date picker component
@interface RCT_EXTERN_MODULE(RNDatePickerManager, RCTViewManager)

/// Exports the `date` property to React Native
/// This allows React Native to set the currently selected date as a string
RCT_EXPORT_VIEW_PROPERTY(date, NSString)

/// Exports the `minimumDate` property to React Native
/// This allows React Native to set the earliest selectable date for the date picker
RCT_EXPORT_VIEW_PROPERTY(minimumDate, NSString)

/// Exports the `maximumDate` property to React Native
/// This allows React Native to set the latest selectable date for the date picker
RCT_EXPORT_VIEW_PROPERTY(maximumDate, NSString)


/// Exports the `onDateChange` property to React Native as an event callback
/// This allows the native date picker to call onDateChange when the date changes, 
/// which React Native delivers to JS as event.nativeEvent
RCT_EXPORT_VIEW_PROPERTY(onDateChange, RCTBubblingEventBlock)

@end

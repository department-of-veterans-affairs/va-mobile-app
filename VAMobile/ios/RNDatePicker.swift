//
//  RNDatePicekrManager.swift
//  VAMobile
//
//  Created by Adryien Hayes on 8/6/25.
//

import UIKit
import React

/// A helper function to parse an ISO8601 date string into a `Date` object
/// - Parameter date: An optional `NSString` representing the date in ISO8601 format
/// - Returns: A `Date` object if parsing is successful, otherwise `nil`
private func parseDate(date: NSString?) -> Date?  {
 guard let dateStr = date as String?,
           let parsedDate = ISO8601DateFormatter().date(from: dateStr) else {
  return nil
     }
 return parsedDate
}

/// A custom `UIView` that wraps a `UIDatePicker` and exposes properties and events to React Native
class RNDatePicker: UIView {
  /// The `UIDatePicker` instance used to display and select dates
  let datePicker = UIDatePicker()

  /// A callback event that is triggered when the selected date changes
  @objc var onDateChange: RCTBubblingEventBlock?
 
 /// The currently selected date, exposed as an `NSString` for React Native
 @objc var date: NSString? {
  didSet {
   if let parsedDate = parseDate(date: date) { datePicker.date = parsedDate }
  }
 }
 
 /// The minimum selectable date, exposed as an `NSString` for React Native
 @objc var minimumDate: NSString? {
   didSet {
    if let parsedDate = parseDate(date: minimumDate) { datePicker.minimumDate = parsedDate }
   }
 }
 
 /// The maximum selectable date, exposed as an `NSString` for React Native
 @objc var maximumDate: NSString? {
   didSet {
    if let parsedDate = parseDate(date: maximumDate) { datePicker.maximumDate = parsedDate }
   }
 }

  /// Initializes the `RNDatePicker`
  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setup()
  }

  /// Sets up the `UIDatePicker` and its constraints
  private func setup() {
    /// Uses the inline style for the date picker if available (iOS 14+)
    if #available(iOS 14.0, *) {
      datePicker.preferredDatePickerStyle = .inline
    }
    datePicker.datePickerMode = .date
    datePicker.addTarget(self, action: #selector(dateChanged), for: .valueChanged)
    addSubview(datePicker)

    /// Make the date picker fill the parent view
    datePicker.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      datePicker.topAnchor.constraint(equalTo: topAnchor),
      datePicker.bottomAnchor.constraint(equalTo: bottomAnchor),
      datePicker.leadingAnchor.constraint(equalTo: leadingAnchor),
      datePicker.trailingAnchor.constraint(equalTo: trailingAnchor)
    ])
  }

  /// Called when the selected date changes in the `UIDatePicker`
  /// Sends the new date to React Native as an ISO8601 string
  @objc private func dateChanged() {
    let isoDate = ISO8601DateFormatter().string(from: datePicker.date)
    onDateChange?(["date": isoDate])
  }
}

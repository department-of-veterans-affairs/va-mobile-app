import UIKit
import React

class RNDatePicker: UIView {
  let datePicker = UIDatePicker()

  @objc var onDateChange: RCTBubblingEventBlock?
 
 @objc var date: NSString? {
   didSet {
    guard let dateStr = date as String?,
              let parsedDate = ISO8601DateFormatter().date(from: dateStr) else {
          return
        }
        datePicker.date = parsedDate
   }
 }

  override init(frame: CGRect) {
    super.init(frame: frame)
    setup()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setup()
  }

  private func setup() {
    if #available(iOS 14.0, *) {
      datePicker.preferredDatePickerStyle = .inline
    }
    datePicker.datePickerMode = .date
    datePicker.addTarget(self, action: #selector(dateChanged), for: .valueChanged)
    addSubview(datePicker)

    datePicker.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      datePicker.topAnchor.constraint(equalTo: topAnchor),
      datePicker.bottomAnchor.constraint(equalTo: bottomAnchor),
      datePicker.leadingAnchor.constraint(equalTo: leadingAnchor),
      datePicker.trailingAnchor.constraint(equalTo: trailingAnchor)
    ])
  }

  @objc private func dateChanged() {
    let isoDate = ISO8601DateFormatter().string(from: datePicker.date)
    onDateChange?(["date": isoDate])
  }
}

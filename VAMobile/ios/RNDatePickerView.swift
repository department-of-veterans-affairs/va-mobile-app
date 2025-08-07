import UIKit

class RNDatePickerView: UIView {
  let datePicker = UIDatePicker()

  var onDateChange: RCTBubblingEventBlock?

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

export const GMTPrefix = 'GMT'

export const GMTTimezones = [
  // Pacific/Guam, Pacific/Saipan: GMT+10 => ChT for Chamorro Time
  {
    pattern: 'GMT+10',
    value: 'ChT',
  },
  // Asia/Manila: GMT+8 => PHT for Philippine Time
  {
    pattern: 'GMT+8',
    value: 'PHT',
  },
  // Pacific/Pago_Pago: GMT-11 => ST for Samoa Time
  {
    pattern: 'GMT-11',
    value: 'ST',
  },
]

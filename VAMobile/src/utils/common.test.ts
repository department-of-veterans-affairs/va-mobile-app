import { checkStringForPII } from './common'

describe('tests for checkStringForPII', () => {
  it('returns unchanged text and found=false when no PII is present', () => {
    const input = 'Hello, just a normal text.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(false)
    expect(result.newText).toBe(input)
  })

  it('masks phone number and sets found=true', () => {
    const input = 'My phone is 800-698-2411, call me later.'
    const expected = 'My phone is ###-###-####, call me later.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })

  it('masks phone number with squished text and sets found=true', () => {
    const input = 'My phone is800-698-2411, call me later.'
    const expected = 'My phone is###-###-####, call me later.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })

  it('masks SSN and sets found=true', () => {
    const input = 'My SSN is 123-45-6789'
    const expected = 'My SSN is ###-##-####'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })

  it('masks SSN with leading punctuation and sets found=true', () => {
    const input = 'My SSN:123-45-6789.'
    const expected = 'My SSN:###-##-####.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })

  it('masks emails and sets found=true', () => {
    const input = 'Contact me at test@gmail.com.'
    const expected = 'Contact me at xxxxxxx@xxx.xxx.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })

  it('masks emails with leading punctuation and sets found=true', () => {
    const input = 'Contact me:test@gmail.com.'
    const expected = 'Contact me:xxxxxxx@xxx.xxx.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })

  it('masks mailto links and sets found=true', () => {
    const input = 'Please email me at mailto:test@va.gov.'
    const expected = 'Please email me at xxxxxxx@xxx.xxx.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })

  it('masks mailto with leading punctuation links and sets found=true', () => {
    const input = 'Please email me at:mailto:test@va.gov.'
    const expected = 'Please email me at:xxxxxxx@xxx.xxx.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })

  it('masks multiple PII types in one string', () => {
    const input = 'Call me at 555-123-4567 or use mailto:test@va.gov. My SSN is 987-65-4321.'
    const expected = 'Call me at ###-###-#### or use xxxxxxx@xxx.xxx. My SSN is ###-##-####.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })

  it('partially masks PII within surrounding punctuation', () => {
    const input = '(123-45-6789) or +1(800)698-2411 => My SSN and phone number.'
    const expected = '(###-##-####) or ###-###-#### => My SSN and phone number.'
    const result = checkStringForPII(input)

    expect(result.found).toBe(true)
    expect(result.newText).toBe(expected)
  })
})

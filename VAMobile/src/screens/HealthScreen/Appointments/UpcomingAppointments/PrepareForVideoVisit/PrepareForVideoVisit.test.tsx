import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import PrepareForVideoVisit from './PrepareForVideoVisit'

context('PrepareForVideoVisit', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn() })
    render(<PrepareForVideoVisit {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Before your appointment:')).toBeTruthy()
    expect(
      screen.getByText(
        'If you’re using an iPad or iPhone for your appointment, you’ll need to download the VA Video Connect iOS app beforehand. If you’re using any other device, you don’t need to download any software or app before your appointment.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'You’ll need to have access to a web camera and microphone. You can use an external camera and microphone if your device doesn’t have one.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        /To connect to your Virtual Meeting Room at the appointment time, click the "Join session" button or the link that's in your confirmation email./,
      ),
    ).toBeTruthy()
    expect(screen.getByText('To have the best possible video experience, we recommend you:')).toBeTruthy()
    expect(
      screen.getByText('Connect to your video appointment from a quiet, private, and well-lighted location.'),
    ).toBeTruthy()
    expect(
      screen.getByText('Check to ensure you have a strong Internet connection before your appointment.'),
    ).toBeTruthy()
    expect(
      screen.getByText(
        'Connect to your appointment using a Wi-Fi network if using your mobile phone, rather than your cellular data network.',
      ),
    ).toBeTruthy()
    expect(screen.getByText('Medication review:')).toBeTruthy()
    expect(
      screen.getByText(
        'During your video appointment, your provider will want to review all the medications, vitamins, herbs, and supplements you’re taking—no matter if you got them from another provider, VA clinic, or local store.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        "Please be ready to talk about your medications during your video visit to ensure you're getting the best and safest care possible.",
      ),
    ).toBeTruthy()
  })
})

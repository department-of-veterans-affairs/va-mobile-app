import React from 'react'
import { Alert } from 'react-native'

import { t } from 'i18next'

import NoAccessSM from 'screens/HealthScreen/SecureMessaging/NoAccessSM/NoAccessSM'
import { context, fireEvent, render, screen } from 'testUtils'

context('NoAccessSM', () => {
  beforeEach(() => {
    render(<NoAccessSM />)
  })

  describe('when Learn how to upgrade link is clicked', () => {
    it('should launch external link', () => {
      fireEvent.press(screen.getByRole('link', { name: t('noAccessSM.findVACare') }))
      expect(Alert.alert).toBeCalled()
    })
  })
})

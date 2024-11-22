import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import HowDoIUpdateScreen from './HowDoIUpdateScreen'

context('HowDoIUpdateScreen', () => {
  const initializeTestInstance = (screenType = 'DOB'): void => {
    const props = mockNavProps(
      {},
      { setOptions: jest.fn(), navigate: jest.fn() },
      {
        params: {
          screenType: screenType,
        },
      },
    )

    render(<HowDoIUpdateScreen {...props} />)
  }

  it('initializes correctly for DOB', () => {
    initializeTestInstance('DOB')
    expect(screen.getByRole('header', { name: t('howDoIUpdate.dateOfBirth.title') })).toBeTruthy()
    expect(screen.getByText(t('howDoIUpdate.dateOfBirth.body'))).toBeTruthy()
    expect(screen.getByText(t('howDoIUpdate.ifEnrolledInVAHealth'))).toBeTruthy()
    expect(screen.getByRole('link', { name: t('howDoIUpdate.findYourNearestVAMedicalCenter') })).toBeTruthy()
    expect(screen.getByText(t('howDoIUpdate.ifNotEnrolledInVAHealth'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8008271000')) })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
  })

  it('initializes correctly for name', () => {
    initializeTestInstance('name')
    expect(screen.getByRole('header', { name: t('howDoIUpdate.name.title') })).toBeTruthy()
    expect(screen.getByText(t('howDoIUpdate.name.legalName'))).toBeTruthy()
    expect(screen.getByRole('link', { name: t('howDoIUpdate.learnToChangeLegalName') })).toBeTruthy()
    expect(screen.getByText(t('howDoIUpdate.name.incorrectRecords'))).toBeTruthy()
    expect(screen.getByText(t('howDoIUpdate.ifEnrolledInVAHealth'))).toBeTruthy()
    expect(screen.getByRole('link', { name: t('howDoIUpdate.findYourNearestVAMedicalCenter') })).toBeTruthy()
    expect(screen.getByText(t('howDoIUpdate.ifNotEnrolledInVAHealth'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8008271000')) })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
  })

  describe('when the find VA location link is clicked', () => {
    it('should show alert', () => {
      initializeTestInstance('DOB')
      fireEvent.press(screen.getByRole('link', { name: t('howDoIUpdate.findYourNearestVAMedicalCenter') }))
      expect(Alert.alert).toBeCalled()
    })
  })
})

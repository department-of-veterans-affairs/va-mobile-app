import { Linking } from 'react-native'
import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import { ClaimType } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { claim } from '../../claimData'
import ClaimStatus from './ClaimStatus'

const mockNavigationResultSpy = jest.fn()
const mockNavigationSpy = jest.fn(() => mockNavigationResultSpy)
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('ClaimStatus', () => {
  const maxEstDate = '2019-12-11'
  const initializeTestInstance = (maxEstDate: string, claimType: ClaimType): void => {
    const props = mockNavProps({
      claim: { ...claim, attributes: { ...claim.attributes, maxEstDate: maxEstDate } },
      claimType,
    })
    render(<ClaimStatus {...props} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    initializeTestInstance(maxEstDate, 'ACTIVE')
  })

  it('Renders ClaimStatus', () => {
    expect(screen.getAllByText('You have 2 file requests from VA')).toBeTruthy()
    expect(screen.getByTestId('Step 1 of 5. completed. Claim received June 6, 2019')).toBeTruthy()
    expect(screen.getByTestId('Step 2 of 5. completed. Initial review June 6, 2019')).toBeTruthy()
    expect(screen.getByTestId('Step 3 of 5. current. Evidence gathering, review, and decision July 16, 2020')).toBeTruthy()
    expect(screen.getByTestId('Step 4 of 5.  Preparation for notification')).toBeTruthy()
    expect(screen.getByTestId('Step 5 of 5.  Complete')).toBeTruthy()
    expect(screen.getByText('Why does VA sometimes combine claims?')).toBeTruthy()
    expect(screen.getByText("What should I do if I disagree with VA's decision on my disability claim?")).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Need help?' })).toBeTruthy()
    expect(screen.getByText('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.')).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
  })

  describe('when the claimType is ACTIVE', () => {
    describe('on click of Find out why we sometimes combine claims. list item', () => {
      it('should call useRouteNavigation', () => {
        fireEvent.press(screen.getByRole('button', { name: 'Why does VA sometimes combine claims?' }))
        expect(mockNavigationSpy).toHaveBeenCalledWith('ConsolidatedClaimsNote')
        expect(mockNavigationResultSpy).toHaveBeenCalledWith()
      })
    })

    describe('on click of What should I do if I disagree with VA’s decision on my disability claim? list item', () => {
      it('should call useRouteNavigation', () => {
        fireEvent.press(screen.getByRole('button', { name: "What should I do if I disagree with VA's decision on my disability claim?" }))
        expect(mockNavigationSpy).toHaveBeenCalledWith('WhatDoIDoIfDisagreement', { claimID: '600156928', claimStep: 3, claimType: 'Compensation' })
        expect(mockNavigationResultSpy).toHaveBeenCalledWith()
      })
    })
  })

  describe('when the claimType is CLOSED', () => {
    it('should display text detailing decision packet information and should display the date for the event in the events timeline where the type is "completed"', () => {
      initializeTestInstance('', 'CLOSED')
      expect(screen.getByText('We mailed you a decision letter. It should arrive within 10 days after the date we decided your claim. It can sometimes take longer.')).toBeTruthy()
      expect(screen.getByText('We decided your claim on January 31, 2019')).toBeTruthy()
    })
  })

  describe('on click of the call click for action link', () => {
    it('should call Linking openURL', () => {
      fireEvent.press(screen.getByRole('link', { name: '800-827-1000' }))
      expect(Linking.openURL).toHaveBeenCalled()
    })
  })
})

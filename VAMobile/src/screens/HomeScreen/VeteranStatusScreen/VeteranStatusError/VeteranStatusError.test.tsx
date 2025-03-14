import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { militaryServiceHistoryKeys } from 'api/militaryService'
import { veteranStatusKeys } from 'api/veteranStatus'
import { QueriesData, context, render } from 'testUtils'

import VeteranStatusError from './VeteranStatusError'

context('VeteranStatusError', () => {
  const confirmedData = {
    data: {
      id: '',
      type: 'veteran_status_confirmations',
      attributes: {
        veteranStatus: 'confirmed',
      },
    },
  }
  const notConfirmedData = (notConfirmedReason: string) => {
    return {
      data: {
        id: '',
        type: 'veteran_status_confirmations',
        attributes: {
          veteranStatus: 'not confirmed',
          notConfirmedReason,
        },
      },
    }
  }
  const noTitle38Data = notConfirmedData('NOT_TITLE_38')
  const errorData = notConfirmedData('ERROR')
  const moreResearchNeededData = notConfirmedData('MORE_RESEARCH_NEEDED')
  const personNotFoundData = notConfirmedData('PERSON_NOT_FOUND')

  const renderWithOptions = (queriesData?: QueriesData) => {
    render(<VeteranStatusError />, { queriesData })
  }

  it('initializes correctly', () => {
    renderWithOptions()
    expect(screen.getByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
    expect(screen.getByText(t('veteranStatus.error.catchAll.body'))).toBeTruthy()
  })

  it('shows the NOT_TITLE_38 warning when users not-confirmed reason is NOT_TITLE_38', async () => {
    renderWithOptions([
      {
        queryKey: veteranStatusKeys.verification,
        data: noTitle38Data,
      },
    ])

    expect(screen.getByText(t('veteranStatus.error.notTitle38.title'))).toBeTruthy()
  })

  it('shows the ERROR warning when users not-confirmed reason is ERROR', async () => {
    renderWithOptions([
      {
        queryKey: veteranStatusKeys.verification,
        data: errorData,
      },
    ])

    expect(screen.getByText(t('errors.somethingWentWrong'))).toBeTruthy()
  })

  it('shows the catch-all warning when users not-confirmed reason is MORE_RESEARCH_NEEDED', async () => {
    renderWithOptions([
      {
        queryKey: veteranStatusKeys.verification,
        data: moreResearchNeededData,
      },
    ])

    expect(screen.getByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
  })

  it('shows the catch-all warning when users not-confirmed reason is PERSON_NOT_FOUND', async () => {
    renderWithOptions([
      {
        queryKey: veteranStatusKeys.verification,
        data: personNotFoundData,
      },
    ])

    expect(screen.getByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
  })

  it('shows the catch-all warning when user is confirmed, but has no military history', async () => {
    renderWithOptions([
      {
        queryKey: veteranStatusKeys.verification,
        data: confirmedData,
      },
      {
        queryKey: militaryServiceHistoryKeys.serviceHistory,
        data: {
          serviceHistory: [],
        },
      },
    ])

    expect(screen.getByText(t('veteranStatus.error.catchAll.title'))).toBeTruthy()
  })
})

import React from 'react'
import { Alert } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { waitFor } from '@testing-library/react-native'
import { RootNavStackParamList } from 'App'
import { t } from 'i18next'

import { context, fireEvent, render, screen } from 'testUtils'

import InAppFeedbackScreen from './InAppFeedbackScreen'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('InAppFeedbackScreen', () => {
  const initializeTestInstance = () => {
    const props = {
      navigation: {
        goBack: jest.fn(),
        addListener: jest.fn().mockReturnValue(() => {}),
      },
      route: {
        params: {
          screen: 'InAppFeedback',
        },
      },
    } as unknown as StackScreenProps<RootNavStackParamList, 'InAppFeedback'>

    render(<InAppFeedbackScreen {...props} />)
    return props
  }

  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockClear()
  })

  describe('onSubmit behavior with various inputs', () => {
    const submitFeedback = (text: string) => {
      fireEvent.changeText(screen.getByTestId('AppFeedbackTaskID'), text)
      fireEvent.press(screen.getByRole('button', { name: t('inAppFeedback.submitFeedback') }))
    }

    it('does NOT alert for normal text', async () => {
      initializeTestInstance()
      submitFeedback('Hello, I want to submit some feedback.')
      await waitFor(() => {
        // No alert means no PII found
        expect(Alert.alert).not.toHaveBeenCalled()
      })
    })

    // ------------------
    // SSN TEST CASES
    // ------------------
    it('alerts for an SSN', async () => {
      initializeTestInstance()
      submitFeedback('My SSN is 123-45-6789')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('alerts for an SSN with leading punctuation', async () => {
      initializeTestInstance()
      submitFeedback('My SSN:123-45-6789')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('alerts for an SSN with trailing punctuation', async () => {
      initializeTestInstance()
      submitFeedback('My SSN is 123-45-6789.')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('alerts for an SSN wrapped in parentheses', async () => {
      initializeTestInstance()
      submitFeedback('(123-45-6789) is my SSN.')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('alerts for an SSN with leading text', async () => {
      initializeTestInstance()
      submitFeedback('This is my123-45-6789.')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    // ------------------
    // PHONE NUMBER TEST CASES
    // ------------------
    it('alerts for a phone number with leading punctuation', async () => {
      initializeTestInstance()
      submitFeedback('Call me123-456-7890')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('alerts for a phone number with trailing punctuation', async () => {
      initializeTestInstance()
      submitFeedback('Call me at 123-456-7890.')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('alerts for a phone number with parentheses and plus sign', async () => {
      initializeTestInstance()
      submitFeedback('+1 (123) 456-7890 — call anytime')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    // ------------------
    // EMAIL TEST CASES
    // ------------------
    it('alerts for a valid email address', async () => {
      initializeTestInstance()
      submitFeedback('Please email me at test@gmail.com')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('alerts for an email address with leading punctuation', async () => {
      initializeTestInstance()
      submitFeedback('My email is,test@gmail.com, thanks!')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('alerts for an email address with trailing punctuation', async () => {
      initializeTestInstance()
      submitFeedback('My email is test@gmail.com, thanks!')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    // ------------------
    // MAILTO TEST CASES
    // ------------------
    it('alerts for a mailto link with leading punctuation', async () => {
      initializeTestInstance()
      submitFeedback('(mailto:test@gmail.com)')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })

    it('alerts for mailto with trailing punctuation', async () => {
      initializeTestInstance()
      submitFeedback('Try mailto:test@gmail.com.')
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled()
      })
    })
  })
})

import { context, realStore } from 'testUtils'
import _ from 'underscore'
import { CharacterOfServiceConstants, LetterBeneficiaryData, LetterBeneficiaryDataPayload, LettersList, LetterTypeConstants } from 'store/api/types'
import FileViewer from 'react-native-file-viewer'
import { when } from 'jest-when'
import * as api from '../api'
import { downloadLetter, getLetterBeneficiaryData, getLetters } from './lettersSlice'

export const ActionTypes: {
  LETTERS_START_GET_LETTERS_LIST: string
  LETTERS_FINISH_GET_LETTERS_LIST: string
  LETTER_START_GET_BENEFICIARY_DATA: string
  LETTER_FINISH_GET_BENEFICIARY_DATA: string
  LETTER_START_DOWNLOAD_LETTER: string
  LETTER_FINISH_DOWNLOAD_LETTER: string
} = {
  LETTERS_START_GET_LETTERS_LIST: 'letters/dispatchStartGetLetters',
  LETTERS_FINISH_GET_LETTERS_LIST: 'letters/dispatchFinishGetLetters',
  LETTER_START_GET_BENEFICIARY_DATA: 'letters/dispatchStartGetLetterBeneficiaryData',
  LETTER_FINISH_GET_BENEFICIARY_DATA: 'letters/dispatchFinishGetLetterBeneficiaryData',
  LETTER_START_DOWNLOAD_LETTER: 'letters/dispatchStartDownloadLetter',
  LETTER_FINISH_DOWNLOAD_LETTER: 'letters/dispatchFinishDownloadLetter',
}

context('letters', () => {
  describe('getLetters', () => {
    it('should get the list of letters', async () => {
      const lettersData: LettersList = [
        {
          name: 'Commissary Letter',
          letterType: 'commissary',
        },
        {
          name: 'Proof of Service Letter',
          letterType: 'proof_of_service',
        },
        {
          name: 'Proof of Creditable Prescription Drug Coverage Letter',
          letterType: 'medicare_partd',
        },
        {
          name: 'Proof of Minimum Essential Coverage Letter',
          letterType: 'minimum_essential_coverage',
        },
        {
          name: 'Service Verification Letter',
          letterType: 'service_verification',
        },
        {
          name: 'Civil Service Preference Letter',
          letterType: 'civil_service',
        },
        {
          name: 'Benefit Summary and Service Verification Letter',
          letterType: 'benefit_summary',
        },
        {
          name: 'Benefit Verification Letter',
          letterType: 'benefit_verification',
        },
      ]

      const lettersPayload = {
        data: {
          attributes: {
            letters: lettersData,
          },
        },
      }

      when(api.get as jest.Mock)
        .calledWith('/v0/letters')
        .mockResolvedValue(lettersPayload)

      const store = realStore()
      await store.dispatch(getLetters())

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.LETTERS_START_GET_LETTERS_LIST })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.LETTERS_FINISH_GET_LETTERS_LIST })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.letters.loading).toBe(false)

      const { letters } = store.getState()
      expect(letters.error).toBeFalsy()
      expect(letters.letters).toEqual([
        {
          name: 'Benefit Summary and Service Verification Letter',
          letterType: 'benefit_summary',
        },
        {
          name: 'Benefit Verification Letter',
          letterType: 'benefit_verification',
        },
        {
          name: 'Civil Service Preference Letter',
          letterType: 'civil_service',
        },
        {
          name: 'Commissary Letter',
          letterType: 'commissary',
        },
        {
          name: 'Proof of Creditable Prescription Drug Coverage Letter',
          letterType: 'medicare_partd',
        },
        {
          name: 'Proof of Minimum Essential Coverage Letter',
          letterType: 'minimum_essential_coverage',
        },
        {
          name: 'Proof of Service Letter',
          letterType: 'proof_of_service',
        },
        {
          name: 'Service Verification Letter',
          letterType: 'service_verification',
        },
      ])
    })
  })

  describe('getLetterBeneficiaryData', () => {
    it('should dispatch the correct actions', async () => {
      const letterBeneficiaryMockData: LetterBeneficiaryData = {
        benefitInformation: {
          awardEffectiveDate: '2013-06-06T04:00:00.000+00:00',
          hasChapter35Eligibility: true,
          monthlyAwardAmount: 123,
          serviceConnectedPercentage: 88,
          hasDeathResultOfDisability: false,
          hasSurvivorsIndemnityCompensationAward: true,
          hasSurvivorsPensionAward: false,
          hasAdaptedHousing: true,
          hasIndividualUnemployabilityGranted: false,
          hasNonServiceConnectedPension: true,
          hasServiceConnectedDisabilities: false,
          hasSpecialMonthlyCompensation: true,
        },
        militaryService: [
          {
            branch: 'Army',
            characterOfService: CharacterOfServiceConstants.HONORABLE,
            enteredDate: '1990-01-01T05:00:00.000+00:00',
            releasedDate: '1993-10-01T04:00:00.000+00:00',
          },
          {
            branch: 'Army',
            characterOfService: CharacterOfServiceConstants.HONORABLE,
            enteredDate: '1996-01-01T05:00:00.000+00:00',
            releasedDate: '1999-10-01T04:00:00.000+00:00',
          },
          {
            branch: 'Army',
            characterOfService: CharacterOfServiceConstants.HONORABLE,
            enteredDate: '1985-01-01T05:00:00.000+00:00',
            releasedDate: '1986-10-01T04:00:00.000+00:00',
          },
          {
            branch: 'Army',
            characterOfService: CharacterOfServiceConstants.HONORABLE,
            enteredDate: '1980-01-01T05:00:00.000+00:00',
            releasedDate: '1981-10-01T04:00:00.000+00:00',
          },
        ],
      }

      const payload: LetterBeneficiaryDataPayload = {
        data: {
          type: 'lettersBenefits',
          id: '123412345',
          attributes: letterBeneficiaryMockData,
        },
      }

      when(api.get as jest.Mock)
        .calledWith('/v0/letters/beneficiary')
        .mockResolvedValue(payload)
      const store = realStore()
      await store.dispatch(getLetterBeneficiaryData())
      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.LETTER_START_GET_BENEFICIARY_DATA })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.LETTER_FINISH_GET_BENEFICIARY_DATA })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.letters.loading).toBe(false)

      const { letterBeneficiaryData, mostRecentServices } = store.getState().letters
      expect(letterBeneficiaryData?.benefitInformation).toEqual(letterBeneficiaryMockData.benefitInformation)
      const mockService = letterBeneficiaryMockData.militaryService
      expect(mostRecentServices).toEqual([mockService[3], mockService[2], mockService[0], mockService[1]])
    })

    it('should get error if it cant get data', async () => {
      const error = new Error('error from backend')

      when(api.get as jest.Mock)
        .calledWith('/v0/letters/beneficiary')
        .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getLetterBeneficiaryData())
      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.LETTER_START_GET_BENEFICIARY_DATA })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.LETTER_FINISH_GET_BENEFICIARY_DATA })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.letters.loading).toBe(false)

      const { letters } = store.getState()
      expect(letters.letterBeneficiaryData).toBeFalsy()
      expect(letters.mostRecentServices).toEqual([])
      expect(letters.error).toEqual(error)
    })
  })

  describe('downloadLetter', () => {
    it('should dispatch the correct actions', async () => {
      const store = realStore()
      await store.dispatch(downloadLetter(LetterTypeConstants.serviceVerification))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.LETTER_START_DOWNLOAD_LETTER })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.LETTER_FINISH_DOWNLOAD_LETTER })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.letters.downloading).toBe(false)
      expect(FileViewer.open).toBeCalledWith('DocumentDir/service_verification.pdf')
    })
  })
})

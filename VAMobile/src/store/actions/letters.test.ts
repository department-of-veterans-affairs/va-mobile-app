import {context, realStore} from "../../testUtils"
import _ from "underscore"
import {getLetterBeneficiaryData, getLetters, downloadLetter} from "./letters"
import {LettersList, LetterTypeConstants} from "../api/types"
import FileViewer from 'react-native-file-viewer'
import {when} from "jest-when";
import * as api from "../api";

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
            letters: lettersData
          }
        }
      }

      when(api.get as jest.Mock)
        .calledWith('/v0/letters')
        .mockResolvedValue(lettersPayload)

      const store = realStore()
      await store.dispatch(getLetters())

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'LETTERS_START_GET_LETTERS_LIST' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'LETTERS_FINISH_GET_LETTERS_LIST' })
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
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      await store.dispatch(getLetterBeneficiaryData())
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'LETTER_START_GET_BENEFICIARY_DATA' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'LETTER_FINISH_GET_BENEFICIARY_DATA' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.letters.loading).toBe(false)
    })
  })

  describe('downloadLetter', () => {
    it('should dispatch the correct actions', async () => {
      const store = realStore()
      await store.dispatch(downloadLetter(LetterTypeConstants.serviceVerification))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'LETTER_START_DOWNLOAD_LETTER' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'LETTER_FINISH_DOWNLOAD_LETTER' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.letters.downloading).toBe(false)
      expect(FileViewer.open).toBeCalledWith('DocumentDir/service_verification.pdf')
    })
  })
})

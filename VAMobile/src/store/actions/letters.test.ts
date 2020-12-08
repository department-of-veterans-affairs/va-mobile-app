import {context, realStore} from "../../testUtils"
import _ from "underscore"
import {getLetterBeneficiaryData, getLetters, downloadLetter} from "./letters"
import { LetterTypeConstants } from "../api/types"
import FileViewer from 'react-native-file-viewer'

context('letters', () => {
  describe('getLetters', () => {
    it('should dispatch the correct actions', async () => {
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      await store.dispatch(getLetters())

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'LETTERS_START_GET_LETTERS_LIST' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'LETTERS_FINISH_GET_LETTERS_LIST' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.letters.loading).toBe(false)

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
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

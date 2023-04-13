import { when } from 'jest-when'
import _ from 'underscore'
import FileViewer from 'react-native-file-viewer'

import * as api from '../api'
import { context, realStore } from 'testUtils'
import { downloadDecisionLetter, getDecisionLetters } from './decisionLettersSlice'
import { DecisionLettersGetData } from 'store/api'
import { SnackbarMessages } from 'components/SnackBar'

const snackbarMessages: SnackbarMessages = {
  successMsg: '',
  errorMsg: 'Your claim letter could not be downloaded.',
}

const decisionLettersPayload: DecisionLettersGetData = {
  data: [
    {
      id: '{87B6DE5D-CD79-4D15-B6DC-A5F9A324DC4F}',
      type: 'decisionLetter',
      attributes: {
        seriesId: '{EC1B5F0C-E3FB-4A41-B93F-E1A88D549CCA}',
        version: '1',
        typeDescription: 'Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
        typeId: '184',
        docType: '184',
        subject: undefined,
        receivedAt: '2023-03-11',
        source: 'VBMS',
        mimeType: 'application/pdf',
        altDocTypes: '',
        restricted: false,
        uploadDate: '2023-03-12',
      },
    },
  ],
}

context('decisionLetters', () => {
  describe('getDecisionLetters', () => {
    it('should get the list of decision letters', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/claims/decision-letters')
        .mockResolvedValue(decisionLettersPayload)

      const store = realStore()
      await store.dispatch(getDecisionLetters())

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'decisionLetters/dispatchStartGetDecisionLetters' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'decisionLetters/dispatchFinishGetDecisionLetters' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.letters.loading).toBe(false)

      const { decisionLetters } = store.getState()
      expect(decisionLetters.error).toBeFalsy()
      expect(decisionLetters.decisionLetters).toEqual(decisionLettersPayload.data)
    })
  })

  describe('downloadDecisionLetter', () => {
    it('should dispatch the correct actions', async () => {
      const store = realStore()
      await store.dispatch(downloadDecisionLetter('abc123', snackbarMessages))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'decisionLetters/dispatchStartDownloadDecisionLetter' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'decisionLetters/dispatchFinishDownloadDecisionLetter' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.decisionLetters.downloading).toBe(false)
      expect(FileViewer.open).toBeCalledWith('DocumentDir/decision_letter.pdf')
    })
  })
})

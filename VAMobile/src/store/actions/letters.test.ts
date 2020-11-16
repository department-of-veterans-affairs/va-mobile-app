import {context, realStore} from "../../testUtils";
import {updateEmail} from "./personalInformation";
import _ from "underscore";
import {getLetters} from "./letters";


context('letters', () => {
  describe('getLetters', () => {
    it('should dispatch the correct actions', async () => {
      // TODO: add more tests when using the api instead of mocked data
      // TODO remove once endpoint is integrated
      jest.useFakeTimers()
      const store = realStore()
      await store.dispatch(getLetters())

      // TODO remove once endpoint is integrated
      jest.runAllTimers()

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
})

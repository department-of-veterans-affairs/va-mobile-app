import { context, realStore } from 'testUtils'
import { finishEditBankInfo, getBankData, updateBankInfo } from './directDeposit'
import { find } from 'underscore'
import { AccountTypes } from '../api/types'

context('directDeposit', () => {
  describe('getBankData', () => {
    it('should get the users bank data', () => {
      const store = realStore()
      store.dispatch(getBankData())

      const actions = store.getActions()

      const startAction = find(actions, { type: 'DIRECT_DEPOSIT_START_GET_BANK_DATA' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.loading).toBeTruthy()

      const finishAction = find(actions, { type: 'DIRECT_DEPOSIT_FINISH_GET_BANK_DATA' })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.directDeposit.loading).toBeFalsy()

      expect(store.getState().directDeposit.paymentAccount).toEqual({
        accountNumber: '*************1234',
        accountType: 'Savings account',
        financialInstitutionName: 'Bank of America',
        financialInstitutionRoutingNumber: '948529982',
      })
    })
  })

  describe('updateBankInfo', () => {
    it('should update bankInfo', () => {
      const store = realStore()
      store.dispatch(updateBankInfo('12345678912345678', '987654321', 'Savings'))

      const actions = store.getActions()

      const startAction = find(actions, { type: 'DIRECT_DEPOSIT_START_SAVE_BANK_INFO' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.loading).toBeTruthy()

      const finishAction = find(actions, { type: 'DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO' })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.directDeposit.loading).toBeFalsy()

      const { directDeposit } = store.getState()
      expect(directDeposit.paymentAccount).toEqual({
        accountNumber: '12345678912345678',
        accountType: 'Savings account',
        financialInstitutionName: undefined,
        financialInstitutionRoutingNumber: '987654321',
      })
      expect(directDeposit.error).toBeFalsy()
    })
  })

  describe('finishEditBankInfo', () => {
    it('should dispatch DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO', () => {
      const store = realStore()
      store.dispatch(finishEditBankInfo())

      const actions = store.getActions()

      const finishAction = find(actions, { type: 'DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO' })
      expect(finishAction).toBeTruthy()
    })
  })
})

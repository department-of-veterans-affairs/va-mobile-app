import { context, realStore, when } from 'testUtils'
import * as api from '../api'
import { APIError, DirectDepositData } from '../api'
import { finishEditBankInfo, getBankData, updateBankInfo } from './directDepositSlice'
import { find } from 'underscore'
import { DirectDepositErrors } from 'constants/errors'
import { SnackbarMessages } from 'components/SnackBar'

export const ActionTypes: {
  DIRECT_DEPOSIT_START_SAVE_BANK_INFO: string
  DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO: string
  DIRECT_DEPOSIT_START_GET_BANK_DATA: string
  DIRECT_DEPOSIT_FINISH_GET_BANK_DATA: string
  DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO: string
  ERRORS_SET_ERROR: string
} = {
  DIRECT_DEPOSIT_START_SAVE_BANK_INFO: 'directDeposit/dispatchStartSaveBankInfo',
  DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO: 'directDeposit/dispatchFinishSaveBankInfo',
  DIRECT_DEPOSIT_START_GET_BANK_DATA: 'directDeposit/dispatchStartGetBankInfo',
  DIRECT_DEPOSIT_FINISH_GET_BANK_DATA: 'directDeposit/dispatchFinishGetBankInfo',
  DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO: 'directDeposit/dispatchFinishEditBankInfo',
  ERRORS_SET_ERROR: 'error/dispatchSetError',
}

const snackbarMessages: SnackbarMessages = { errorMsg: 'Direct deposit information could not be saved', successMsg: 'Direct deposit information saved' }

context('directDeposit', () => {
  describe('getBankData', () => {
    it('should get the users bank data', async () => {
      const mockBankInfoPayload: DirectDepositData = {
        data: {
          type: 'paymentInformation',
          id: '75fbb2a6-6c7e-5003-95dc-a950697f4937',
          attributes: {
            paymentAccount: {
              accountNumber: '*************1234',
              accountType: 'Savings',
              financialInstitutionName: 'Bank',
              financialInstitutionRoutingNumber: '04120282',
            },
          },
        },
      }

      when(api.get as jest.Mock)
        .calledWith('/v0/payment-information/benefits')
        .mockResolvedValue(mockBankInfoPayload)

      const store = realStore()
      await store.dispatch(getBankData())
      const actions = store.getActions()

      const startAction = find(actions, { type: ActionTypes.DIRECT_DEPOSIT_START_GET_BANK_DATA })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.loading).toBeTruthy()

      const finishAction = find(actions, { type: ActionTypes.DIRECT_DEPOSIT_FINISH_GET_BANK_DATA })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.directDeposit.loading).toBeFalsy()

      expect(store.getState().directDeposit.paymentAccount).toEqual({
        accountNumber: '*************1234',
        accountType: 'Savings',
        financialInstitutionName: 'Bank',
        financialInstitutionRoutingNumber: '04120282',
      })
    })

    it('should get error if it cannot get data', async () => {
      const error = new Error('error from backend')

      when(api.get as jest.Mock)
        .calledWith('/v0/payment-information/benefits')
        .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getBankData())
      const actions = store.getActions()

      const startAction = find(actions, { type: ActionTypes.DIRECT_DEPOSIT_START_GET_BANK_DATA })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.loading).toBeTruthy()

      const finishAction = find(actions, { type: ActionTypes.DIRECT_DEPOSIT_FINISH_GET_BANK_DATA })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.directDeposit.loading).toBeFalsy()

      const { directDeposit } = store.getState()
      expect(directDeposit.paymentAccount).toEqual({})
      expect(directDeposit.error).toEqual(error)
    })
  })

  describe('updateBankInfo', () => {
    it('should update bankInfo', async () => {
      const mockBankInfoPayload: DirectDepositData = {
        data: {
          type: 'paymentInformation',
          id: '75fbb2a6-6c7e-5003-95dc-a950697f4937',
          attributes: {
            paymentAccount: {
              accountNumber: '*************5678',
              accountType: 'Savings',
              financialInstitutionName: 'Bank',
              financialInstitutionRoutingNumber: '987654321',
            },
          },
        },
      }

      const updateBankInfoData: api.PaymentAccountData = {
        accountNumber: '12345678912345678',
        accountType: 'Savings',
        financialInstitutionRoutingNumber: '987654321',
        financialInstitutionName: 'Bank', // api requires a
      }

      when(api.put as jest.Mock)
        .calledWith('/v0/payment-information/benefits', updateBankInfoData)
        .mockResolvedValue(mockBankInfoPayload)

      const store = realStore()
      await store.dispatch(updateBankInfo(updateBankInfoData.accountNumber, updateBankInfoData.financialInstitutionRoutingNumber, updateBankInfoData.accountType, snackbarMessages))

      const actions = store.getActions()

      const startAction = find(actions, { type: ActionTypes.DIRECT_DEPOSIT_START_SAVE_BANK_INFO })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.saving).toBeTruthy()

      const finishAction = find(actions, { type: ActionTypes.DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.directDeposit.saving).toBeFalsy()

      const { directDeposit } = store.getState()
      expect(directDeposit.paymentAccount).toEqual(mockBankInfoPayload.data.attributes.paymentAccount)
      expect(directDeposit.error).toBeFalsy()
    })

    it('should get error if it cannot update data', async () => {
      const error = new Error('error from backend')

      const updateBankInfoData: api.PaymentAccountData = {
        accountNumber: '12345678912345678',
        accountType: 'Savings',
        financialInstitutionRoutingNumber: '987654321',
        financialInstitutionName: 'Bank', // api requires a
      }

      when(api.put as jest.Mock)
        .calledWith('/v0/payment-information/benefits', updateBankInfoData)
        .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(updateBankInfo(updateBankInfoData.accountNumber, updateBankInfoData.financialInstitutionRoutingNumber, updateBankInfoData.accountType, snackbarMessages))

      const actions = store.getActions()

      const startAction = find(actions, { type: ActionTypes.DIRECT_DEPOSIT_START_SAVE_BANK_INFO })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.saving).toBeTruthy()

      const finishAction = find(actions, { type: ActionTypes.DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.directDeposit.saving).toBeFalsy()

      const { directDeposit } = store.getState()
      expect(directDeposit.paymentAccount).toEqual({})
      expect(directDeposit.error).toEqual(error)
    })

    it('should set invalidRoutingNumberError upon submitting an invalid routing number', async () => {
      const invalidRoutingNumberError: APIError = {
        json: {
          errors: [
            {
              title: 'title',
              detail: 'detail',
              code: 'code',
              source: 'source',
              meta: {
                messages: [
                  {
                    key: DirectDepositErrors.INVALID_ROUTING_NUMBER,
                    severity: 'severity',
                    text: 'text',
                  },
                ],
              },
            },
          ],
        },
      }

      const updateBankInfoData: api.PaymentAccountData = {
        accountNumber: '12345678912345678',
        accountType: 'Savings',
        financialInstitutionRoutingNumber: '987654321',
        financialInstitutionName: 'Bank',
      }

      when(api.put as jest.Mock)
        .calledWith('/v0/payment-information/benefits', updateBankInfoData)
        .mockRejectedValue(invalidRoutingNumberError)

      const store = realStore()
      await store.dispatch(updateBankInfo(updateBankInfoData.accountNumber, updateBankInfoData.financialInstitutionRoutingNumber, updateBankInfoData.accountType, snackbarMessages))

      const actions = store.getActions()

      // if invalidRoutingNumberError occurs, we expect to not set a common error
      const commonErrorAction = find(actions, { type: ActionTypes.ERRORS_SET_ERROR })
      expect(commonErrorAction).toBeFalsy()

      const { directDeposit } = store.getState()
      expect(directDeposit.invalidRoutingNumberError).toBeTruthy()
    })
  })

  describe('finishEditBankInfo', () => {
    it('should dispatch DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO', () => {
      const store = realStore()
      store.dispatch(finishEditBankInfo())

      const actions = store.getActions()

      const finishAction = find(actions, { type: ActionTypes.DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO })
      expect(finishAction).toBeTruthy()
    })
  })
})

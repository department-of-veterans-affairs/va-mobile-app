import { context, realStore } from 'testUtils'
import { finishEditBankInfo, getBankData, updateBankInfo } from './directDeposit'
import { find } from 'underscore'
import { DirectDepositData } from '../api/types'
import { when } from "jest-when";
import * as api from "../api";

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
              financialInstitutionRoutingNumber: '04120282'
            }
          }
        }
      }

      when(api.get as jest.Mock)
          .calledWith('/v0/payment-information/benefits')
          .mockResolvedValue(mockBankInfoPayload)

      const store = realStore()
      await store.dispatch(getBankData())
      const actions = store.getActions()

      const startAction = find(actions, { type: 'DIRECT_DEPOSIT_START_GET_BANK_DATA' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.loading).toBeTruthy()

      const finishAction = find(actions, { type: 'DIRECT_DEPOSIT_FINISH_GET_BANK_DATA' })
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

      const startAction = find(actions, { type: 'DIRECT_DEPOSIT_START_GET_BANK_DATA' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.loading).toBeTruthy()

      const finishAction = find(actions, { type: 'DIRECT_DEPOSIT_FINISH_GET_BANK_DATA' })
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
              financialInstitutionRoutingNumber: '987654321'
            }
          }
        }
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
      await store.dispatch(updateBankInfo(updateBankInfoData.accountNumber, updateBankInfoData.financialInstitutionRoutingNumber, updateBankInfoData.accountType))

      const actions = store.getActions()

      const startAction = find(actions, { type: 'DIRECT_DEPOSIT_START_SAVE_BANK_INFO' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.loading).toBeTruthy()

      const finishAction = find(actions, { type: 'DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO' })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.directDeposit.loading).toBeFalsy()

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
      await store.dispatch(updateBankInfo(updateBankInfoData.accountNumber, updateBankInfoData.financialInstitutionRoutingNumber, updateBankInfoData.accountType))

      const actions = store.getActions()

      const startAction = find(actions, { type: 'DIRECT_DEPOSIT_START_SAVE_BANK_INFO' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.directDeposit.loading).toBeTruthy()

      const finishAction = find(actions, { type: 'DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO' })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.directDeposit.loading).toBeFalsy()

      const { directDeposit } = store.getState()
      expect(directDeposit.paymentAccount).toEqual({})
      expect(directDeposit.error).toEqual(error)
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

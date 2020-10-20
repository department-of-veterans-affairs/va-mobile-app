import { context, realStore } from 'testUtils'
import { getBankData } from './directDeposit'

context('directDeposit', () => {
  describe('getBankData', () => {
    it('should get the users bank data', () => {
      const store = realStore()
      store.dispatch(getBankData())

      expect(store.getState().directDeposit.bankData).toEqual({
        bank_name: 'Bank of America',
        bank_account_number: '1234',
        bank_account_type: 'Savings',
      })
    })
  })
})

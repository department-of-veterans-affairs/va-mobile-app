/**
 * constant to mock the return data for any of the profile updates
 */
export const MOCK_EDIT_RESPONSE = {
  data: {
    attributes: {
      id: 'mock_id',
      type: 'mock_type',
      attributes: {
        transactionId: 'mock_transaction',
        transactionStatus: 'great!',
        type: 'success',
        metadata: [
          {
            code: '42',
            key: 'TSTLTUAE',
            retryable: 'no',
            severity: 'none',
            text: 'great job team',
          },
        ],
      },
    },
  },
}

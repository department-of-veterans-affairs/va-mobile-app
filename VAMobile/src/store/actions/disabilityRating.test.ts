import _ from "underscore";

import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import { getDisabilityRating } from "./disabilityRating";

const url: string = '/v0/disability-rating'
const startActionName = 'DISABILITY_RATING_START_GET_RATING'
const endActionName = 'DISABILITY_RATING_FINISH_GET_RATING' 

context('disabilityRating', () => {
    describe('getDisabilityRating', () => {
        it('should get users disability ratings data', async () => {
            const mockDisabilityPayload : api.DisabilityRatingData = {
                data: {
                    type: "disabilityRating",
                    id: "0",
                    attributes: {
                        combinedDisabilityRating: 70,
                        combinedEffectiveDate: "2013-08-09T00:00:00.000+00:00",
                        legalEffectiveDate: "2013-08-09T00:00:00.000+00:00",
                        individualRatings: [
                            {
                                decision: "Service Connected",
                                effectiveDate: "2012-12-01T00:00:00.000+00:00",
                                ratingPercentage: 50,
                                diagnosticText: "PTSD",
                                type: "Post traumatic stress disorder",
                            },
                            {
                                decision: "Service Connected",
                                effectiveDate: "2013-08-09T00:00:00.000+00:00",
                                ratingPercentage: 30,
                                diagnosticText: "headaches, migraine",
                                type: "Migraine" 
                            }
                        ]
                    }
                }
            }

            when(api.get as jest.Mock).calledWith(url).mockResolvedValue(mockDisabilityPayload)

            const store = realStore()
            await store.dispatch(getDisabilityRating())
            const actions = store.getActions()

            const startAction = _.find(actions, { type: startActionName })
            expect(startAction).toBeTruthy()
            expect(startAction?.state.disabilityRating.loading).toBeTruthy()

            const endAction = _.find(actions, { type: endActionName })
            expect(endAction?.state.disabilityRating.loading).toBeFalsy()
            expect(endAction?.state.disabilityRating.error).toBeFalsy()

            const { disabilityRating } = store.getState()
            expect(disabilityRating.ratingData).toEqual(mockDisabilityPayload.data.attributes)
            expect(disabilityRating.error).toBeFalsy()
        })

        it('should get error if it cant get data', async () => {
            const error = new Error('error from backend')
      
            when(api.get as jest.Mock)
                .calledWith(url)
                .mockResolvedValue(Promise.reject(error))
      
            const store = realStore()
            await store.dispatch(getDisabilityRating())
            const actions = store.getActions()
      
            const startAction = _.find(actions, { type: startActionName })
            expect(startAction).toBeTruthy()
            expect(startAction?.state.disabilityRating.loading).toBeTruthy()
      
            const endAction = _.find(actions, { type: endActionName})
            expect(endAction?.state.disabilityRating.loading).toBeFalsy()
            expect(endAction?.state.disabilityRating.error).toBeTruthy()
      
            const { disabilityRating } = store.getState()
            expect(disabilityRating.ratingData).toEqual(undefined)
            expect(disabilityRating.error).toEqual(error)
          })
    })

})
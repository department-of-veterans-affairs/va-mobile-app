import {goBackToPreviousScreen, tabTo} from '../utils'
import ClaimsScreen from '../screenObjects/claims.screen'
import ClaimsActiveScreen from '../screenObjects/activeClaims.screen'
import ClaimsClosedScreen from '../screenObjects/closedClaims.screen'
import ClaimsDetailsScreen from '../screenObjects/claimDetail.screen'
import ClaimsDetailsStatusScreen from '../screenObjects/claimDetailStatus.screen'
import ConsolidatedClaimsNoteScreen from '../screenObjects/consolidatedClaimsNote.screen'
import WhatDoIDoIfDisagreementScreen from '../screenObjects/whatDoIDoIfDisagreement.screen'
import ClaimsDetailsInfoScreen from '../screenObjects/claimDetailInfo.screen'

export default () => {
  before(async () => {
    await tabTo('Claims')
    await ClaimsScreen.waitForIsShown()
  })

  it('should render its content', async () => {
    const claimsActiveTab = await ClaimsScreen.claimsActiveTab
    await expect(claimsActiveTab.isExisting()).resolves.toEqual(true)

    const claimsClosedTab = await ClaimsScreen.claimsClosedTab
    await expect(claimsClosedTab.isExisting()).resolves.toEqual(true)
  })

  describe('Active Claims', () => {
    describe('on click of the active tab', () => {
      before(async() => {
        const claimsActiveTab = await ClaimsScreen.claimsActiveTab
        await claimsActiveTab.click()
      })

      it('should render the Active Claims screen', async () => {
        await ClaimsActiveScreen.waitForIsShown()
      })

      describe('on click of a claim', () => {
        before(async () => {
          await ClaimsActiveScreen.waitForIsShown()
          const claimGivenID = await ClaimsActiveScreen.getClaimGivenA11yLabel('~claim-for-compensation-updated-on-december-07,-2020-submitted-june-11,-2020')
          await claimGivenID.click()
        })

        after(async () => {
          await goBackToPreviousScreen()
          await ClaimsActiveScreen.waitForIsShown()
        })

        it('should render the claim details page', async () => {
          await ClaimsDetailsScreen.waitForIsShown()
        })

        describe('on click of the status tab', () => {
          before(async () => {
            await ClaimsDetailsScreen.waitForIsShown()
            const statusTab = await ClaimsDetailsScreen.statusTab
            await statusTab.click()
          })

          it('should render the claim details status screen', async () => {
            await ClaimsDetailsStatusScreen.waitForIsShown()
          })

          describe('on click of the "find out why we sometimes combine claims" list item', () => {
            before(async () => {
              await ClaimsDetailsStatusScreen.waitForIsShown()
              const findOutButton = await ClaimsDetailsStatusScreen.findOutButton
              await findOutButton.click()
            })

            after(async () => {
              await goBackToPreviousScreen()
              await ClaimsDetailsStatusScreen.waitForIsShown()
            })

            it('should render the Consolidated Claims Note screen', async () => {
              await ConsolidatedClaimsNoteScreen.waitForIsShown()
            })
          })

          describe('on click of the "what should I do if I disagree" list item', () => {
            before(async () => {
              await ClaimsDetailsStatusScreen.waitForIsShown()
              const whatShouldIDoButton = await ClaimsDetailsStatusScreen.whatShouldIDoButton
              await whatShouldIDoButton.click()
            })

            after(async () => {
              await goBackToPreviousScreen()
              await ClaimsDetailsStatusScreen.waitForIsShown()
            })

            it('should render the What Do I Do If Disagreement screen', async () => {
              await WhatDoIDoIfDisagreementScreen.waitForIsShown()
            })
          })
        })

        describe('on click of the details tab', () => {
          before(async () => {
            await ClaimsDetailsScreen.waitForIsShown()
            const detailsTab = await ClaimsDetailsScreen.detailsTab
            await detailsTab.click()
          })

          it('should render the claim details info screen', async () => {
            await ClaimsDetailsInfoScreen.waitForIsShown()
          })
        })
      })
    })
  })

  describe('Closed Claims', () => {
    describe('on click of the closed tab', () => {
      before(async() => {
        const claimsClosedTab = await ClaimsScreen.claimsClosedTab
        await claimsClosedTab.click()
      })

      it('should render the Closed Claims screen', async () => {
        await ClaimsClosedScreen.waitForIsShown()
      })
    })
  })
}

import {androidScrollToElementWithText, goBackToPreviousScreen, tabTo, waitForIsShown} from '../utils'
import ClaimsScreen from '../screenObjects/claims.screen'
import ClaimsActiveScreen from '../screenObjects/activeClaims.screen'
import ClaimsClosedScreen from '../screenObjects/closedClaims.screen'
import ClaimsDetailsScreen from '../screenObjects/claimDetail.screen'
import ClaimsDetailsStatusScreen from '../screenObjects/claimDetailStatus.screen'
import ConsolidatedClaimsNoteScreen from '../screenObjects/consolidatedClaimsNote.screen'
import WhatDoIDoIfDisagreementScreen from '../screenObjects/whatDoIDoIfDisagreement.screen'
import ClaimDetailsInfoScreen from '../screenObjects/claimDetailInfo.screen'
import AppealDetailsScreen from '../screenObjects/appealDetail.screen'

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

  describe('Active Claims and Appeals', () => {
    describe('on click of the active tab', () => {
      before(async() => {
        const claimsActiveTab = await ClaimsScreen.claimsActiveTab
        await claimsActiveTab.click()
      })

      // TODO User does not have active claims
      it('should render the Active Claims and Appeals screen', async () => {
        await ClaimsActiveScreen.waitForIsShown()
      })


      // TODO user currently does not have any appeal
      xit('should render no active claim and appeals page', async () => {
        await waitForIsShown(ClaimsActiveScreen.NoClaimsAndAppeals)
      })

      // TODO User does not have any appeals
      xdescribe('on click of an appeal', () => {
        before(async () => {
          await ClaimsActiveScreen.waitForIsShown()
          const appealGivenID = await ClaimsActiveScreen.getClaimOrAppealGivenA11yLabel('~compensation-appeal-updated-on-october-28,-2020-submitted-october-22,-2020')
          await appealGivenID.click()
        })

        after(async () => {
          await goBackToPreviousScreen()
          await ClaimsActiveScreen.waitForIsShown()
        })

        it('should render the appeal details page', async () => {
          await AppealDetailsScreen.waitForIsShown()
        })
      })

      describe('on click of a claim', () => {
        before(async () => {
          await ClaimsActiveScreen.waitForIsShown()
          const claimGivenID = await ClaimsActiveScreen.getClaimOrAppealGivenA11yLabel('~Claim for ebenefits bdd updated on January 25, 2021 Submitted May 02, 2021')

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

          after(async () => {
            if (driver.isAndroid) {
              await androidScrollToElementWithText('Status')
            }
          })

          it('should render the claim details status screen', async () => {
            await ClaimsDetailsStatusScreen.waitForIsShown()
          })

          describe('on click of the "find out why we sometimes combine claims" list item', () => {
            before(async () => {
              await ClaimsDetailsStatusScreen.waitForIsShown()

              if (driver.isAndroid) {
                await androidScrollToElementWithText('Find out why we sometimes combine claims.')
              }

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
            await ClaimDetailsInfoScreen.waitForIsShown()
          })
        })
      })
    })
  })

  describe('Closed Claims And Appeals', () => {
    describe('on click of the closed tab', () => {
      before(async() => {
        const claimsClosedTab = await ClaimsScreen.claimsClosedTab
        await claimsClosedTab.click()
      })

      it('should render the Closed Claims and Appeals screen', async () => {
        await ClaimsClosedScreen.waitForIsShown()
      })

      xit('should render no closed claim and appeals page', async () => {
        await waitForIsShown(ClaimsClosedScreen.NoClaimsAndAppeals)
      })
    })
  })
}

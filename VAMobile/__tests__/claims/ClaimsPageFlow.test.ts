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
import FileUploadScreen from '../screenObjects/fileUpload.screen'
import AskForClaimDecisionScreen from '../screenObjects/askForClaimDecision.screen'

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
      xit('should render the Active Claims and Appeals screen', async () => {
        await ClaimsActiveScreen.waitForIsShown()
      })


      // TODO user currently does not have any appeal
      it('should render no active claim and appeals page', async () => {
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

      // TODO User does not have any claims
      xdescribe('on click of a claim', () => {
        before(async () => {
          await ClaimsActiveScreen.waitForIsShown()
          const claimGivenID = await ClaimsActiveScreen.getClaimOrAppealGivenA11yLabel('~claim-for-compensation-updated-on-december-07,-2020-submitted-june-11,-2020')
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

          describe('on click of the view file requests button', () => {
            before(async () => {
              await ClaimsDetailsStatusScreen.waitForIsShown()

              if (driver.isAndroid) {
                await androidScrollToElementWithText('View File Requests')
              }

              const viewFileRequestsButton = await ClaimsDetailsStatusScreen.viewFileRequestsButton
              await viewFileRequestsButton.click()
            })

            after(async () => {
              await goBackToPreviousScreen()
              await ClaimsDetailsStatusScreen.waitForIsShown()
            })

            it('should render the file upload screen', async () => {
              await FileUploadScreen.waitForIsShown()
            })

            describe('on click of the view details button', () => {
              before(async () => {
                await FileUploadScreen.waitForIsShown()

                if (driver.isAndroid) {
                  await androidScrollToElementWithText('View details')
                }

                const viewDetailsButton = await FileUploadScreen.viewDetailsButton
                await viewDetailsButton.click()
              })

              after(async () => {
                await goBackToPreviousScreen()
                await FileUploadScreen.waitForIsShown()
              })

              it('should render the ask for your claim decision screen', async () => {
                await AskForClaimDecisionScreen.waitForIsShown()
              })
            })
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

      // TODO User does not have closed claims
      xit('should render the Closed Claims and Appeals screen', async () => {
        await ClaimsClosedScreen.waitForIsShown()
      })

      it('should render no closed claim and appeals page', async () => {
        await waitForIsShown(ClaimsClosedScreen.NoClaimsAndAppeals)
      })
    })
  })
}

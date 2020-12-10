import {tabTo} from '../utils'
import ClaimsScreen from '../screenObjects/claims.screen'
import ClaimsActiveScreen from '../screenObjects/activeClaims.screen'
import ClaimsClosedScreen from '../screenObjects/closedClaims.screen'

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

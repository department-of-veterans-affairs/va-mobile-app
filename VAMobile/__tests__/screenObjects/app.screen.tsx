import { DEFAULT_TIMEOUT } from '../utils'

export default class AppScreen {
	constructor (selector:string) {
		this.selector = selector;
	}

	selector:string;

	async waitForIsShown (isShown = true):Promise<any> {
		let el = await $(this.selector)
		return el.waitForDisplayed({
			timeout: DEFAULT_TIMEOUT,
			reverse: !isShown,
		})
	}

	async isShown ():Promise<any> {
		let el = await $(this.selector)
		return el.isDisplayed()
	}
}

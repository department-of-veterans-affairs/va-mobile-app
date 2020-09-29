declare namespace WebdriverIO {
    // adding command to `$()`
    interface Element {
        // don't forget to wrap return values with Promise
        elementCustomCommand: (arg:any) => Promise<number>
    }
}

declare module "@env" {
	export const AUTH_CLIENT_ID:string
	export const AUTH_CLIENT_SECRET:string
	export const AUTH_ENDPOINT:string
	export const AUTH_REDIRECT_URL:string
	export const AUTH_REVOKE_URL:string
	export const AUTH_SCOPES:string
	export const AUTH_TOKEN_EXCHANGE_URL:string
}

declare var mockStore:any

declare module "*.svg" {
	import { SvgProps } from "react-native-svg";
	const content: React.FC<SvgProps>;
	export default content;
}
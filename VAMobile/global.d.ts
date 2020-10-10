declare namespace WebdriverIO {
	// adding command to `$()`
	interface Element {
		// don't forget to wrap return values with Promise
		elementCustomCommand: (arg: any) => Promise<number>
	}
}

declare module "@env" {
}

declare var mockStore: any

declare module "*.svg" {
	import { SvgProps } from "react-native-svg";
	const content: React.FC<
		SvgProps & {
			fillSecondary?: string;
		}
	>;
	export default content;
}

# Versioning Policy
The VA Mobile Libraries use [semantic versioning](https://semver.org/) at a per package level.

---
**Guidance in this section to be retired at version 1.0.0**

Despite technically being in production, the design system is still in early, rapidly iterative phases. With only the VA Health & Benefits app leveraging and close team contact, through at least Q1 2024 we plan to use a pre-launch versioning (major version 0) as follows:
- Version 0.1.0 will be a level set of the package highlighting it's in a workable state with baseline functionality that has been proven consumable by an outside project
	- For components:  Segmented Control ready to use
	- For tokens: Baseline set of color tokens available
	- For other packages: When the package has a core piece of functionality and is stably leveraged by an outside project
- Any/all breaking changes will be minor version increments with tickets created for the VA Flagship Mobile Team providing specific guidance of necessary adjustments
- Aside from breaking changes, semver is updated according to long term guidance below

This policy will allow flexibility around anticipated growing pains that may entail more frequent breaking changes than more mature design systems. Once initial adoption challenges have been addressed and the packages have reached a degree of maturity in terms of content, version 1.0.0 will be published and follow the guidelines established below.

---

The guidance around versioning for the VA Mobile Libraries shall be as follows:
- Major
  - Breaking changes, large or small, that *may* require app-level changes to upgrade; examples:
	  - Non-backwards compatible update to an existing component property; e.g. renaming or restructuring how data is passed
	  - Removal of deprecated token(s)/component(s)/etc.
  - Underlying dependency update introducing incompatibility; e.g. new version of `react-native` that breaks compatibility to app-level version
  - In exceptional cases, may be incremented for a very significant package enhancement or totality of modest ones that comprise a bonafide "release" even without breaking changes
 - Minor
	 - Substantive functionality enhancements that are fully backward compatible, examples:
		 - New token(s)/component(s)/etc.
		 - Enhancing a component with a new variant
 - Patch
	 - Minor functionality enhancements that are fully backward compatible, examples:
		 - Adding a new property of minor impact
		 - Updating an existing component property with new values that have a minor impact
		 - Fixing internal bugs
 - Beta
	 - External team testing build denoted by a `-beta.#` appended to the semver
	 - Should not be used in production outside exceptional circumstances
  - Alpha
	 - Internal design system team testing build denoted by a `-alpha.#` appended to the semver
	 - Should not be used in production

The Figma Design Library will also follow this versioning guidance except only reflecting major/minor levels. Patch changes are likely to result in no visual changes or the design was correct while minor technical tweaks were made.

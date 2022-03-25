# Unit Tests

## Frameworks

Our tests primarily use [Jest](https://jestjs.io/) and [React Test Renderer](https://reactjs.org/docs/test-renderer.html)

## What to Test

All React components including common components and screens should have an associated unit test. The test should cover the visible effects of logic within the component as well as any output from the component passed through events like buttons where possible.
Examples of this include:
- Verifying expected results when pressing a button including showing/hiding elements or calling actions
- Verifying props are having the expected effect within the component
- Error states displaying as expected
- Edge cases that may not be noticed in day to day development or regular QA cycles
- Validation on forms

### What Not To Test

- Interactions with or effects within other components or screens that require pulling in those screens or components.
- The actions being called (such as API calls), it should only be testing that the actions are called with the correct parameters. These actions should be tested in their own set of unit tests.
- Functionality of third party libraries that the component is not directly responsible for. These should be mocked appropriately to isolate the test to logic within the component.

## Test Files

The test file should live in the same location as its associated component with the same file name with .test included after the component name.

`ClaimsScreen.tsx` will have a test file named `ClaimsScreen.test.tsx`

## Running Tests
- Run unit tests with `yarn test`
- Coverage can be found under `coverage/lcov-report/index.html`

## Test Structure

Unit tests are structured into `context`, `describe`, and `it` functions that provide context to the tests as they are run. These are presented as a readable heirarchy, making it easy to follow the output of the tests and identify where failing tests are and what they were testing.

```tsx
context('MyScreen', () => {
  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      // testing
    })

    it('should not show a menu', async () => {
      // testing
    })
  })
})
```

The `context` is typically the name of the component or screen, the primary identifier of what this file is testing. `describe` provides a specific circumstance or set of properties. `it` explains exactly what is being tested. A `context` can have as many `describe` or `it` functions as is necessary to describe the flow of the test.

## Mocking

Components often interact with other pieces of code that are not the responsibility of that unit test, but rely on them to function. To handle these cases, we use mocks to guarantee inputs and outputs of things like navigation actions, API calls, external libraries, hooks, or anything else the component might need but does not control the logic of.

Mocking libraries and functions are done through [jest mocks](https://jestjs.io/docs/mock-functions). Global mocks can be found at `jest/testSetup.ts` but can be overridden within the individual test files.

### Mocking Hooks

One of the most commonly mocked parts of the app are hooks related to things like navigation, theme, and alerts. This is done by creating a spy object at the top of the file that will then be set in the jest mocks to allow it to be used within the tests.

```tsx
let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})
```

This block of code will mock the entirety of the hooks util file using the original implementations except for the useRouteNavigation hook, which is instead returning a spy object that the unit test can use to verify it was called with the correct arguments.

```tsx
navigateToPaymentMissingSpy = jest.fn()

when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('PaymentMissing')
      .mockReturnValue(navigateToPaymentMissingSpy)
```

This will create another object  `navigateToPaymentMissingSpy` that will be returned if the hook is called with the parameters `'PaymentMissing'`

```tsx
// Do something that will trigger a navigation to the PaymentMissing screen
expect(navigateToPaymentMissingSpy).toHaveBeenCalled()
```

### Mocking API Calls

Components will often make API calls which can be mocked via the redux actions that call them.

```tsx
import { downloadLetter } from 'store/slices'

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    downloadLetter: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})
```

This imports the `downloadLetter` action from the letters slice responsible for handling downloading letters and mocks it to do nothing. This will let the unit test validate it has been called without the test itself trying to actually download anything.

```tsx
// Do something that triggers downloading of a letter with some set of options

const letterOptions = {
  chapter35Eligibility: true,
  militaryService: true,
  monthlyAward: true,
  serviceConnectedDisabilities: true,
  serviceConnectedEvaluation: true,
}
expect(downloadLetter).toBeCalledWith(LetterTypeConstants.benefitSummary, letterOptions)
```

This checks to see that the `downloadLetter` action was called with the expected parameters
# Unit Tests

Unit tests should provide confidence that components perform as expected, surfacing regressions quickly whenever an issue occurs. Unit tests also serve as a form of documentation for engineers about how components should function. This document describes practices to help create simple, easy to maintain, solid, user-focused tests.

## Frameworks

We run our unit tests with [Jest](https://jestjs.io/) and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/). RNTL provides a set of utility functions that make React Native component testing easier and more robust. RNTL enables many of the best practices described here.

## Test coverage

All React components should have at least one unit test. The ideal quantity of test coverage depends on component type. Examining component types from most coverage to least:

- **Shared components** are isolated bundles of code which many other components consume. Because shared components are widely used, unit tests should exercise them very thoroughly, including checking all edge cases and error states. (Maximum coverage)
- **Screen child components** are usually not shared and are tightly bound to other components in the screen. Unit tests for these child components should focus on complicated logic that's prone to regressions, while avoiding duplicate coverage between parent and child components. Tests should cover edge cases and error states, but need not check every possible combination of props and state. (High coverage)
- **Entire screens** are typically complex, integrating multiple components along with Redux state, routing, and 3rd party modules. We lean on E2E tests to fully cover screens, so unit tests for screens should be limited in scope to avoid duplicating E2E test coverage. Also if a child component of a screen already has its own unit tests, there's no need to duplicate those tests in the screen itself. (Medium coverage)

Note that while a high coverage percentage is good, it doesn't ensure tests are complete and correct. It's important to think critically and implement tests that cover the key cases a user might encounter.

### More information
- Google's [Code Coverage Best Practices](https://testing.googleblog.com/2020/08/code-coverage-best-practices.html)
- [How to know what to test](https://kentcdodds.com/blog/how-to-know-what-to-test) (Kent C Dodds)

## Targeting by rendered text, label, or role

&#10060; Avoid targeting child props based on numeric order:
```tsx
expect(textView[5].props.children).toEqual('Rx #: 3636691')
```

&#9989; Instead, target rendered text, role, or accessibility label:

```tsx
expect(screen.getByText('Rx #: 3636691')).toBeTruthy()
expect(screen.getByLabelText('Prescription number 3636691')).toBeTruthy()
expect(screen.getByRole('checkbox', { name: 'Prescription 1 of 3', checked: true })).toBeTruthy()
```

### Why?
This method reduces test fragility because moving an element into/out of a child component, changing props, or adding/removing sibling components does not break the test. Targeting accessibility label or role ensures screen readers read the correct label and/or role to the user, preventing a11y regressions. Finally, this type of test is simpler to read and write because it ignores implementation details, focusing instead on what the user expects to see in rendered output. 

### More information
- React Testing Library's [guiding principles](https://testing-library.com/docs/guiding-principles)
- [Some thoughts](https://www.boyney.io/blog/2019-05-21-my-experience-moving-from-enzyme-to-react-testing-library) on why this RTL approach is an improvement over Enzyme
- [The Dangers of Shallow Rendering](https://mskelton.medium.com/the-dangers-of-shallow-rendering-343e48fe5f28)

## Firing events
&#10060; Avoid calling a callback function in a prop to simulate user interaction:

```tsx
testInstance.findByType(Pressable).props.onPress()
```

&#9989; Instead, fire a press event:

```tsx
fireEvent.press(screen.getByText('Cancel'))
```

&#9989; Fire a changeText event:

```tsx
fireEvent.changeText(screen.getByText('Phone'), '123-456-7890');
```

&#9989; Fire a scroll event:

```tsx
fireEvent.scroll(screen.getByText('scroll-view'), {
  nativeEvent: { contentOffset: { y: 200 } }
})
```

### Why?
Calling a callback function in a prop only checks that the function runs. It doesn’t test that the element is visible to the user and that it’s wired up correctly. It’s also fragile because refactoring the component might change the props and break the test. Firing an event resolves these concerns, which also apply to text fields and scrolling.

## Exercising key functionality
&#10060; Avoid tests that just check large quantities of static props:

```tsx
expect(textView[6].props.children).toEqual('What’s next')
expect(textView[7].props.children).toEqual("We're reviewing your refill request. Once approved, the VA pharmacy will process your refill.")
expect(textView[8].props.children).toEqual('If you have questions about the status of your refill, contact your provider or local VA pharmacy.')
```

&#9989; Instead, focus on tests that check important functionality:

```tsx
describe('on click of the "Go to inbox" button', () => {
  it('calls useRouteNavigation and updateSecureMessagingTab', () => {
    fireEvent.press(screen.getByText('Go to inbox'))
    expect(navigate).toHaveBeenCalled()
    expect(updateSecureMessagingTab).toHaveBeenCalled()
  })
})
```

### Why?
Each test should add value by serving as a focused warning that something important has failed. Testing that a sequence of TextViews renders certain text doesn't tell us much. It's also fragile because the smallest text change breaks the test. Testing important and/or complex logic is more beneficial because that’s where high-impact regressions typically occur. In addition, tests for complicated logic serve as a form of documentation, letting engineers know how the code is supposed to function.

### More information
- See #2 of [The 7 Sins of Unit Testing](https://www.testrail.com/blog/the-7-sins-of-unit-testing/) about why more assertions can be worse, not better

## Testing from the user’s perspective
Consider what the user expects to do and see, then write tests that simulate it. For example, let's say the user expects to press “Select all”, then see two checked checkboxes and relevant text.

&#9989; This test tells the user's story and checks it at the same time:

```tsx
it('toggles items when "Select all" is pressed', () => {
    fireEvent.press(screen.getByText('Select all'))
    expect(screen.getByRole('checkbox', { name: 'One', checked: true })).toBeTruthy()
    expect(screen.getByRole('checkbox', { name: 'Two', checked: true })).toBeTruthy()
    expect(screen.getByText('2/2 selected')).toBeTruthy()
})
```

### Why?
By taking the user's point of view, user-focused tests help prevent the most damaging regressions, ones which prevent users from completing their desired tasks. But because implementation details aren't baked into the test, engineers retain the flexibility to refactor as needed without causing test failures.

### More information
- Why it's important to focus on the [end user](https://kentcdodds.com/blog/avoid-the-test-user) and avoid the "test user"

## Test File Naming

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
import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer'
import { NavigationContainer } from '@react-navigation/native'
import 'jest-styled-components'
import { ThemeProvider } from 'styled-components/native'

import HomeScreen from './HomeScreen'
import { context } from 'testUtils'
import theme from 'styles/theme'

context('HomeScreen', () => {
	let component:any

	beforeEach(() => {
		component = renderer.create(
		  <NavigationContainer>
			  <ThemeProvider theme={theme}>
			  	<HomeScreen />
			  </ThemeProvider>
		  </NavigationContainer>)
	})

	it('initializes correctly', async () => {
		await act(async () => {
			expect(component).toBeTruthy()
		})
	})
})

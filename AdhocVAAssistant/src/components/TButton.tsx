import { Button, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

import { StyledSourceRegularText } from 'styles/common'
import { updateCounter } from 'store/actions/counter'

type CounterVal = {
	counter: number
}

type CounterStore = {
	counter: CounterVal
}

type TButtonProps = {
	testID?: string
}

export const TButton: FC<TButtonProps> = ({ testID }) => {
	const dispatch = useDispatch()
	const counter = useSelector((state: CounterStore) => state.counter.counter)

	const increaseCount = (): void => {
		dispatch(updateCounter(counter + 1))
	}

	return (
		<View testID={testID}>
			<StyledSourceRegularText accessibilityLabel="counter" testID="counter">
				Current count is: {counter}
			</StyledSourceRegularText>
			<Button title={'Click me to increase count!'} testID="tbutton" accessibilityLabel="tbutton" onPress={increaseCount} />
			<TextInput testID="textInput" accessibilityLabel="textInput" underlineColorAndroid="red" placeholder="Type text here" />
		</View>
	)
}

export default TButton

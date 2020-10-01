import { Button, Text, TextInput, View } from 'react-native'
import { updateCounter } from './store/actions/counter'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

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
			<Text accessibilityLabel="counter" testID="counter">
				Current count is: {counter}
			</Text>
			<Button title={'Click me to increase count!'} testID="tbutton" accessibilityLabel="tbutton" onPress={increaseCount} />
			<TextInput testID="textInput" accessibilityLabel="textInput" underlineColorAndroid="red" placeholder="Type text here" />
		</View>
	)
}

export default TButton

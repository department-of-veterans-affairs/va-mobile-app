import { StyleSheet } from 'react-native'
import Box from './Box'
import React, { FC, useEffect, useState } from 'react'
import TextView from './TextView'
import VAColors from '../styles/themes/VAColors'
import styled from 'styled-components/native'

export type ToggleButtonProps = {
	onChange: (selection: string) => void
	values: [string, string]
	titles: [string, string]
	selected?: 0 | 1 | undefined
}

const ButtonContainer = styled.TouchableOpacity`
	elevation: 8;
	border-radius: 10px;
	padding-vertical: 4px;
	width: 50%;
`

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: VAColors.grayLighter,
		flexWrap: 'wrap',
		alignSelf: 'baseline',
		borderRadius: 10,
		marginStart: 20, // this is the primary gutter size right now and should be in the theme.
		marginEnd: 20,
		padding: 2,
	},
	activeContainer: {
		backgroundColor: VAColors.white,
		// ...buttonStyle, 
	},
	inactiveContainer: {
		backgroundColor: VAColors.grayLighter,
		elevation: 0,
	},
})

export const ToggleButton: FC<ToggleButtonProps> = ({ values, titles, onChange, selected }) => {
	const [selection, setSelection] = useState(selected === undefined ? 0 : selected)

	useEffect(() => {
		onChange(values[selection])
	})

	return (
		<Box style={styles.container}>
			<ButtonContainer onPress={(): void => setSelection(0)} style={selection === 0 ? styles.activeContainer : styles.inactiveContainer}>
				<TextView variant={selection === 0 ? 'MobileBodyBold' : 'MobileBody'} textAlign="center">
					{titles[0]}
				</TextView>
			</ButtonContainer>
			<ButtonContainer onPress={(): void => setSelection(1)} style={selection === 1 ? styles.activeContainer : styles.inactiveContainer}>
				<TextView variant={selection === 1 ? 'MobileBodyBold' : 'MobileBody'} textAlign="center">
					{titles[1]}
				</TextView>
			</ButtonContainer>
		</Box>
	)
}

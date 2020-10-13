import { FC } from 'react'
import { HomeStackParamList } from './HomeScreen'
import { StackScreenProps } from '@react-navigation/stack'

type CaronaFAQScreenProps = StackScreenProps<HomeStackParamList, 'CoronaFAQ'>

const CaronaFAQScreenProps: FC<CaronaFAQScreenProps> = ({ navigation, route }) => {
	const { url, displayTitle } = route.params
}

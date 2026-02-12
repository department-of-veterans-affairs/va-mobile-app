import React from 'react'

import { StackScreenProps } from '@react-navigation/stack'

import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import VeteranStatusCardScreen from 'screens/HomeScreen/VeteranStatusScreen/VeteranStatusCardScreen'
import VeteranStatusLegacyScreen from 'screens/HomeScreen/VeteranStatusScreen/VeteranStatusLegacyScreen'
import { featureEnabled } from 'utils/remoteConfig'

type VeteranStatusScreenProps = StackScreenProps<HomeStackParamList, 'VeteranStatus'>

function VeteranStatusScreen(props: VeteranStatusScreenProps) {
  const isNewVSCCardAllowed = featureEnabled('veteranStatusCardUpdate')
  return isNewVSCCardAllowed ? <VeteranStatusCardScreen {...props} /> : <VeteranStatusLegacyScreen {...props} />
}

export default VeteranStatusScreen

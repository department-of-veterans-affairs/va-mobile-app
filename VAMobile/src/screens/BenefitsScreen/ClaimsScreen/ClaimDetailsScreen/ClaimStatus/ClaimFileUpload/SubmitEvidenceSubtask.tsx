import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { Box, FullScreenSubtask } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'

import {
  FileRequestContext,
  FileRequestStackParams,
  fileRequestScreenOptions,
  fileRequestSharedScreens,
} from './FileRequestSubtask'
import SubmitEvidence from './SubmitEvidence'

export type SubmitEvidenceStackParams = FileRequestStackParams & {
  SubmitEvidence: undefined
}

const SubmitEvidenceStack = createStackNavigator<SubmitEvidenceStackParams>()

type SubmitEvidenceSubtaskProps = StackScreenProps<BenefitsStackParamList, 'SubmitEvidenceSubtask'>

function SubmitEvidenceSubtask({ navigation, route }: SubmitEvidenceSubtaskProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { claimID } = route.params

  const [leftButtonText, setLeftButtonText] = useState(t('cancel'))
  const [onLeftButtonPress, setOnLeftButtonPress] = useState(() => navigation.goBack)

  return (
    <FullScreenSubtask
      leftButtonText={leftButtonText}
      title={t('claimDetails.submitEvidence')}
      onLeftButtonPress={onLeftButtonPress}>
      <Box flex={1} backgroundColor="main">
        <FileRequestContext.Provider value={{ claimID, claim: undefined, setLeftButtonText, setOnLeftButtonPress }}>
          <SubmitEvidenceStack.Navigator initialRouteName="SubmitEvidence" screenOptions={fileRequestScreenOptions}>
            <SubmitEvidenceStack.Screen name="SubmitEvidence" component={SubmitEvidence} />
            {fileRequestSharedScreens}
          </SubmitEvidenceStack.Navigator>
        </FileRequestContext.Provider>
      </Box>
    </FullScreenSubtask>
  )
}

export default SubmitEvidenceSubtask

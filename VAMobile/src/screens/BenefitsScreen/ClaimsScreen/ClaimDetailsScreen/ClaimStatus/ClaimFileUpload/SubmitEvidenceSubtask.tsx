import React from 'react'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import MultiStepSubtask from 'components/Templates/MultiStepSubtask'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'

import { FileRequestStackParams, fileRequestSharedScreens } from './FileRequestSubtask'
import SubmitEvidence from './SubmitEvidence'

export type SubmitEvidenceStackParams = FileRequestStackParams & {
  SubmitEvidence: {
    claimID: string
  }
}
const SubmitEvidenceStack = createStackNavigator<SubmitEvidenceStackParams>()

type SubmitEvidenceSubtaskProps = StackScreenProps<BenefitsStackParamList, 'SubmitEvidenceSubtask'>

function SubmitEvidenceSubtask({ route }: SubmitEvidenceSubtaskProps) {
  const { claimID } = route.params

  return (
    <MultiStepSubtask<SubmitEvidenceStackParams> stackNavigator={SubmitEvidenceStack}>
      <SubmitEvidenceStack.Screen name="SubmitEvidence" component={SubmitEvidence} initialParams={{ claimID }} />
      {fileRequestSharedScreens}
    </MultiStepSubtask>
  )
}

export default SubmitEvidenceSubtask

import { SegmentedControl, TextArea, TextView } from '../../components'
import { View } from 'react-native'
import { claim } from './claimData'
import { formatDateMMMMDDYYYY } from '../../utils/formattingUtils'
import React, { FC } from 'react'

// TODO: when appeals is added in this will need to be updated unless we just say forget it and give appeals their own helpers
export function getClaimType(claim: any): string {
  return claim.attributes.claimType || 'Disability Compensation'
}
export type ClaimDetailRoughProps = {}
const ClaimDetailRough: FC<ClaimDetailRoughProps> = () => {
  const { attributes } = claim

  return (
    <View>
      <TextArea>
        <TextView>{getClaimType(claim)}</TextView>
        <TextView>Received {formatDateMMMMDDYYYY(attributes.dateFiled)}</TextView>
        <SegmentedControl
          onChange={() => {
            /*details/issues*/
          }}
          values={['status', 'issues']}
          titles={['Status', 'Issues']}
        />
      </TextArea>
      <TextArea>

      </TextArea>
    </View>
  )
}

export default ClaimDetailRough

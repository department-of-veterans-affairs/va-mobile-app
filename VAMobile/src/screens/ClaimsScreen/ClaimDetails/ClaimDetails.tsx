import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { Box, SegmentedControl, TextArea, TextView } from 'components'
import { ClaimAttributesData, ClaimData } from 'store/api/types'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getClaim } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import ClaimDetailsInfo from './ClaimDetailsInfo/ClaimDetailsInfo'
import ClaimStatus from './ClaimStatus/ClaimStatus'

export const getClaimType = (claim: ClaimData | undefined, translation: TFunction): string => {
  return claim?.attributes?.claimType || translation('claims.defaultClaimType')
}

type ClaimDetailsProps = StackScreenProps<ClaimsStackParamList, 'ClaimDetails'>

const ClaimDetails: FC<ClaimDetailsProps> = ({ route }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const controlValues = [t('claimDetails.status'), t('claimDetails.details')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  const { claimID, claimType } = route.params
  const { claim } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { attributes } = claim || ({} as ClaimData)
  const { dateFiled } = attributes || ({} as ClaimAttributesData)

  useEffect(() => {
    dispatch(getClaim(claimID))
  }, [dispatch, claimID])

  const formattedReceivedDate = formatDateMMMMDDYYYY(dateFiled || '')

  return (
    <ScrollView {...testIdProps('Claims-details-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="BitterBoldHeading" mb={theme.dimensions.titleHeaderAndElementMargin} accessibilityRole="header">
            {t('claimDetails.titleWithType', { type: getClaimType(claim, t).toLowerCase() })}
          </TextView>
          <TextView variant="MobileBody">{t('claimDetails.receivedOn', { date: formattedReceivedDate })}</TextView>
          <Box mt={theme.dimensions.marginBetween}>
            <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} />
          </Box>
        </TextArea>
        <Box mt={theme.dimensions.marginBetweenCards}>
          {selectedTab === t('claimDetails.status') && <ClaimStatus claim={claim || ({} as ClaimData)} claimType={claimType} />}
          {selectedTab === t('claimDetails.details') && <ClaimDetailsInfo claim={claim || ({} as ClaimData)} />}
        </Box>
      </Box>
    </ScrollView>
  )
}

export default ClaimDetails

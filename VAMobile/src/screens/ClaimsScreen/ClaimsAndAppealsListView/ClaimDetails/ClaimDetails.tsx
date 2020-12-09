import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { Box, SegmentedControl, TextArea, TextView } from 'components'
import { ClaimAndAppealData, ClaimAndAppealSubData } from 'store/api/types'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getClaimOrAppeal } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'
import ClaimIssues from './ClaimIssues/ClaimIssues'
import ClaimStatus from './ClaimStatus/ClaimStatus'

type ClaimDetailsProps = StackScreenProps<ClaimsStackParamList, 'ClaimDetails'>

const ClaimDetails: FC<ClaimDetailsProps> = ({ route }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const controlValues = [t('claimDetails.status'), t('claimDetails.issues')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  const { claimID } = route.params
  const { claimOrAppeal } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { attributes } = claimOrAppeal || ({} as ClaimAndAppealData)
  const { dateFiled, subtype } = attributes || ({} as ClaimAndAppealSubData)

  useEffect(() => {
    dispatch(getClaimOrAppeal(claimID))
  }, [dispatch, claimID])

  const formattedReceivedDate = formatDateMMMMDDYYYY(dateFiled || '')

  return (
    <ScrollView>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="BitterBoldHeading" mb={theme.dimensions.titleHeaderAndElementMargin}>
            {t('claimDetails.titleWithType', { type: subtype?.toLowerCase() || '' })}
          </TextView>
          <TextView variant="MobileBody">{t('claimDetails.receivedOn', { date: formattedReceivedDate })}</TextView>
          <Box mt={theme.dimensions.marginBetween}>
            <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} />
          </Box>
        </TextArea>
        <Box mt={theme.dimensions.marginBetweenCards}>
          {selectedTab === t('claimDetails.status') && <ClaimStatus />}
          {selectedTab === t('claimDetails.issues') && <ClaimIssues />}
        </Box>
      </Box>
    </ScrollView>
  )
}

export default ClaimDetails

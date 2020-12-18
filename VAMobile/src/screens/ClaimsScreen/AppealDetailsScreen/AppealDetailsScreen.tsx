import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { AppealAttributesData, AppealData } from 'store/api/types'
import { Box, SegmentedControl, TextArea, TextView } from 'components'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getAppeal } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import AppealDetails from './AppealDetails/AppealDetails'
import AppealStatus from './AppealStatus/AppealStatus'

type AppealDetailsScreenProps = StackScreenProps<ClaimsStackParamList, 'AppealDetailsScreen'>

const AppealDetailsScreen: FC<AppealDetailsScreenProps> = ({ route }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const controlValues = [t('claimDetails.status'), t('claimDetails.details')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  const { appealID } = route.params
  const { appeal } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { attributes } = appeal || ({} as AppealData)
  const { type, updated } = attributes || ({} as AppealAttributesData)

  useEffect(() => {
    dispatch(getAppeal(appealID))
  }, [dispatch, appealID])

  const formattedUpdatedDate = formatDateMMMMDDYYYY(updated || '')

  return (
    <ScrollView {...testIdProps('Appeal-details-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="BitterBoldHeading" mb={theme.dimensions.titleHeaderAndElementMargin} accessibilityRole="header">
            {t('appealDetails.pageTitle', { appealType: capitalizeWord(type || '') })}
          </TextView>
          <TextView variant="MobileBody">{t('appealDetails.upToDate', { date: formattedUpdatedDate })}</TextView>
          <Box mt={theme.dimensions.marginBetween}>
            <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} />
          </Box>
        </TextArea>
        <Box mt={theme.dimensions.marginBetweenCards}>
          {appeal && selectedTab === t('claimDetails.status') && <AppealStatus />}
          {appeal && selectedTab === t('claimDetails.details') && <AppealDetails />}
        </Box>
      </Box>
    </ScrollView>
  )
}

export default AppealDetailsScreen

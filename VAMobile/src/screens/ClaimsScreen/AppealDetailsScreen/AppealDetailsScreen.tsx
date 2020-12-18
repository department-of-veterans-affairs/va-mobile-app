import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { AppealAttributesData, AppealData, AppealEventTypesConstants, AppealTypesConstants } from 'store/api/types'
import { Box, SegmentedControl, TextArea, TextView } from 'components'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
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
  const segmentedControlA11yHints = [
    t('appealDetails.viewYourAppeal', { tabName: t('claimDetails.status') }),
    t('appealDetails.viewYourAppeal', { tabName: t('claimDetails.details') }),
  ]

  const { appealID } = route.params
  const { appeal } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { attributes, type } = appeal || ({} as AppealData)
  const { updated, programArea, events } = attributes || ({} as AppealAttributesData)

  useEffect(() => {
    dispatch(getAppeal(appealID))
  }, [dispatch, appealID])

  const getDisplayType = (): string => {
    switch (type) {
      case AppealTypesConstants.higherLevelReview:
        return t('appealDetails.higherLevelReview')
      case AppealTypesConstants.legacyAppeal:
      case AppealTypesConstants.appeal:
        return t('appealDetails.appeal')
      case AppealTypesConstants.supplementalClaim:
        return t('appealDetails.supplementalClaim')
    }

    return ''
  }

  const getSubmittedDate = (): string => {
    let findElement = ''
    switch (type) {
      case AppealTypesConstants.higherLevelReview:
        findElement = AppealEventTypesConstants.hlr_request
        break
      case AppealTypesConstants.legacyAppeal:
      case AppealTypesConstants.appeal:
        findElement = AppealEventTypesConstants.nod
        break
      case AppealTypesConstants.supplementalClaim:
        findElement = AppealEventTypesConstants.sc_request
        break
    }

    const event = events?.find((el) => el.type === findElement)
    return event?.data || ''
  }

  const formattedUpdatedDate = formatDateMMMMDDYYYY(updated || '')
  const formattedUpdatedTime = getFormattedTimeForTimeZone(updated || '')
  const formattedSubmittedDate = formatDateMMMMDDYYYY(getSubmittedDate())

  return (
    <ScrollView {...testIdProps('Appeal-details-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="BitterBoldHeading" mb={theme.dimensions.titleHeaderAndElementMargin} accessibilityRole="header">
            {t('appealDetails.pageTitle', { appealType: getDisplayType(), programArea: programArea || '' })}
          </TextView>
          <TextView variant="MobileBody">{t('appealDetails.upToDate', { date: formattedUpdatedDate, time: formattedUpdatedTime })}</TextView>
          <TextView variant="MobileBody">{t('appealDetails.submitted', { date: formattedSubmittedDate })}</TextView>
          <Box mt={theme.dimensions.marginBetween}>
            <SegmentedControl
              values={controlValues}
              titles={controlValues}
              onChange={setSelectedTab}
              selected={controlValues.indexOf(selectedTab)}
              accessibilityHints={segmentedControlA11yHints}
            />
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

import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayError } from 'constants/travelPay'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'
import { FileOnlineComponent, TravelPayHelp } from './components'

type ErrorScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'ErrorScreen'>

function ErrorScreen({ route }: ErrorScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { error = 'error' } = route.params
  const theme = useTheme()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()

  const getErrorContent = (travelPayError: TravelPayError) => {
    switch (travelPayError) {
      case 'noAddress':
        return {
          title: t('travelPay.error.noAddress.title'),
          textLines: [t('travelPay.error.noAddress.text')],
          content: (
            <LinkWithAnalytics
              type="custom"
              text={t('travelPay.error.noAddress.link')}
              testID="updateAddressLink"
              onPress={() => {
                navigateTo('ContactInformation')
              }}
            />
          ),
        }
      case 'noEligibleType':
        return {
          title: t('travelPay.error.notEligible.title'),
          textLines: [t('travelPay.error.notEligible.text')],
        }
      case 'error':
      default:
        return {
          title: t('travelPay.error.error.title'),
          textLines: [t('travelPay.error.error.text'), t('travelPay.error.error.text2')],
        }
    }
  }

  const { title, textLines, content } = getErrorContent(error)

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="errorTitleID" variant="BitterHeading" accessibilityRole="header">
          {title}
        </TextView>
        {textLines.map((textLine, index) => (
          <TextView
            key={index}
            testID={`errorTextID${index}`}
            variant="MobileBody"
            mt={theme.dimensions.standardMarginBetween}>
            {textLine}
          </TextView>
        ))}
        {content}
        <FileOnlineComponent />
        <TravelPayHelp />
      </Box>
    </VAScrollView>
  )
}

export default ErrorScreen

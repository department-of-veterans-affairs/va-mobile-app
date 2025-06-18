import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { useContactInformation } from 'api/contactInformation'
import { Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayError } from 'constants/travelPay'
import { profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary/AddressSummary'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'
import { FileOnlineComponent, TravelPayHelp } from './components'

type ErrorScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'ErrorScreen'>

function ErrorScreen({ route, navigation }: ErrorScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { error = 'error' } = route.params
  const theme = useTheme()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()
  const contactInformationQuery = useContactInformation({ enabled: true })
  const residentialAddress = contactInformationQuery.data?.residentialAddress

  useSubtaskProps({
    rightButtonText: t('close'),
    rightButtonTestID: 'rightCloseTestID',
    onRightButtonPress: () => {
      // This screen lives in a FullScreenSubtask, so we need to grab the parent to go back one screen and exit the subtask
      navigation.getParent()?.goBack()
    },
  })

  useFocusEffect(
    useCallback(() => {
      if (error === 'noAddress' && residentialAddress) {
        navigateTo('AddressScreen')
      }
    }, [error, residentialAddress, navigateTo]),
  )

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
                navigateTo('EditAddress', {
                  displayTitle: t('contactInformation.residentialAddress'),
                  addressType: profileAddressOptions.RESIDENTIAL_ADDRESS,
                })
              }}
            />
          ),
        }
      case 'unsupportedType':
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
    <VAScrollView testID="ErrorScreen">
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

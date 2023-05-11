import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ChildTemplate, VABulletList, VAButton } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useNavigation } from '@react-navigation/native'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type NoRequestAppointmentAccessProps = StackScreenProps<HealthStackParamList, 'NoRequestAppointmentAccess'>

const NoRequestAppointmentAccess: FC<NoRequestAppointmentAccessProps> = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { contentMarginBottom, standardMarginBetween } = theme?.dimensions
  const onFacilityLocator = navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: tc('webview.vagov'), loadingMessage: tc('webview.valocation.loading') })
  const navigation = useNavigation()

  const containerStyles = {
    mt: 30,
    mb: contentMarginBottom,
  }

  const bulletOne = {
    text: t('noRequestAppointmentAccess.bulletOneText'),
    boldedText: ' ' + tc('and'),
    a11yLabel: t('noRequestAppointmentAccess.bulletOneLabel'),
  }

  const bulletTwo = {
    text: t('noRequestAppointmentAccess.bulletTwoText'),
    a11yLabel: t('noRequestAppointmentAccess.bulletTwoLabel'),
  }

  return (
    <ChildTemplate backLabel={tc('appointments')} backLabelOnPress={navigation.goBack} title={t('requestAppointments.launchModalBtnTitle')}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox title={t('noRequestAppointmentAccess.title')} border="warning" text={t('noRequestAppointmentAccess.text')}>
          <Box my={standardMarginBetween}>
            <VABulletList listOfText={[bulletOne]} />
          </Box>
          <Box mb={standardMarginBetween}>
            <VABulletList listOfText={[bulletTwo]} />
          </Box>
          <Box mt={standardMarginBetween} accessibilityRole="button" mb={standardMarginBetween}>
            <VAButton
              onPress={onFacilityLocator}
              label={t('noRequestAppointmentAccess.findFacilityBtnTitle')}
              buttonType={ButtonTypesConstants.buttonPrimary}
              testID={t('noRequestAppointmentAccess.findFacilityBtnTitle')}
              a11yHint={t('noRequestAppointmentAccess.findFacilityBtnHint')}
            />
          </Box>
        </AlertBox>
      </Box>
    </ChildTemplate>
  )
}

export default NoRequestAppointmentAccess

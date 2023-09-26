import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ChildTemplate, VABulletList, VAButton } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useNavigation } from '@react-navigation/native'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type NoRequestAppointmentAccessProps = StackScreenProps<HealthStackParamList, 'NoRequestAppointmentAccess'>

const NoRequestAppointmentAccess: FC<NoRequestAppointmentAccessProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions
  const onFacilityLocator = navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: t('webview.vagov'), loadingMessage: t('webview.valocation.loading') })
  const navigation = useNavigation()

  const containerStyles = {
    mb: contentMarginBottom,
  }

  const bulletOne = {
    text: t('noRequestAppointmentAccess.bulletOneText'),
    boldedText: ' ' + t('and'),
    a11yLabel: a11yLabelVA(t('noRequestAppointmentAccess.bulletOneText')) + ' ' + t('and'),
  }

  const bulletTwo = {
    text: t('noRequestAppointmentAccess.bulletTwoText'),
    a11yLabel: a11yLabelVA(t('noRequestAppointmentAccess.bulletTwoText')),
  }

  return (
    <ChildTemplate backLabel={t('appointments')} backLabelOnPress={navigation.goBack} title={t('requestAppointments.launchModalBtnTitle')}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox title={t('noRequestAppointmentAccess.title')} border="warning" text={t('noRequestAppointmentAccess.text')}>
          <Box mt={standardMarginBetween}>
            <VABulletList listOfText={[bulletOne, bulletTwo]} paragraphSpacing={true} />
          </Box>
          <Box accessibilityRole="button" mb={standardMarginBetween}>
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

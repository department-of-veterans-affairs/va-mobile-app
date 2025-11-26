import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, LinkWithAnalytics, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

type DisputeCopayScreenProps = StackScreenProps<PaymentsStackParamList, 'DisputeCopay'>

const { LINK_URL_DISPUTE_COPAY } = getEnv()

function DisputeCopayScreen({ navigation }: DisputeCopayScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { contentMarginBottom, condensedMarginBetween } = theme.dimensions

  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const backLabel = prevScreen === 'CopayDetails' ? t('copays.details.title') : t('copays.title')

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('copays.disputeCopay.title')}
      testID="disputeCopayTestID"
      backLabelTestID="disputeCopayBackTestID">
      <Box mb={contentMarginBottom}>
        <TextArea>
          <Trans
            i18nKey="copays.disputeCopay.copy"
            components={{
              p: <TextView my={condensedMarginBetween} variant="MobileBody" />,
              bold: <TextView variant="MobileBodyBold" />,
            }}
          />

          <Box>
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_DISPUTE_COPAY}
              text={t('copays.disputeCopay.link')}
              testID="learn-dispute-copay-link"
            />
          </Box>
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default DisputeCopayScreen

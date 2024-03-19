import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, LargePanel, TextView, TextViewProps, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useTheme } from 'utils/hooks'

type WhatToKnowScreenProps = StackScreenProps<HomeStackParamList, 'WhatToKnow'>

function WhatToKnowScreen({}: WhatToKnowScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const bodyTextProps: TextViewProps = {
    variant: 'MobileBody',
  }

  return (
    <LargePanel title={t('profile.help.title')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('personalInformation.genderIdentity.whatToKnow.title')}
        </TextView>
        <TextView {...bodyTextProps} mt={theme.dimensions.condensedMarginBetween}>
          {t('personalInformation.genderIdentity.whatToKnow.description')}
        </TextView>
        <Box mt={theme.dimensions.formMarginBetween}>
          <VABulletList
            listOfText={[
              {
                variant: 'MobileBody',
                boldedTextPrefix: t('personalInformation.genderIdentity.whatToKnow.ReasonsToShare.1'),
                text: t('personalInformation.genderIdentity.whatToKnow.ReasonsToShare.2'),
                a11yLabel:
                  t('personalInformation.genderIdentity.whatToKnow.ReasonsToShare.1') +
                  t('personalInformation.genderIdentity.whatToKnow.ReasonsToShare.2'),
              },
              {
                variant: 'MobileBody',
                boldedTextPrefix: t('personalInformation.genderIdentity.whatToKnow.whoCanAccess'),
                text: t('personalInformation.genderIdentity.whatToKnow.privacy'),
                a11yLabel:
                  t('personalInformation.genderIdentity.whatToKnow.whoCanAccess') +
                  t('personalInformation.genderIdentity.whatToKnow.privacy'),
              },
              {
                variant: 'MobileBody',
                boldedTextPrefix: t('personalInformation.genderIdentity.whatToKnow.healthRecordsOnly.1'),
                text: t('personalInformation.genderIdentity.whatToKnow.healthRecordsOnly.2'),
                a11yLabel:
                  t('personalInformation.genderIdentity.whatToKnow.healthRecordsOnly.1') +
                  t('personalInformation.genderIdentity.whatToKnow.healthRecordsOnly.2'),
              },
              {
                variant: 'MobileBody',
                boldedTextPrefix: t('personalInformation.genderIdentity.whatToKnow.birthCertificate.1'),
                text: t('personalInformation.genderIdentity.whatToKnow.birthCertificate.2'),
                a11yLabel:
                  t('personalInformation.genderIdentity.whatToKnow.birthCertificate.1') +
                  t('personalInformation.genderIdentity.whatToKnow.birthCertificate.2'),
              },
            ]}
            paragraphSpacing={true}
          />
        </Box>

        {/* <TextView {...bodyTextProps}>{t('personalInformation.genderIdentity.whatToKnow.privacy')}</TextView> */}
      </Box>
    </LargePanel>
  )
}

export default WhatToKnowScreen

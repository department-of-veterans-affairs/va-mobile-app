import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileScreen'
import { TextArea, TextView, TextViewProps } from 'components'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { useRouteNavigation, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HowDoIUpdateScreenProps = StackScreenProps<ProfileStackParamList, 'HowDoIUpdate'>

const HowDoIUpdateScreen: FC<HowDoIUpdateScreenProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <TextView accessibilityLabel={t('howDoIUpdate.title')} accessibilityRole="header" />,
    })
  })

  const linkProps: TextViewProps = {
    onPress: () => navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: t('common:webview.vagov') }),
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    accessibilityRole: 'link',
  }

  return (
    <ScrollView {...testIdProps(generateTestID(t('howDoIUpdate.title'), ''))}>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('howDoIUpdate.ifEnrolledInVAHealth')}
        </TextView>
        <TextView variant="MobileBody" mt={7} mb={20}>
          {t('howDoIUpdate.pleaseContactNearestVAMed')}
        </TextView>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('howDoIUpdate.ifNotEnrolledInVAHealth')}
        </TextView>
        <TextView variant="MobileBody" mt={7} mb={20}>
          {t('howDoIUpdate.pleaseContactNearestVARegional')}
        </TextView>
        <TextView
          {...linkProps}
          {...a11yHintProp(t('howDoIUpdate.findYourNearestVALocationA11yHint'))}
          {...testIdProps(generateTestID(t('howDoIUpdate.findYourNearestVALocation'), ''))}>
          {t('howDoIUpdate.findYourNearestVALocation')}
        </TextView>
      </TextArea>
    </ScrollView>
  )
}

export default HowDoIUpdateScreen

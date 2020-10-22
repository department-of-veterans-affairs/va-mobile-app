import { Linking, ScrollView } from 'react-native'
import { TextArea, TextView } from 'components'
import React from 'react'

import { useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

const HowDoIUpdate = () => {
  const t = useTranslation('profile')

  const onFindVALocation = () => {
    Linking.openURL(WEBVIEW_URL_FACILITY_LOCATOR)
  }

  return (
    <ScrollView>
      <TextArea>
        <TextView variant="MobileBodyBold">{t('howDoIUpdate.ifEnrolledInVAHealth')}</TextView>
        <TextView variant="MobileBody" mt={7} mb={20}>
          {t('howDoIUpdate.pleaseContactNearestVAMed')}
        </TextView>
        <TextView variant="MobileBodyBold">{t('howDoIUpdate.ifNotEnrolledInVAHealth')}</TextView>
        <TextView variant="MobileBody" mt={7} mb={20}>
          {t('howDoIUpdate.pleaseContactNearestVARegional')}
        </TextView>
        <TextView onPress={onFindVALocation} variant="MobileBody" color="link" textDecoration="underline" textDecorationColor="link">
          {t('howDoIUpdate.findYourNearestVALocation')}
        </TextView>
      </TextArea>
    </ScrollView>
  )
}

export default HowDoIUpdate

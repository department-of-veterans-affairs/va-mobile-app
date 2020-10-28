import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileScreen'
import { TextArea, TextView } from 'components'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'

type HowWillYouScreenProps = StackScreenProps<ProfileStackParamList, 'HowDoIUpdate'>

const HowWillYouScreen: FC<HowWillYouScreenProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.PROFILE)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <TextView accessibilityLabel={t('howWillYou.title')} accessibilityRole="header" />,
    })
  })

  return (
    <ScrollView {...testIdProps(generateTestID(t('howWillYou.title'), ''))}>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('personalInformation.howWillYouUseContactInfo')}
        </TextView>
        <TextView variant="MobileBody" mt={12} mb={10}>
          {t('howWillYou.useInfo')}
        </TextView>
      </TextArea>
    </ScrollView>
  )
}

export default HowWillYouScreen

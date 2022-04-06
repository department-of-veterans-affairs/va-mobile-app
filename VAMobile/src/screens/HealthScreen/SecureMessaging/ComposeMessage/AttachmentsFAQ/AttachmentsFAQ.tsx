import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect } from 'react'

import { BackButton, Box, ClickToCallPhoneNumber, TextArea, TextView, VABulletList, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps } from '@react-navigation/stack'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type AttachmentsFAQProps = StackScreenProps<HealthStackParamList, 'AttachmentsFAQ'>

const AttachmentsFAQ: FC<AttachmentsFAQProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation([NAMESPACE.HOME, NAMESPACE.COMMON])
  const { originHeader } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} />,
      headerTitle: originHeader,
    })
  })

  return (
    <VAScrollView>
      <Box backgroundColor={'alertBox'} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <Box accessible={true} accessibilityRole={'header'}>
            <TextView variant={'MobileBodyBold'} color={'primaryTitle'}>
              {t('secureMessaging.attachments.FAQ.howCanIAttach')}
            </TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList
              listOfText={[
                t('secureMessaging.attachments.FAQ.howCanI.bullet1'),
                t('secureMessaging.attachments.FAQ.howCanI.bullet2'),
                t('secureMessaging.attachments.FAQ.howCanI.bullet3'),
              ]}
            />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView>
              <TextView variant="MobileBodyBold" color={'primaryTitle'}>
                {t('secureMessaging.attachments.FAQ.note') + ' '}
              </TextView>
              <TextView variant="MobileBody">{t('secureMessaging.attachments.FAQ.noteText')}</TextView>
            </TextView>
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VABulletList listOfText={[t('secureMessaging.attachments.FAQ.note.bullet1'), t('secureMessaging.attachments.FAQ.note.bullet2')]} />
            </Box>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBody" accessibilityLabel={t('secureMessaging.attachments.FAQ.ifYourProblemA11y')}>
              {t('secureMessaging.attachments.FAQ.ifYourProblem')}
            </TextView>
            <ClickToCallPhoneNumber phone={tc('common:8773270022.displayText')} {...a11yHintProp(tc('home:veteransCrisisLine.callA11yHint'))} />
          </Box>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}
export default AttachmentsFAQ

import { BackButton, Box, ClickToCallPhoneNumber, TextArea, TextView, VABulletList, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import React, { FC, ReactNode, useEffect } from 'react'

type AttachmentsFAQProps = StackScreenProps<HealthStackParamList, 'AttachmentsFAQ'>

const AttachmentsFAQ: FC<AttachmentsFAQProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const th = useTranslation(NAMESPACE.HOME)
  const { originHeader } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={false} />
      ),
      headerTitle: originHeader,
    })
  })

  return (
    <VAScrollView>
      <Box backgroundColor={'noCardBackground'} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <Box accessible={true} accessibilityRole={'header'}>
            <TextView variant={'MobileBodyBold'}>{t('secureMessaging.attachments.FAQ.howCanIAttach')}</TextView>
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
              <TextView variant="MobileBodyBold">{t('secureMessaging.attachments.FAQ.note') + ' '}</TextView>
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
            <ClickToCallPhoneNumber phone={t('secureMessaging.attachments.FAQ.ifYourProblem.phone')} {...a11yHintProp(th('veteransCrisisLine.callA11yHint'))} />
          </Box>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}
export default AttachmentsFAQ

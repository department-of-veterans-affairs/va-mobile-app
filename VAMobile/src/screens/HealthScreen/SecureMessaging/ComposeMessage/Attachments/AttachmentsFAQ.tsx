import { BackButton, Box, ClickToCallPhoneNumber,TextArea, TextView, VABulletList, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HeaderTitle, StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { HeaderTitleType } from 'styles/common'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import React, { FC, ReactNode, useEffect } from 'react'

type AttachmentsFAQProps = StackScreenProps<HealthStackParamList, 'AttachmentsFAQ'>

const AttachmentsFAQ: FC<AttachmentsFAQProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const th = useTranslation(NAMESPACE.HOME)
  const { header: displayTitle } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={false} />
      ),
      headerTitle: (header: HeaderTitleType) => (
        <Box {...testIdProps(displayTitle)} accessibilityRole="header" accessible={true}>
          <HeaderTitle {...header}>{displayTitle}</HeaderTitle>
        </Box>
      ),
    })
  })

  return (
    <VAScrollView>
      <Box backgroundColor={'noCardBackground'} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant={'MobileBodyBold'}>{t('secureMessaging.attachments.FAQ.howCanIAttach')}</TextView>
          <VABulletList
            listOfText={[
              t('secureMessaging.attachments.FAQ.howCanI.bullet1'),
              t('secureMessaging.attachments.FAQ.howCanI.bullet2'),
              t('secureMessaging.attachments.FAQ.howCanI.bullet3'),
            ]}
          />
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant={'MobileBodyBold'}>{t('secureMessaging.attachments.FAQ.note')}</TextView>
            <VABulletList listOfText={[t('secureMessaging.attachments.FAQ.note.bullet1'), t('secureMessaging.attachments.FAQ.note.bullet2')]} />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView color="primary" variant="MobileBody">
              {t('secureMessaging.attachments.FAQ.ifYourProblem')}
            </TextView>
            <ClickToCallPhoneNumber
              displayedText={t('secureMessaging.attachments.FAQ.ifYourProblem.phone')}
              phone={th('veteransCrisisLine.hearingLossNumber')}
              {...a11yHintProp(th('veteransCrisisLine.callA11yHint'))}
            />
          </Box>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}
export default AttachmentsFAQ

import { AlertBox, Box, ButtonDecoratorType, LoadingComponent, SimpleList, SimpleListItemObj, TextView, VAButton, VAScrollView } from 'components'
import { Linking } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { NotificationsState, StoreState, loadPushPreferences, setPushPref } from '../../../../store'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslation } from 'utils/hooks'
import React, { FC, ReactNode, useEffect } from 'react'

const NotificationsSettingsScreen: FC = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const { gutter, contentMarginTop, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions
  const { preferences, loadingPreferences, systemNotificationsOn, settingPreference } = useSelector<StoreState, NotificationsState>((state) => state.notifications)
  const goToSettings = () => {
    Linking.openSettings()
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadPushPreferences())
  }, [dispatch])

  const alert = (): ReactNode => {
    return (
      <Box mx={gutter}>
        <AlertBox border={'secondary'} background={'noCardBackground'} title={t('notifications.settings.alert.title')} text={t('notifications.settings.alert.text')}>
          <Box mt={standardMarginBetween}>
            <VAButton onPress={goToSettings} label={t('notifications.settings.alert.openSettings')} buttonType={'buttonPrimary'} />
          </Box>
        </AlertBox>
      </Box>
    )
  }

  if (loadingPreferences) {
    return <LoadingComponent text={'Loading your preferences'} />
  }

  if (settingPreference) {
    return <LoadingComponent text={'Changing you preference with VA'} />
  }

  const personalizeText = systemNotificationsOn
    ? t('notifications.settings.personalize.text.systemNotificationsOn')
    : t('notifications.settings.personalize.text.systemNotificationsOff')

  const preferenceList = (): ReactNode => {
    const prefsItems = preferences.map(
      (pref): SimpleListItemObj => {
        return {
          a11yHintText: t('notifications.settings.switch.a11yHint', { notificationChannelName: pref.preferenceName }),
          text: pref.preferenceName,
          decorator: ButtonDecoratorType.Switch,
          decoratorProps: {
            on: pref.value,
          },
          onPress: () => {
            dispatch(setPushPref(pref))
          },
        }
      },
    )
    return (
      <Box mt={condensedMarginBetween}>
        <SimpleList items={prefsItems} />
      </Box>
    )
  }
  return (
    <VAScrollView>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        {!systemNotificationsOn && alert()}
        <TextView variant={'MobileBodyBold'} accessibilityRole={'header'} mx={gutter} mt={standardMarginBetween}>
          {t('notifications.settings.personalize.heading')}
        </TextView>
        <TextView variant={'MobileBody'} accessibilityRole={'header'} mx={gutter} mt={condensedMarginBetween}>
          {personalizeText}
        </TextView>
        {preferenceList()}
        <TextView variant={'TableFooterLabel'} mx={gutter} mt={condensedMarginBetween}>
          {t('notifications.settings.privacy')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default NotificationsSettingsScreen

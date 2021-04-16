import { TextView } from '../../../../components'
import React, { FC } from 'react'

const NotificationsSettingsScreen: FC = () => {
  return (
    <>
      <TextView accessibilityRole={'header'} variant={'MobileBodyBold'}>
        Personalize Notifications
      </TextView>
    </>
  )
}

export default NotificationsSettingsScreen

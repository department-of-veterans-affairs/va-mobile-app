import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'

import AlertWithHaptics from 'components/AlertWithHaptics'
import Box from 'components/Box'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { SettingsState, updateDisplayDuplicateRecordAlert } from 'store/slices'
import { useAppDispatch, useTheme } from 'utils/hooks'

export const DUPLICATE_RECORD_ALERT_DISMISSED = '@store_duplicate_record_alert_dismissed'

const DuplicateRecordAlert = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { displayDuplicateRecordAlert } = useSelector<RootState, SettingsState>((state) => state.settings)

  useEffect(() => {
    const checkDismissed = async () => {
      const dismissed = await AsyncStorage.getItem(DUPLICATE_RECORD_ALERT_DISMISSED)
      if (!dismissed) {
        dispatch(updateDisplayDuplicateRecordAlert(true))
      }
    }
    checkDismissed()
  }, [dispatch])

  const handleDismiss = (): void => {
    AsyncStorage.setItem(DUPLICATE_RECORD_ALERT_DISMISSED, 'true')
    dispatch(updateDisplayDuplicateRecordAlert(false))
  }

  if (!displayDuplicateRecordAlert) {
    return null
  }

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertWithHaptics
        expandable={true}
        initializeExpanded={true}
        variant="info"
        header={t('ohAlert.duplicatedRecord.title')}
        description={t('ohAlert.duplicatedRecord.body')}
        secondaryButton={{ label: t('dismiss'), onPress: handleDismiss }}/>
    </Box>
  )
}

export default DuplicateRecordAlert

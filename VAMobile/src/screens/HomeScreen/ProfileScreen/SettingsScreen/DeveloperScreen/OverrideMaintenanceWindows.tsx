import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'
import { each, map } from 'underscore'

import {
  MAINTENANCE_WINDOW_OVERRIDES,
  MaintenanceWindowOverrideStorage,
} from 'api/maintenanceWindows/getMaintenanceWindows'
import { Box, FeatureLandingTemplate, TextView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { DowntimeFeatureTypeConstants } from 'store/api'
import { useTheme } from 'utils/hooks'

type OverrideMaintenanceWindowsProps = StackScreenProps<HomeStackParamList, 'MaintenanceWindows'>
type MaintenanceWindowOverrideState = Record<string, { minutesStartsIn: null | number; lengthInMinutes: null | number }>

const initMaintenanceWindowOverrideState = () => {
  const state: MaintenanceWindowOverrideState = {}

  each(DowntimeFeatureTypeConstants, (featureType) => {
    state[featureType] = {
      minutesStartsIn: null,
      lengthInMinutes: null,
    }
  })

  return state
}

const MaintenanceWindowOverrideInput = ({
  overrides,
  text,
  onChange,
}: {
  overrides: MaintenanceWindowOverrideState
  text: string
  onChange: (key: string, val: string, inputType: 'minutesStartsIn' | 'lengthInMinutes') => void
}) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const minutesStartsIn = overrides[text].minutesStartsIn === null ? '' : `${overrides[text].minutesStartsIn}`
  const lengthInMinutes = overrides[text].lengthInMinutes === null ? '' : `${overrides[text].lengthInMinutes}`

  return (
    <Box
      pb={theme.dimensions.contentMarginBottom}
      px={theme.dimensions.gutter}
      borderColor="primary"
      borderBottomWidth="default"
      backgroundColor="list">
      <TextView variant="MobileBodyBold">{text}</TextView>
      <Box gap={theme.dimensions.smallMarginBetween}>
        <Box>
          <TextView>{t('overrideMaintenanceWindows.startIn')}</TextView>
          <VATextInput
            labelKey=""
            inputType="phone"
            value={minutesStartsIn}
            onChange={(val) => onChange(text, val, 'minutesStartsIn')}
          />
          <TextView>{t('overrideMaintenanceWindows.minutes')}</TextView>
        </Box>
        <Box>
          <TextView>{t('overrideMaintenanceWindows.for')}</TextView>
          <VATextInput
            labelKey=""
            inputType="phone"
            value={lengthInMinutes}
            onChange={(val) => onChange(text, val, 'lengthInMinutes')}
          />
          <TextView>{t('overrideMaintenanceWindows.minutes')}</TextView>
        </Box>
      </Box>
    </Box>
  )
}

const OverrideMaintenanceWindows = ({ navigation }: OverrideMaintenanceWindowsProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [overrides, setOverrides] = useState(initMaintenanceWindowOverrideState())

  const overrideMaintenanceWindows = async () => {
    const maintenanceWindows: MaintenanceWindowOverrideStorage = {}
    each(overrides, (override, key) => {
      if (override.minutesStartsIn !== null && override.lengthInMinutes !== null) {
        const startTime = DateTime.now().plus({ minute: override.minutesStartsIn })
        maintenanceWindows[key] = {
          startTime: startTime.toISO(),
          endTime: startTime.plus({ minute: override.lengthInMinutes }).toISO(),
        }
      } else {
        maintenanceWindows[key] = undefined
      }
    })
    await AsyncStorage.setItem(MAINTENANCE_WINDOW_OVERRIDES, JSON.stringify(maintenanceWindows))
  }

  const clearMaintenanceWindowOverrides = async () => {
    setOverrides(initMaintenanceWindowOverrideState())
    await AsyncStorage.setItem(MAINTENANCE_WINDOW_OVERRIDES, '')
  }

  const onChange = (key: string, value: string, inputType: 'minutesStartsIn' | 'lengthInMinutes') => {
    setOverrides((prev) => {
      const minute = value === '' ? null : Number(value)

      return {
        ...prev,
        [key]: {
          ...prev[key],
          [inputType]: minute,
        },
      }
    })
  }

  const maintenanceWindowsList = map(overrides, (w, text) => {
    return <MaintenanceWindowOverrideInput overrides={overrides} text={text} onChange={onChange} />
  })

  return (
    <FeatureLandingTemplate
      backLabel={t('debug.title')}
      backLabelOnPress={navigation.goBack}
      title={t('overrideMaintenanceWindows')}
      testID="overrideMaintenanceWindowsTestID"
      footerContent={
        <Box
          mx={theme.dimensions.gutter}
          my={theme.dimensions.standardMarginBetween}
          gap={theme.dimensions.condensedMarginBetween}>
          <Button label={t('overrideMaintenanceWindows')} onPress={overrideMaintenanceWindows} />
          <Button label={t('overrideMaintenanceWindows.clearOverrides')} onPress={clearMaintenanceWindowOverrides} />
        </Box>
      }>
      <Box gap={theme.dimensions.condensedMarginBetween}>{maintenanceWindowsList}</Box>
    </FeatureLandingTemplate>
  )
}

export default OverrideMaintenanceWindows

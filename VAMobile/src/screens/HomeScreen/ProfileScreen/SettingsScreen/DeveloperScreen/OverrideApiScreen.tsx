import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys, useErrorOverrides } from 'api/errors'
import { errors } from 'api/types'
import { Box, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useTheme } from 'utils/hooks'

type OverrideAPIScreenProps = StackScreenProps<HomeStackParamList, 'OverrideAPI'>

function OverrideAPIScreen({ navigation }: OverrideAPIScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { data: errorOverrideData } = useErrorOverrides()
  const [errors, setErrors] = useState<Array<errors>>(errorOverrideData?.errors || [])

  // vaccineKeys.vaccines, { networkError: true }
  const saveErrors = () => {
    _.forEach(errors, (error) => {
      queryClient.invalidateQueries({
        queryKey: error.queryKey,
      })
    })

    queryClient.setQueryData(errorKeys.errorOverrides, { errors })
  }

  const clearErrors = () => {
    queryClient.clear()
    setErrors([])
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('debug.title')}
      backLabelOnPress={navigation.goBack}
      title={t('overrideAPI')}
      testID="overrideAPITestID"
      footerContent={
        <Box
          mx={theme.dimensions.gutter}
          mb={theme.dimensions.contentMarginBottom}
          mt={theme.dimensions.standardMarginBetween}>
          <Box mb={theme.dimensions.standardMarginBetween}>
            <Button label="Set API Errors" onPress={saveErrors} />
          </Box>
          <Button label="Clear API Errors" onPress={clearErrors} />
        </Box>
      }>
      <Box>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Appointments
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Authorized Services
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Claims and Appeals
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Contact Information
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Decision Letters
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Demographics
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Direct Deposit
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Disability Rating
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Facilities
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Letters
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Military Service
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Payments
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Personal Information
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Prescriptions
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Secure Messaging
          </TextView>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Vaccines
          </TextView>
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default OverrideAPIScreen

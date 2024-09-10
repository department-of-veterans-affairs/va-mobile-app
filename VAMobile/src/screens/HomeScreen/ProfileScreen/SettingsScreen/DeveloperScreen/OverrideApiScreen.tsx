import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { appointmentsKeys } from 'api/appointments'
import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { contactInformationKeys } from 'api/contactInformation'
import { decisionLettersKeys } from 'api/decisionLetters'
import { demographicsKeys } from 'api/demographics/queryKeys'
import { directDepositKeys } from 'api/directDeposit'
import { disabilityRatingKeys } from 'api/disabilityRating'
import { errorKeys } from 'api/errors'
import { facilitiesKeys } from 'api/facilities/queryKeys'
import { lettersKeys } from 'api/letters'
import { militaryServiceHistoryKeys } from 'api/militaryService'
import { paymentsKeys } from 'api/payments'
import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { prescriptionKeys } from 'api/prescriptions'
import { secureMessagingKeys } from 'api/secureMessaging'
import { ErrorData, errorOverride, errors } from 'api/types'
import { vaccineKeys } from 'api/vaccines/queryKeys'
import { Box, FeatureLandingTemplate, SelectorType, TextArea, TextView, VASelector, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useTheme } from 'utils/hooks'

type OverrideAPIScreenProps = StackScreenProps<HomeStackParamList, 'OverrideAPI'>

const IndividualQueryDisplay = (
  queryKey: QueryKey,
  overrideErrors: errors[],
  setErrors: React.Dispatch<React.SetStateAction<errors[]>>,
  clearErrors: boolean,
) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [networkSelected, setNetworkSelected] = useState(false)
  const [backEndSelected, setBackEndSelected] = useState(false)
  const [otherSelected, setOtherSelected] = useState(false)
  const [refreshableSelected, setRefreshable] = useState(false)
  const [initialBETitle, setInitialBETitle] = useState('')
  const [initialBEBody, setInitialBEBody] = useState('')
  const [initialBEPhone, setInitialBEPhone] = useState('')
  const [initialOtherErrorCode, setInitialOtherErrorCode] = useState('500')

  useEffect(() => {
    _.forEach(overrideErrors, (error) => {
      if (error.queryKey[0] === queryKey[0]) {
        const errorDetails = error.error
        for (const key in errorDetails) {
          if (key === 'networkError') {
            setNetworkSelected(true)
          } else if (key === 'status') {
            const errorDict = errorDetails as errorOverride
            if (errorDict.status === 418) {
              if (errorDict.json) {
                setBackEndSelected(true)
                const errorDetailsDict = errorDict.json.errors[0]
                setRefreshable(errorDetailsDict?.refreshable || false)
                setInitialBETitle(errorDetailsDict.title)
                setInitialBEBody(errorDetailsDict.body || '')
                setInitialBEPhone(errorDetailsDict.telephone || '')
              }
            } else {
              setOtherSelected(true)
              setInitialOtherErrorCode(errorDict.status.toString())
            }
          }
        }
      }
    })
  }, [overrideErrors, queryKey])

  useEffect(() => {
    if (clearErrors) {
      setNetworkSelected(false)
      setBackEndSelected(false)
      setOtherSelected(false)
    }
  }, [clearErrors])

  return (
    <Box>
      <TextView>{queryKey[0]}</TextView>
      <VASelector
        selectorType={SelectorType.Checkbox}
        labelKey={t('overrideAPI.network')}
        selected={networkSelected}
        onSelectionChange={() => {
          setNetworkSelected(!networkSelected)
          setBackEndSelected(false)
          setOtherSelected(false)
          setRefreshable(false)
          setInitialOtherErrorCode('500')
          const newErrors = _.remove(overrideErrors, function (n) {
            return n.queryKey[0] !== queryKey[0]
          })
          if (!networkSelected) {
            newErrors.push({
              queryKey,
              error: { networkError: true },
            })
          }
          setErrors(newErrors)
        }}
      />
      <VASelector
        selectorType={SelectorType.Checkbox}
        labelKey={t('overrideAPI.backEnd')}
        selected={backEndSelected}
        onSelectionChange={() => {
          setNetworkSelected(false)
          setBackEndSelected(!backEndSelected)
          setOtherSelected(false)
          setRefreshable(false)
          setInitialOtherErrorCode('500')
          const newErrors = _.remove(overrideErrors, function (n) {
            return n.queryKey[0] !== queryKey[0]
          })
          if (!backEndSelected) {
            const backEndError: errorOverride = {
              status: 418,
              endpoint: '',
              text: '',
              json: {
                errors: [
                  {
                    title: '',
                    detail: '',
                    code: '',
                    source: '',
                    body: undefined,
                    telephone: undefined,
                    refreshable: false,
                  },
                ],
              },
            }
            newErrors.push({
              queryKey,
              error: backEndError,
            })
          }
          setErrors(newErrors)
        }}
      />
      {backEndSelected && (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView>Title</TextView>
          <VATextInput
            value={initialBETitle}
            inputType="none"
            onChange={(val) => {
              const otherErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] !== queryKey[0]
              })
              const backEndErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] === queryKey[0]
              })[0]

              const backEndError = backEndErrors.error as errorOverride
              if (backEndError.json) {
                if (val.length >= 1) {
                  backEndError.json.errors[0].title = val
                } else {
                  backEndError.json.errors[0].title = ''
                }
              }
              otherErrors.push({
                queryKey,
                error: backEndError,
              })
              setErrors(otherErrors)
            }}
          />
          <TextView>Body</TextView>
          <VATextInput
            value={initialBEBody}
            inputType="none"
            onChange={(val) => {
              const otherErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] !== queryKey[0]
              })
              const backEndErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] === queryKey[0]
              })[0]

              const backEndError = backEndErrors.error as errorOverride
              if (backEndError.json) {
                if (val.length >= 1) {
                  backEndError.json.errors[0].body = val
                } else {
                  backEndError.json.errors[0].body = ''
                }
              }
              otherErrors.push({
                queryKey,
                error: backEndError,
              })
              setErrors(otherErrors)
            }}
          />
          <TextView>Telephone</TextView>
          <VATextInput
            value={initialBEPhone}
            inputType="phone"
            onChange={(val) => {
              const otherErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] !== queryKey[0]
              })
              const backEndErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] === queryKey[0]
              })[0]

              const backEndError = backEndErrors.error as errorOverride
              if (backEndError.json) {
                if (val.length >= 1) {
                  backEndError.json.errors[0].telephone = val
                } else {
                  backEndError.json.errors[0].telephone = ''
                }
              }
              otherErrors.push({
                queryKey,
                error: backEndError,
              })
              setErrors(otherErrors)
            }}
          />
          <VASelector
            selectorType={SelectorType.Checkbox}
            labelKey={'Refreshable'}
            selected={refreshableSelected}
            onSelectionChange={() => {
              setRefreshable(!refreshableSelected)
              const otherErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] !== queryKey[0]
              })
              const backEndErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] === queryKey[0]
              })[0]

              const backEndError = backEndErrors.error as errorOverride
              if (backEndError.json) {
                backEndError.json.errors[0].refreshable = !refreshableSelected
              }
              otherErrors.push({
                queryKey,
                error: backEndError,
              })
              setErrors(otherErrors)
            }}
          />
        </Box>
      )}
      <VASelector
        selectorType={SelectorType.Checkbox}
        labelKey={t('overrideAPI.otherCodes')}
        selected={otherSelected}
        onSelectionChange={() => {
          setNetworkSelected(false)
          setBackEndSelected(false)
          setRefreshable(false)
          setOtherSelected(!otherSelected)
          setInitialOtherErrorCode('500')
          const newErrors = _.remove(overrideErrors, function (n) {
            return n.queryKey[0] !== queryKey[0]
          })
          if (!otherSelected) {
            const backEndError: errorOverride = {
              status: 500,
              endpoint: '',
              text: '',
              json: {
                errors: [
                  {
                    title: '',
                    detail: '',
                    code: '',
                    source: '',
                    body: undefined,
                    telephone: undefined,
                    refreshable: false,
                  },
                ],
              },
            }
            newErrors.push({
              queryKey,
              error: backEndError,
            })
          }
          setErrors(newErrors)
        }}
      />
      {otherSelected && (
        <Box>
          <TextView>Status</TextView>
          <VATextInput
            value={initialOtherErrorCode}
            inputType="phone"
            onChange={(val) => {
              const otherErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] !== queryKey[0]
              })
              const backEndErrors = _.remove(overrideErrors, function (n) {
                return n.queryKey[0] === queryKey[0]
              })[0]

              const backEndError = backEndErrors.error as errorOverride
              if (val.length >= 1) {
                backEndError.status = parseInt(val, 10)
              } else {
                backEndError.status = 0
              }

              otherErrors.push({
                queryKey,
                error: backEndError,
              })
              setErrors(otherErrors)
            }}
          />
        </Box>
      )}
    </Box>
  )
}

function OverrideAPIScreen({ navigation }: OverrideAPIScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const queryClient = useQueryClient()
  const [clearData, setClearData] = useState(false)
  const [overrideErrors, setErrors] = useState<Array<errors>>([])

  useEffect(() => {
    const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
    setErrors(data?.overrideErrors || [])
  }, [queryClient])

  useEffect(() => {
    if (clearData) {
      setClearData(false)
      queryClient.invalidateQueries({
        queryKey: errorKeys.errorOverrides,
      })
      queryClient.clear()
      setErrors([])
    }
  }, [clearData, queryClient])

  const saveErrors = () => {
    queryClient.clear()
    queryClient.setQueryData(errorKeys.errorOverrides, { overrideErrors })
  }

  const clearErrors = () => {
    setClearData(true)
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
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(appointmentsKeys.appointments, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Authorized Services
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(authorizedServicesKeys.authorizedServices, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Claims and Appeals
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(claimsAndAppealsKeys.appeal, overrideErrors, setErrors, clearData)}
          </Box>
          {IndividualQueryDisplay(claimsAndAppealsKeys.claim, overrideErrors, setErrors, clearData)}
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(claimsAndAppealsKeys.claimsAndAppeals, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Contact Information
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(contactInformationKeys.contactInformation, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Decision Letters
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(decisionLettersKeys.decisionLetters, overrideErrors, setErrors, clearData)}
          </Box>
          {IndividualQueryDisplay(decisionLettersKeys.downloadLetter, overrideErrors, setErrors, clearData)}
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Demographics
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(demographicsKeys.demographics, overrideErrors, setErrors, clearData)}
          </Box>
          {IndividualQueryDisplay(demographicsKeys.genderIdentityOptions, overrideErrors, setErrors, clearData)}
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Direct Deposit
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(directDepositKeys.directDeposit, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Disability Rating
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(disabilityRatingKeys.disabilityRating, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Facilities
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(facilitiesKeys.facilities, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Letters
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(lettersKeys.beneficiaryData, overrideErrors, setErrors, clearData)}
          </Box>
          {IndividualQueryDisplay(lettersKeys.downloadLetter, overrideErrors, setErrors, clearData)}
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(lettersKeys.letters, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Military Service
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(militaryServiceHistoryKeys.serviceHistory, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Payments
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(paymentsKeys.payments, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Personal Information
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(personalInformationKeys.personalInformation, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Prescriptions
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(prescriptionKeys.prescriptions, overrideErrors, setErrors, clearData)}
          </Box>
          {IndividualQueryDisplay(prescriptionKeys.trackingInfo, overrideErrors, setErrors, clearData)}
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Secure Messaging
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(secureMessagingKeys.downloadFileAttachment, overrideErrors, setErrors, clearData)}
          </Box>
          {IndividualQueryDisplay(secureMessagingKeys.folderMessages, overrideErrors, setErrors, clearData)}
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(secureMessagingKeys.folders, overrideErrors, setErrors, clearData)}
          </Box>
          {IndividualQueryDisplay(secureMessagingKeys.message, overrideErrors, setErrors, clearData)}
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(secureMessagingKeys.recipients, overrideErrors, setErrors, clearData)}
          </Box>
          {IndividualQueryDisplay(secureMessagingKeys.signature, overrideErrors, setErrors, clearData)}
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(secureMessagingKeys.thread, overrideErrors, setErrors, clearData)}
          </Box>
        </TextArea>
        <TextArea>
          <TextView accessibilityRole="header" variant="MobileBodyBold">
            Vaccines
          </TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            {IndividualQueryDisplay(vaccineKeys.vaccines, overrideErrors, setErrors, clearData)}
          </Box>
          {IndividualQueryDisplay(vaccineKeys.vaccineLocations, overrideErrors, setErrors, clearData)}
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default OverrideAPIScreen

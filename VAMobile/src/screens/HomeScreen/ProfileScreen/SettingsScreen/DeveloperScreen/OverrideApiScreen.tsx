import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'lodash'

import { Box, FeatureLandingTemplate, SelectorType, TextArea, TextView, VASelector, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { RootState } from 'store'
import { APIError } from 'store/api'
import { DemoState, dispatchUpdateErrors } from 'store/slices/demoSlice'
import { useAppDispatch, useTheme } from 'utils/hooks'

type OverrideAPIScreenProps = StackScreenProps<HomeStackParamList, 'OverrideAPI'>

const APIGroupings: {
  name: string
  endpoints: string[]
}[] = [
  {
    name: 'Appointments',
    endpoints: ['/v0/appointments'],
  },
  {
    name: 'Authorized Services',
    endpoints: ['/v0/user/authorized-services'],
  },
  {
    name: 'Claims and Appeals',
    endpoints: ['/v0/appeal/', '/v0/claim/', '/v0/claims-and-appeals-overview'],
  },
  {
    name: 'Contact Information',
    endpoints: ['/v0/user/contact-info'],
  },
  {
    name: 'Decision Letters',
    endpoints: ['/v0/claims/decision-letters'],
  },
  {
    name: 'Demographics',
    endpoints: ['/v0/user/demographics', '/v0/user/gender_identity/edit'],
  },
  {
    name: 'Direct Deposit',
    endpoints: ['/v0/payment-information/benefits'],
  },
  {
    name: 'Disability Rating',
    endpoints: ['/v0/disability-rating'],
  },
  {
    name: 'Facilities',
    endpoints: ['/v0/facilities-info'],
  },
  {
    name: 'Letters',
    endpoints: ['/v0/letters/beneficiary', '/v0/letters'],
  },
  {
    name: 'Military Service',
    endpoints: ['/v0/military-service-history'],
  },
  {
    name: 'Notifications',
    endpoints: ['/v0/push/prefs/'],
  },
  {
    name: 'Payments',
    endpoints: ['/v0/payment-history'],
  },
  {
    name: 'Personal Information',
    endpoints: ['/v2/user'],
  },
  {
    name: 'Prescriptions',
    endpoints: ['/v0/health/rx/prescriptions', '/tracking'],
  },
  {
    name: 'Secure Messaging',
    endpoints: [
      '/v0/messaging/health/folders/${folderID}/messages',
      '/v0/messaging/health/folders',
      '/v0/messaging/health/messages/',
      '/v0/messaging/health/messages/recipients',
      '/v0/messaging/health/messages/signature',
      '/thread',
    ],
  },
  {
    name: 'Vaccines',
    endpoints: ['/v1/health/immunizations', '/v0/health/locations/'],
  },
]

const IndividualQueryDisplay = (
  endpoint: string,
  overrideErrors: APIError[],
  setErrors: React.Dispatch<React.SetStateAction<APIError[]>>,
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
      if (error.endpoint === endpoint) {
        if (error.networkError) {
          setNetworkSelected(true)
        } else if (error.status === 418) {
          if (error.json) {
            setBackEndSelected(true)
            const errorDetailsDict = error.json.errors[0]
            setRefreshable(errorDetailsDict?.refreshable || false)
            setInitialBETitle(errorDetailsDict.title)
            setInitialBEBody(errorDetailsDict.body || '')
            setInitialBEPhone(errorDetailsDict.telephone || '')
          }
        } else {
          setOtherSelected(true)
          setInitialOtherErrorCode(error.status?.toString() || '500')
        }
      }
    })
  }, [overrideErrors, endpoint])

  useEffect(() => {
    if (clearErrors) {
      setNetworkSelected(false)
      setBackEndSelected(false)
      setOtherSelected(false)
    }
  }, [clearErrors])

  return (
    <Box>
      <TextView>{endpoint}</TextView>
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
            return n.endpoint !== endpoint
          })
          if (!networkSelected) {
            newErrors.push({
              endpoint,
              networkError: true,
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
            return n.endpoint !== endpoint
          })
          if (!backEndSelected) {
            newErrors.push({
              endpoint,
              status: 418,
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
                return n.endpoint !== endpoint
              })
              const backEndError = _.remove(overrideErrors, function (n) {
                return n.endpoint === endpoint
              })[0]

              if (backEndError.json) {
                if (val.length >= 1) {
                  backEndError.json.errors[0].title = val
                } else {
                  backEndError.json.errors[0].title = ''
                }
              }
              otherErrors.push(backEndError)
              setErrors(otherErrors)
            }}
          />
          <TextView>Body</TextView>
          <VATextInput
            value={initialBEBody}
            inputType="none"
            onChange={(val) => {
              const otherErrors = _.remove(overrideErrors, function (n) {
                return n.endpoint !== endpoint
              })
              const backEndError = _.remove(overrideErrors, function (n) {
                return n.endpoint === endpoint
              })[0]

              if (backEndError.json) {
                if (val.length >= 1) {
                  backEndError.json.errors[0].body = val
                } else {
                  backEndError.json.errors[0].body = ''
                }
              }
              otherErrors.push(backEndError)
              setErrors(otherErrors)
            }}
          />
          <TextView>Telephone</TextView>
          <VATextInput
            value={initialBEPhone}
            inputType="phone"
            onChange={(val) => {
              const otherErrors = _.remove(overrideErrors, function (n) {
                return n.endpoint !== endpoint
              })
              const backEndError = _.remove(overrideErrors, function (n) {
                return n.endpoint === endpoint
              })[0]

              if (backEndError.json) {
                if (val.length >= 1) {
                  backEndError.json.errors[0].telephone = val
                } else {
                  backEndError.json.errors[0].telephone = ''
                }
              }
              otherErrors.push(backEndError)
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
                return n.endpoint !== endpoint
              })
              const backEndError = _.remove(overrideErrors, function (n) {
                return n.endpoint === endpoint
              })[0]

              if (backEndError.json) {
                backEndError.json.errors[0].refreshable = !refreshableSelected
              }
              otherErrors.push(backEndError)
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
            return n.endpoint !== endpoint
          })
          if (!otherSelected) {
            newErrors.push({
              endpoint,
              status: 500,
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
                return n.endpoint !== endpoint
              })
              const backEndError = _.remove(overrideErrors, function (n) {
                return n.endpoint === endpoint
              })[0]

              if (val.length >= 1) {
                backEndError.status = parseInt(val, 10)
              } else {
                backEndError.status = 0
              }

              otherErrors.push(backEndError)
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
  const dispatch = useAppDispatch()
  const { overrideErrors } = useSelector<RootState, DemoState>((state) => state.demo)
  const [clearData, setClearData] = useState(false)
  const [temporaryErrors, setErrors] = useState<Array<APIError>>([])

  useEffect(() => {
    setErrors(overrideErrors)
  }, [overrideErrors])

  useEffect(() => {
    if (clearData) {
      setClearData(false)
      dispatch(dispatchUpdateErrors([]))
    }
  }, [clearData, dispatch])

  const saveErrors = () => {
    dispatch(dispatchUpdateErrors(temporaryErrors))
  }

  const clearErrors = () => {
    setClearData(true)
  }

  const groupings = APIGroupings.map((group) => {
    const individualQueries = group.endpoints.map((endpoint, idx) => {
      return (
        <Box
          mt={theme.dimensions.standardMarginBetween}
          mb={idx === group.endpoints.length - 1 ? theme.dimensions.standardMarginBetween : undefined}>
          {IndividualQueryDisplay(endpoint, overrideErrors, setErrors, clearData)}
        </Box>
      )
    })
    return (
      <TextArea>
        <TextView accessibilityRole="header" variant="MobileBodyBold">
          {group.name}
        </TextView>
        {individualQueries}
      </TextArea>
    )
  })

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
      <Box>{groupings}</Box>
    </FeatureLandingTemplate>
  )
}

export default OverrideAPIScreen

import React, { useMemo, useState } from 'react'

import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { SegmentedControl, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { Box, FeatureLandingTemplate, TextView } from '../../components'
import { useTheme } from '../../utils/hooks'
import FormEmptyPlaceHolder from './FormEmptyPlaceHolder'
import FormFooter from './FormFooter'
import FormsCardItem, { FormMetaData } from './FormsCardItem'
import { FORM_STATUS, FormStatus } from './FormsCardItemTag'
import { FormsStackParamList } from './FormsStackScreens'

type PaymentsScreenProps = StackScreenProps<FormsStackParamList, 'Forms'>
function FormsScreen({ navigation }: PaymentsScreenProps) {
  const theme = useTheme()
  const snackbar = useSnackbar()
  const [selectedTab, setSelectedTab] = useState(0)

  const [activeForms, setActiveForms] = useState<FormMetaData[]>([])
  const [completedForms, _setCompletedForms] = useState<FormMetaData[]>([
    {
      id: 128912341,
      url: 'https://test.va.gov/supporting-forms-for-claims/submit-statement-form-21-4138/confirmation',
      status: FORM_STATUS.received,
      statusDate: DateTime.now().toISODate(),
      receivedDate: DateTime.now().minus({ month: 1 }).toISODate(),
    },
  ])

  const hasDraftForm = useMemo(() => {
    return !!activeForms.find((activeForm) => {
      return activeForm.status === FORM_STATUS.draft
    })
  }, [activeForms])

  const updateForm = (formId: number, url: string) => {
    // TODO probably check if its the right url or path (ex. '/submit-statement-form-21-4138')
    if (!url.includes('/submit-statement-form-21-4138')) {
      return
    }

    const endUrl = url.slice(url.lastIndexOf('/') + 1, url.length)

    let status: FormStatus = FORM_STATUS.draft
    if (endUrl === 'confirmation') {
      status = FORM_STATUS.inProgress
    }

    snackbar.show('Form updated successfully', {
      offset: 160,
    })
    setActiveForms((prevForms) => {
      return prevForms.map((form) => {
        return form.id === formId
          ? {
              ...form,
              status,
              url,
              statusDate: DateTime.now().toISODate(),
            }
          : form
      })
    })
  }

  const renderActiveForms = () => {
    if (activeForms.length === 0) return <FormEmptyPlaceHolder text={'You do not have any in-progress forms.'} />
    return activeForms.map((s, index) => {
      return <FormsCardItem data={s} onFormClose={updateForm} key={index} />
    })
  }

  const renderCompletedForms = () => {
    if (completedForms.length === 0) return <FormEmptyPlaceHolder text={'You do not have any completed forms.'} />
    return completedForms.map((s, index) => {
      return <FormsCardItem data={s} key={index} />
    })
  }

  const formDescription =
    'Drafts are saved for 30 days from the date you begin working on them. Drafts auto-save as you work work.'
  return (
    <FeatureLandingTemplate
      backLabel={'Back'}
      backLabelOnPress={navigation.goBack}
      footerContent={hasDraftForm ? null : <FormFooter setActiveForms={setActiveForms} />}
      title={'Forms'}
      testID={'Forms'}>
      <Box flex={1} justifyContent="flex-start" mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <TextView>{formDescription}</TextView>
          <Box my={theme.dimensions.standardMarginBetween}>
            <SegmentedControl labels={['Active', 'Complete']} onChange={setSelectedTab} selected={selectedTab} />
          </Box>
          {selectedTab === 0 ? renderActiveForms() : renderCompletedForms()}
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

type FormsStackScreenProps = Record<string, unknown>
const FormsScreenStack = createStackNavigator<FormsStackParamList>()
/**
 * Stack screen for the Forms
 */
function FormsStackScreen({}: FormsStackScreenProps) {
  const snackbar = useSnackbar()
  const screenOptions = {
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }
  return (
    <FormsScreenStack.Navigator
      screenOptions={screenOptions}
      screenListeners={{
        transitionStart: (e) => {
          if (e.data.closing) {
            snackbar.hide()
          }
        },
        blur: () => {
          snackbar.hide()
        },
      }}>
      <FormsScreenStack.Screen name="Forms" component={FormsScreen} options={{ headerShown: false }} />
    </FormsScreenStack.Navigator>
  )
}

export default FormsStackScreen

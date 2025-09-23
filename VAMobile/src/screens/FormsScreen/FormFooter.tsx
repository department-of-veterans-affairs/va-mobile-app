import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Button, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { Box } from 'components'
import { RootState } from 'store'
import { setOpenFormImmediately } from 'store/slices'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'

import { FormMetaData } from './FormsCardItem'
import { FORM_STATUS } from './FormsCardItemTag'

type FormFooterProps = {
  setActiveForms: Dispatch<SetStateAction<FormMetaData[]>>
}
function FormFooter({ setActiveForms }: FormFooterProps) {
  const theme = useTheme()
  const snackbar = useSnackbar()
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()
  const startFormImmediately = useSelector<RootState, boolean>((state) => state.settings.openForm)

  const startStatement = useCallback(() => {
    navigateTo('Webview', {
      url: `https://refactored-space-disco-w9ww774vvjjhg4pp-3001.app.github.dev/supporting-forms-for-claims/submit-statement-form-21-4138/introduction`,
      useSSO: true,
      onClose: (url: string) => {
        const endUrl = url.slice(url.lastIndexOf('/') + 1, url.length)
        let status = ''
        switch (endUrl) {
          case 'introduction':
          case 'statement-type':
            // The flow does not officially start until they get to personal information
            // ignore the first two screens for now
            return
          // cover the case if they click on form-saved
          case 'form-saved':
          case 'personal-information':
          case 'identification-information':
          case 'mailing-address':
          case 'contact-information':
          case 'statement':
          case 'review-and-submit':
            status = FORM_STATUS.draft
            break
          case 'confirmation':
          default:
            // Assumed they finish at this point if they got to confirmation or are on a different page now
            status = FORM_STATUS.inProgress
            break
        }

        snackbar.show('Form updated successfully', {
          offset: 160,
        })
        // @ts-ignore
        setActiveForms((prevItems) => [
          {
            id: Date.now(),
            url: url,
            status,
            statusDate: DateTime.now().toISODate(),
            receivedDate: DateTime.now()
              .set({ month: Math.floor(Math.random() * 6) + 1 })
              .toISODate(), // random month between 1-6
          },
          ...prevItems,
        ])
      },
    })
  }, [navigateTo, setActiveForms, snackbar])

  useEffect(() => {
    if (startFormImmediately) {
      dispatch(setOpenFormImmediately(false))
      startStatement()
    }
  }, [dispatch, startFormImmediately])

  return (
    <Box mx={theme.dimensions.gutter} my={theme.dimensions.condensedMarginBetween}>
      <Button label={'Start a statement'} onPress={startStatement} />
    </Box>
  )
}
export default FormFooter

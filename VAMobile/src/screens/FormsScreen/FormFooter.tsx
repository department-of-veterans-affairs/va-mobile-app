import React, { Dispatch, SetStateAction } from 'react'

import { Button, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { Box } from '../../components'
import { useRouteNavigation, useTheme } from '../../utils/hooks'
import { FormMetaData } from './FormsCardItem'
import { FORM_STATUS } from './FormsCardItemTag'

type FormFooterProps = {
  setActiveForms: Dispatch<SetStateAction<FormMetaData[]>>
}
function FormFooter({ setActiveForms }: FormFooterProps) {
  const theme = useTheme()
  const snackbar = useSnackbar()
  const navigateTo = useRouteNavigation()

  return (
    <Box mx={theme.dimensions.gutter} my={theme.dimensions.condensedMarginBetween}>
      <Button
        label={'Start a statement'}
        onPress={() => {
          navigateTo('Webview', {
            url: `https://refactored-space-trout-w9ww774rw67hqj7-3001.app.github.dev/supporting-forms-for-claims/submit-statement-form-21-4138/introduction`,
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
        }}
      />
    </Box>
  )
}
export default FormFooter

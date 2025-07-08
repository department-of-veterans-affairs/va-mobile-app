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
            url: `https://didactic-cod-xx56j6p5vg3v45v-3001.app.github.dev/supporting-forms-for-claims/submit-statement-form-21-4138/introduction`,
            useSSO: true,
            onClose: (url: string) => {
              // TODO probably check if its the right url or path (ex. '/submit-statement-form-21-4138')
              if (!url.includes('/submit-statement-form-21-4138')) {
                return
              }

              const endUrl = url.slice(url.lastIndexOf('/') + 1, url.length)
              let status = ''
              switch (endUrl) {
                case 'introduction':
                case 'statement-type':
                case 'personal-information':
                case 'identification-information':
                case 'mailing-address':
                case 'contact-information':
                case 'statement':
                case 'review-and-submit':
                  status = FORM_STATUS.draft
                  break
                case 'confirmation':
                  status = FORM_STATUS.inProgress
                  break
                default:
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

import React from 'react'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'

import { Box, MultiTouchCard, MultiTouchCardProps, TextView } from 'components'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import { formatDateMMMMDDYYYY } from '../../utils/formattingUtils'
import FormsCardItemTag, { FORM_STATUS, FormStatus } from './FormsCardItemTag'

export type FormMetaData = {
  id: number
  url: string
  status: FormStatus
  statusDate: string
  receivedDate: string
}

export type FormsCardProps = {
  data: FormMetaData
  onFormClose?: (formId: number, url: string) => void
  key?: string | number
}

function FormsCardItem({ data, onFormClose, key }: FormsCardProps) {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const statusDateStr = `Form 21-4138 | ${data.status === FORM_STATUS.draft ? 'Draft saved' : 'Submitted'} on ${formatDateMMMMDDYYYY(data.statusDate)}`

  // Draft(blue), In-progress(blue after its been submitted), Action needed(yellow), Received(light grey),
  const tags = [data.status]
  if (data.status === FORM_STATUS.draft) {
    tags.push(FORM_STATUS.daysLeft)
  }
  const mainContent = (
    <Box>
      <TextView variant={'MobileBodyBold'} accessibilityRole="header">
        {'Statement in Support of a Claim'}
      </TextView>
      <TextView variant={'HelperText'} color={'placeholder'}>
        {statusDateStr}
      </TextView>
      <Box mt={theme.dimensions.condensedMarginBetween} flexDirection={'row'} flexWrap={'wrap'} gap={5}>
        {tags.map((tag) => {
          return <FormsCardItemTag status={tag} statusDate={data.statusDate} />
        })}
      </Box>
    </Box>
  )

  let bottomContent
  let bottomOnPress

  if (data.url && data.status === FORM_STATUS.draft) {
    bottomContent = (
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        minHeight={theme.dimensions.touchableMinHeight}
        pt={5}>
        <TextView flex={1} variant={'MobileBodyBold'} color={'primary'}>
          {'Continue form'}
        </TextView>
        <Icon
          name={'ChevronRight'}
          fill={theme.colors.icon.deleteFill}
          width={theme.dimensions.chevronListItemWidth}
          height={theme.dimensions.chevronListItemHeight}
        />
      </Box>
    )

    bottomOnPress = () => {
      navigateTo('Webview', {
        url: data.url,
        useSSO: true,
        onClose: (url: string) => {
          if (onFormClose) onFormClose(data.id, url)
        },
      })
    }
  }

  const multiTouchCardProps: MultiTouchCardProps = {
    mainContent,
    bottomContent,
    bottomOnPress,
  }
  return (
    <Box key={key} pb={theme.dimensions.condensedMarginBetween}>
      <MultiTouchCard {...multiTouchCardProps} />
    </Box>
  )
}

export default FormsCardItem

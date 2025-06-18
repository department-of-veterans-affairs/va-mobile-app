import React from 'react'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'
import { DateTime } from 'luxon'

import { BackgroundVariant, Box, BoxProps, TextView, TextViewProps } from 'components'

import { useTheme } from '../../utils/hooks'

// daysLeft is not real
export type FormStatus = 'draft' | 'inProgress' | 'received' | 'daysLeft'

export const FORM_STATUS: {
  [keyof in FormStatus]: FormStatus
} = {
  draft: 'draft',
  inProgress: 'inProgress',
  received: 'received',
  daysLeft: 'daysLeft',
}

export type FormsCardProps = {
  status: FormStatus
  statusDate?: string
}

const MAX_DAYS = 30 // add an extra day because today counts?
const MIN_DAYS = 10

const getDaysLeft = (date?: string) => {
  if (!date) {
    return -1
  }
  const dateOfStatus = DateTime.fromISO(date).plus({ days: MAX_DAYS })
  const daysLeft = dateOfStatus.diff(DateTime.now(), ['days'])
  return daysLeft.days
}

function FormsCardItemTag({ status, statusDate }: FormsCardProps) {
  const theme = useTheme()
  let boxProps: BoxProps = {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
    py: 5,
    px: 10,
  }
  let textProps: TextViewProps = {}
  let text = ''
  let bgColor: BackgroundVariant = '' as BackgroundVariant
  let color = ''
  const daysLeft = getDaysLeft(statusDate)
  switch (status) {
    case FORM_STATUS.draft:
      let draftText = 'Draft'
      bgColor = 'veteranStatus'
      color = 'actionBar'
      if (daysLeft >= 0 && daysLeft <= MIN_DAYS) {
        draftText = 'Action needed'
        bgColor = 'gold' as BackgroundVariant
        color = 'primary'
      }

      boxProps = {
        ...boxProps,
        backgroundColor: bgColor,
      }
      textProps = {
        ...textProps,
        color,
      }
      text = draftText
      break
    case FORM_STATUS.inProgress:
      boxProps = {
        ...boxProps,
        backgroundColor: 'veteranStatus',
      }
      textProps = {
        ...textProps,
        color: 'actionBar',
      }
      text = 'In progress'
      break
    case FORM_STATUS.received:
      boxProps = {
        ...boxProps,
        backgroundColor: 'main',
        borderRadius: '10px',
      }
      textProps = {
        ...textProps,
        color: 'primary',
      }
      text = 'Received'
      break
    case FORM_STATUS.daysLeft:
      bgColor = 'tagBlue'
      color = 'link'
      if (daysLeft >= 0 && daysLeft <= MIN_DAYS) {
        bgColor = 'gold' as BackgroundVariant
        color = 'primary'
      }

      boxProps = {
        ...boxProps,
        backgroundColor: bgColor,
        borderRadius: '10px',
      }
      textProps = {
        ...textProps,
        color,
        variant: 'LargeNavSubtext',
      }
      text = `${Math.round(daysLeft)} days left to complete`
      break
    default:
      return <></>
  }
  return (
    <Box {...boxProps}>
      {status === FORM_STATUS.daysLeft ? (
        <Icon name={'CalendarToday'} fill={theme.colors.icon.link} width={20} height={20} />
      ) : null}
      <TextView variant="LabelTag" {...textProps}>
        {text}
      </TextView>
    </Box>
  )
}

export default FormsCardItemTag

import { Box, BoxProps, TextView, VAIcon, VAIconProps } from 'components'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { RefillStatus, RefillStatusConstants } from 'store/api/types'
import { useTheme } from 'utils/hooks'

export type RefillTagProps = {
  status: RefillStatus
}

const RefillTag: FC<RefillTagProps> = ({ status }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  const infoIconProps: VAIconProps = {
    name: 'InfoIcon',
    fill: 'infoIcon',
    height: 16,
    width: 16,
    ml: 10,
  }

  const getTextColor = () => {
    switch (status) {
      case RefillStatusConstants.DELETED:
      case RefillStatusConstants.DISCONTINUED:
      case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
      case RefillStatusConstants.DISCONTINUED_EDIT:
      case RefillStatusConstants.EXPIRED:
      case RefillStatusConstants.NON_VERIFIED:
      case RefillStatusConstants.UNKNOWN:
      case RefillStatusConstants.ACTIVE:
      case RefillStatusConstants.REFILL_IN_PROCESS:
        return 'primaryContrast'
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
      case RefillStatusConstants.SUSPENDED:
      case RefillStatusConstants.ACTIVE_PARKED:
        return 'primary'
      default:
        return 'primary'
    }
  }

  const getTagColor = () => {
    switch (status) {
      case RefillStatusConstants.ACTIVE:
        return 'tagActive'
      case RefillStatusConstants.DELETED:
      case RefillStatusConstants.DISCONTINUED:
      case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
      case RefillStatusConstants.DISCONTINUED_EDIT:
      case RefillStatusConstants.EXPIRED:
      case RefillStatusConstants.NON_VERIFIED:
      case RefillStatusConstants.UNKNOWN:
        return 'tagExpired'
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
      case RefillStatusConstants.SUSPENDED:
      case RefillStatusConstants.ACTIVE_PARKED:
        return 'tagSuspended'
      case RefillStatusConstants.REFILL_IN_PROCESS:
        return 'tagInProgress'
    }
  }

  const getTagText = () => {
    switch (status) {
      case RefillStatusConstants.ACTIVE:
        return t('prescription.history.tag.active')
      case RefillStatusConstants.DISCONTINUED:
      case RefillStatusConstants.DISCONTINUED_BY_PROVIDER:
      case RefillStatusConstants.DISCONTINUED_EDIT:
        return t('prescription.history.tag.discontinued')
      case RefillStatusConstants.EXPIRED:
        return t('prescription.history.tag.expired')
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
        return t('prescription.history.tag.active.hold')
      case RefillStatusConstants.SUSPENDED:
        return t('prescription.history.tag.active.suspended')
      case RefillStatusConstants.ACTIVE_PARKED:
        return t('prescription.history.tag.active.parked')
      case RefillStatusConstants.REFILL_IN_PROCESS:
        return t('prescription.history.tag.active.inProgress')
      case RefillStatusConstants.DELETED:
      case RefillStatusConstants.NON_VERIFIED:
      case RefillStatusConstants.UNKNOWN:
        return t('prescription.history.tag.unknown')
    }
  }

  const tagBoxProps: BoxProps = {
    minWidth: theme.dimensions.tagMinWidth,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: 4,
    backgroundColor: getTagColor(),
    alignItems: 'center',
  }

  return (
    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
      <Box {...tagBoxProps}>
        <TextView variant={'MobileBodyBold'} color={getTextColor()} flexWrap={'wrap'} px={theme.dimensions.tagHorizontalPadding} pt={theme.dimensions.tagTopPadding}>
          {getTagText()}
        </TextView>
      </Box>
      <VAIcon {...infoIconProps} />
    </Box>
  )
}

export default RefillTag

import { Box, BoxProps, TextView, VAIcon, VAIconProps } from 'components'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { RefillStatus, RefillStatusConstants } from 'store/api/types'
import { getTextForRefillStatus } from 'utils/prescriptions'
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
      case RefillStatusConstants.UNKNOWN:
      case RefillStatusConstants.ACTIVE:
      case RefillStatusConstants.REFILL_IN_PROCESS:
      case RefillStatusConstants.TRANSFERRED:
        return 'primaryContrast'
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
      case RefillStatusConstants.SUSPENDED:
      case RefillStatusConstants.ACTIVE_PARKED:
      case RefillStatusConstants.NON_VERIFIED:
      case RefillStatusConstants.SUBMITTED:
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
      case RefillStatusConstants.UNKNOWN:
      case RefillStatusConstants.TRANSFERRED:
        return 'tagExpired'
      case RefillStatusConstants.HOLD:
      case RefillStatusConstants.PROVIDER_HOLD:
      case RefillStatusConstants.SUSPENDED:
      case RefillStatusConstants.ACTIVE_PARKED:
      case RefillStatusConstants.NON_VERIFIED:
      case RefillStatusConstants.SUBMITTED:
        return 'tagSuspended'
      case RefillStatusConstants.REFILL_IN_PROCESS:
        return 'tagInProgress'
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
        <TextView variant={'MobileBodyBold'} color={getTextColor()} flexWrap={'wrap'} px={10} pt={3}>
          {getTextForRefillStatus(status, t)?.toUpperCase()}
        </TextView>
      </Box>
      <VAIcon {...infoIconProps} />
    </Box>
  )
}

export default RefillTag

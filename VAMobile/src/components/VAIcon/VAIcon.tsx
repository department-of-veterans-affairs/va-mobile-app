import { AppState, AppStateStatus } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { isFinite } from 'underscore'
import React, { FC, useEffect } from 'react'

import { VAIconColors, VATextColors } from 'styles/theme'
import { useAppDispatch, useFontScale, useTheme } from 'utils/hooks'

import { Box, BoxProps } from 'components'
// New svgs need to set `fill` to `#000` and `stroke` to `#00F`. See /svgs for examples
// Navigation
import BenefitsSelected from './svgs/navIcon/benefitsSelected.svg'
import BenefitsUnselected from './svgs/navIcon/benefitsUnselected.svg'
import HealthSelected from './svgs/navIcon/healthSelected.svg'
import HealthUnselected from './svgs/navIcon/healthUnselected.svg'
import HomeSelected from './svgs/navIcon/homeSelected.svg'
import HomeUnselected from './svgs/navIcon/homeUnselected.svg'
import PaymentsSelected from './svgs/navIcon/paymentsSelected.svg'
import PaymentsUnselected from './svgs/navIcon/paymentsUnselected.svg'
import ProfileSelected from './svgs/navIcon/profileSelected.svg'
import ProfileUnselected from './svgs/navIcon/profileUnselected.svg'

// Arrows
import ArrowDown from './svgs/chevron-down.svg'
import ArrowLeft from './svgs/chevron-left.svg'
import ArrowRight from './svgs/chevron-right.svg'
import ArrowUp from './svgs/chevron-up.svg'

// forces icons

import Airforce from './svgs/dodBranch/air-force.svg'
import Army from './svgs/dodBranch/army.svg'
import CoastGuard from './svgs/dodBranch/coast-guard.svg'
import Marines from './svgs/dodBranch/marine.svg'
import Navy from './svgs/dodBranch/navy.svg'

// Links
import Calendar from './svgs/links/calendar.svg'
import Chat from './svgs/links/chat.svg'
import Directions from './svgs/links/directions.svg'
import ExternalLink from './svgs/links/circle_external_link.svg'
import Phone from './svgs/links/phone.svg'
import PhoneTTY from './svgs/links/phone-tty.svg'
import RightArrowInCircle from './svgs/links/right-arrow-blue-circle.svg'
import Text from './svgs/links/text.svg'

// Webview
import WebviewBack from './svgs/webview/chevron-left-solid.svg'
import WebviewForward from './svgs/webview/chevron-right-solid.svg'
import WebviewOpen from './svgs/webview/external-link-alt-solid.svg'
import WebviewRefresh from './svgs/webview/redo-solid.svg'

// VASelector
import DisabledRadio from './svgs/radio/radioDisabled.svg'
import EmptyCheckBox from './svgs/checkbox/checkBoxEmpty.svg'
import EmptyRadio from './svgs/radio/radioEmpty.svg'
import ErrorCheckBox from './svgs/checkbox/checkBoxError.svg'
import FilledCheckBox from './svgs/checkbox/checkBoxFilled.svg'
import FilledRadio from './svgs/radio/radioFilled.svg'
import IntermediateCheckBox from './svgs/checkbox/checkBoxIntermediate.svg'

// white icons with changeable filled circle
import WhiteCheckCircle from './svgs/circleWhiteIcon/white-check-circle.svg'
import WhiteCloseCircle from './svgs/circleWhiteIcon/white-close-circle.svg'

// Misc

import { AccessibilityState } from 'store/slices'
import { RootState } from 'store'
import { updateFontScale } from 'utils/accessibility'
import { useSelector } from 'react-redux'
import Add from './svgs/add.svg'
import BuildingSolid from './svgs/buildingSolid.svg'
import Bullet from './svgs/bullet.svg'
import CheckMark from './svgs/check-mark.svg'
import CircleCheckMark from './svgs/checkmark-in-circle.svg'
import Compose from './svgs/compose.svg'
import Delete from './svgs/delete.svg'
import EllipsisSolid from './svgs/ellipsisSolid.svg'
import ExclamationTriangleSolid from './svgs/exclamationTriangleSolid.svg'
import FolderSolid from './svgs/folder-solid.svg'
import InboxSolid from './svgs/inbox-solid.svg'
import InfoIcon from './svgs/info-circle.svg'
import Lock from './svgs/webview/lock-solid.svg'
import Logo from './svgs/vaParentLogo/logo.svg'
import Minus from './svgs/minus.svg'
import PaperClip from './svgs/paperClip.svg'
import PhoneSolid from './svgs/phoneSolid.svg'
import PickerArrows from './svgs/picker-arrows.svg'
import QuestionMark from './svgs/questionMark.svg'
import Remove from './svgs/remove.svg'
import Reply from './svgs/reply.svg'
import Save from './svgs/folder-medical-solid.svg'
import TrashSolid from './svgs/trash-solid.svg'
import Truck from './svgs/truck.svg'
import UnreadIcon from './svgs/unread_icon.svg'
import VideoCamera from './svgs/videoCamera.svg'

export const VA_ICON_MAP = {
  ArrowDown,
  Bullet,
  CheckMark,
  CircleCheckMark,
  FilledCheckBox,
  // Done ^
  HomeSelected,
  HomeUnselected,
  HealthSelected,
  HealthUnselected,
  BenefitsSelected,
  BenefitsUnselected,
  ProfileSelected, // SKIPPED FOR UPDATE FIRST PASS DUE TO BEING TEST ICON
  ProfileUnselected, // REMOVE, Not used
  PaymentsSelected,
  PaymentsUnselected,
  Add,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Airforce,
  Army,
  Calendar,
  Compose,
  CoastGuard,
  Delete,
  Directions,
  EmptyCheckBox,
  IntermediateCheckBox,
  FolderSolid,
  EmptyRadio,
  EllipsisSolid,
  FilledRadio,
  DisabledRadio,
  Marines,
  Minus,
  Navy,
  PaperClip,
  Phone,
  PhoneTTY,
  Chat,
  Text,
  RightArrowInCircle,
  Reply,
  WebviewBack,
  WebviewForward,
  WebviewOpen,
  WebviewRefresh,
  Lock,
  PickerArrows,
  Logo,
  ErrorCheckBox,
  QuestionMark,
  Remove,
  UnreadIcon,
  VideoCamera,
  PhoneSolid,
  ExclamationTriangleSolid,
  TrashSolid,
  InboxSolid,
  BuildingSolid,
  InfoIcon,
  WhiteCheckCircle,
  WhiteCloseCircle,
  Truck,
  ExternalLink,
  Save,
}
/**
 *  Props that need to be passed in to {@link VAIcon}
 */
export type VAIconProps = BoxProps & {
  /**  enum name of the icon to use {@link VA_ICON_MAP} **/
  name: keyof typeof VA_ICON_MAP

  /** Fill color for the icon */
  fill?: keyof VAIconColors | keyof VATextColors | string

  /** Stroke color of the icon */
  stroke?: keyof VAIconColors | string

  /**  optional number use to set the width; otherwise defaults to svg's width */
  width?: number

  /**  optional number use to set the height; otherwise defaults to svg's height */
  height?: number

  /** optional boolean that prevents the icon from being scaled when set to true */
  preventScaling?: boolean
}

/**
 * A common component to display assets(svgs). Svgs need to place in VAIcon/svgs folder. Set fill to #000 and stroke to #00F in the svg so VAIcon component can set the fill/stroke color. Examples/details can be found in VAIcon component.
 *
 * @returns VAIcon component
 */
const VAIcon: FC<VAIconProps> = ({ name, width, height, fill, stroke, preventScaling, ...boxProps }) => {
  const theme = useTheme()
  const fs: (val: number) => number = useFontScale()
  const dispatch = useAppDispatch()
  const { fontScale } = useSelector<RootState, AccessibilityState>((state) => state.accessibility)
  let iconProps = Object.create({ name, width, height, stroke, preventScaling, fill })

  useEffect(() => {
    // Listener for the current app state, updates the font scale when app state is active and the font scale has changed
    const sub = AppState.addEventListener('change', (newState: AppStateStatus): void => updateFontScale(newState, fontScale, dispatch))
    return (): void => sub.remove()
  }, [dispatch, fontScale])

  if (fill) {
    iconProps = Object.assign({}, iconProps, { fill: theme.colors.icon[fill as keyof VAIconColors] || theme.colors.text[fill as keyof VATextColors] || fill })
  }

  if (stroke) {
    iconProps = Object.assign({}, iconProps, { stroke: theme.colors.icon[stroke as keyof VAIconColors] || stroke })
  }

  const Icon: FC<SvgProps> | undefined = VA_ICON_MAP[name]
  if (!Icon) {
    return <></>
  }

  if (width && isFinite(width)) {
    iconProps = Object.assign({}, iconProps, { width: preventScaling ? width : fs(width) })
  }

  if (height && isFinite(height)) {
    iconProps = Object.assign({}, iconProps, { height: preventScaling ? height : fs(height) })
  }

  return (
    <Box {...boxProps}>
      <Icon {...iconProps} />
    </Box>
  )
}

export default VAIcon

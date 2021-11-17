import { AppState, AppStateStatus } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { isFinite } from 'underscore'
import React, { FC, useEffect } from 'react'

import { VAIconColors } from 'styles/theme'
import { useFontScale, useTheme } from 'utils/hooks'

import { Box, BoxProps } from 'components'
// New svgs need to set `fill` to `#000` and `stroke` to `#00F`. See /svgs for examples
// Navigation
import ClaimsSelected from './svgs/navIcon/claimsSelected.svg'
import ClaimsUnselected from './svgs/navIcon/claimsUnselected.svg'
import HealthSelected from './svgs/navIcon/healthSelected.svg'
import HealthUnselected from './svgs/navIcon/healthUnselected.svg'
import HomeSelected from './svgs/navIcon/homeSelected.svg'
import HomeUnselected from './svgs/navIcon/homeUnselected.svg'
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

// Misc
import { AccessibilityState, StoreState } from 'store/reducers'
import { updateFontScale } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'
import Bullet from './svgs/bullet.svg'
import CheckMark from './svgs/check-mark.svg'
import CircleCheckMark from './svgs/checkmark-in-circle.svg'
import Compose from './svgs/compose.svg'
import DatePickerArrows from './svgs/date-picker-arrows.svg'
import Lock from './svgs/webview/lock-solid.svg'
import Logo from './svgs/vaParentLogo/logo.svg'
import PaperClip from './svgs/paperClip.svg'
import PhoneSolid from './svgs/phoneSolid.svg'
import QuestionMark from './svgs/questionMark.svg'
import Remove from './svgs/remove.svg'
import Reply from './svgs/reply.svg'
import UnreadIcon from './svgs/unread_icon.svg'
import VideoCamera from './svgs/videoCamera.svg'

export const VA_ICON_MAP = {
  HomeSelected,
  HomeUnselected,
  HealthSelected,
  HealthUnselected,
  ClaimsSelected,
  ClaimsUnselected,
  ProfileSelected,
  ProfileUnselected,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Airforce,
  Army,
  Bullet,
  Calendar,
  Compose,
  CircleCheckMark,
  CoastGuard,
  Directions,
  EmptyCheckBox,
  FilledCheckBox,
  EmptyRadio,
  FilledRadio,
  DisabledRadio,
  Marines,
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
  DatePickerArrows,
  CheckMark,
  Logo,
  ErrorCheckBox,
  QuestionMark,
  Remove,
  UnreadIcon,
  VideoCamera,
  PhoneSolid,
}
/**
 *  Props that need to be passed in to {@link VAIcon}
 */
export type VAIconProps = BoxProps & {
  /**  enum name of the icon to use {@link VA_ICON_MAP} **/
  name: keyof typeof VA_ICON_MAP

  /** Fill color for the icon */
  fill?: keyof VAIconColors | string

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
const VAIcon: FC<VAIconProps> = (props: VAIconProps) => {
  const theme = useTheme()
  let domProps = Object.create(props)
  const fs: (val: number) => number = useFontScale()
  const dispatch = useDispatch()
  const { fontScale } = useSelector<StoreState, AccessibilityState>((state) => state.accessibility)
  const { name, width, height, fill, stroke, preventScaling } = props

  useEffect(() => {
    // Listener for the current app state, updates the font scale when app state is active and the font scale has changed
    const sub = AppState.addEventListener('change', (newState: AppStateStatus): void => updateFontScale(newState, fontScale, dispatch))
    return (): void => sub.remove()
  }, [dispatch, fontScale])

  if (fill) {
    domProps = Object.assign({}, domProps, { fill: theme.colors.icon[fill as keyof VAIconColors] || fill })
  }

  if (stroke) {
    domProps = Object.assign({}, domProps, { stroke: theme.colors.icon[stroke as keyof VAIconColors] || stroke })
  }

  const Icon: FC<SvgProps> | undefined = VA_ICON_MAP[name]
  if (!Icon) {
    return <></>
  }
  delete domProps.name

  if (width && isFinite(width)) {
    domProps = Object.assign({}, domProps, { width: preventScaling ? width : fs(width) })
  }

  if (height && isFinite(height)) {
    domProps = Object.assign({}, domProps, { height: preventScaling ? height : fs(height) })
  }

  return (
    <Box {...domProps}>
      <Icon {...domProps} />
    </Box>
  )
}

export default VAIcon

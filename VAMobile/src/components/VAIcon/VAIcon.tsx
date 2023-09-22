import { AppState, AppStateStatus } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { isFinite } from 'underscore'
import React, { FC, useEffect } from 'react'

import { AccessibilityState } from 'store/slices'
import { Box, BoxProps } from 'components'
import { RootState } from 'store'
import { VAIconColors, VATextColors } from 'styles/theme'
import { updateFontScale } from 'utils/accessibility'
import { useAppDispatch, useFontScale, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

// See VAIcon function documentation below for guidance on adding new SVGs

// Navigation
import BenefitsSelected from './svgs/navIcon/BenefitsSelected.svg'
import BenefitsUnselected from './svgs/navIcon/BenefitsUnselected.svg'
import HealthSelected from './svgs/navIcon/HealthSelected.svg'
import HealthUnselected from './svgs/navIcon/HealthUnselected.svg'
import HomeSelected from './svgs/navIcon/HomeSelected.svg'
import HomeUnselected from './svgs/navIcon/HomeUnselected.svg'
import PaymentsSelected from './svgs/navIcon/PaymentsSelected.svg'
import PaymentsUnselected from './svgs/navIcon/PaymentsUnselected.svg'
import ProfileSelected from './svgs/navIcon/ProfileSelected.svg'

// Chevrons
import ChevronDown from './svgs/ChevronDown.svg'
import ChevronLeft from './svgs/ChevronLeft.svg'
import ChevronRight from './svgs/ChevronRight.svg'
import ChevronUp from './svgs/ChevronUp.svg'

// Branch icons
import AirForce from './svgs/dodBranch/AirForce.svg'
import Army from './svgs/dodBranch/Army.svg'
import CoastGuard from './svgs/dodBranch/CoastGuard.svg'
import MarineCorps from './svgs/dodBranch/MarineCorps.svg'
import Navy from './svgs/dodBranch/Navy.svg'

// Links
import Calendar from './svgs/links/Calendar.svg'
import Chat from './svgs/links/Chat.svg'
import CircleExternalLink from './svgs/links/CircleExternalLink.svg'
import CirclePhone from './svgs/links/CirclePhone.svg'
import Directions from './svgs/links/Directions.svg'
import PhoneTTY from './svgs/links/PhoneTTY.svg'
import RightArrowInCircle from './svgs/links/right-arrow-blue-circle.svg'
import Text from './svgs/links/Text.svg'

// VASelector
import CheckBoxEmpty from './svgs/checkbox/CheckBoxEmpty.svg'
import CheckBoxError from './svgs/checkbox/CheckBoxError.svg'
import CheckBoxFilled from './svgs/checkbox/CheckBoxFilled.svg'
import CheckBoxIntermediate from './svgs/checkbox/CheckBoxIntermediate.svg'
import RadioEmpty from './svgs/radio/RadioEmpty.svg'
import RadioFilled from './svgs/radio/RadioFilled.svg'

// Misc
import Add from './svgs/Add.svg'
import Building from './svgs/Building.svg'
import Bullet from './svgs/Bullet.svg'
import CheckMark from './svgs/CheckMark.svg'
import CircleCheckMark from './svgs/CircleCheckMark.svg'
import Compose from './svgs/Compose.svg'
import Ellipsis from './svgs/Ellipsis.svg'
import ExclamationTriangle from './svgs/ExclamationTriangle.svg'
import ExternalLink from './svgs/ExternalLink.svg'
import Folder from './svgs/Folder.svg'
import Inbox from './svgs/Inbox.svg'
import Info from './svgs/Info.svg'
import Lock from './svgs/Lock.svg'
import Logo from './svgs/vaParentLogo/Logo.svg'
import Minus from './svgs/Minus.svg'
import PaperClip from './svgs/PaperClip.svg'
import Phone from './svgs/Phone.svg'
import QuestionMark from './svgs/QuestionMark.svg'
import Redo from './svgs/Redo.svg'
import Remove from './svgs/Remove.svg'
import Reply from './svgs/Reply.svg'
import Sort from './svgs/Sort.svg'
import Trash from './svgs/Trash.svg'
import Truck from './svgs/Truck.svg'
import Unread from './svgs/Unread.svg'
import UploadPhoto from './svgs/UploadPhoto.svg'
import VideoCamera from './svgs/VideoCamera.svg'

export const VA_ICON_MAP = {
  Add,
  AirForce,
  Army,
  BenefitsSelected,
  BenefitsUnselected,
  Building,
  Bullet,
  Calendar,
  Chat,
  CheckBoxEmpty,
  CheckBoxError,
  CheckBoxFilled,
  CheckBoxIntermediate,
  CheckMark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheckMark,
  CircleExternalLink,
  CirclePhone,
  CoastGuard,
  Compose,
  Directions,
  Ellipsis,
  ExclamationTriangle,
  ExternalLink,
  Folder,
  HealthSelected,
  HealthUnselected,
  HomeSelected,
  HomeUnselected,
  Inbox,
  Info,
  Lock,
  Logo,
  MarineCorps,
  Minus,
  Navy,
  PaperClip,
  PaymentsSelected,
  PaymentsUnselected,
  Phone,
  PhoneTTY,
  ProfileSelected,
  QuestionMark,
  RadioEmpty, // Also used for RadioDisabled content--same icon, different colors
  RadioFilled,
  Redo,
  Remove,
  Reply,
  RightArrowInCircle, // TODO: Ticket 3402 (or separate implementation ticket) to remove this icon
  Sort,
  Text,
  Trash,
  Truck,
  Unread,
  UploadPhoto,
  VideoCamera,
}

/**
 *  Props that need to be passed in to {@link VAIcon}
 */
export type VAIconProps = BoxProps & {
  /**  enum name of the icon to use {@link VA_ICON_MAP} **/
  name: keyof typeof VA_ICON_MAP

  /** Fill color for the icon */
  fill?: keyof VAIconColors | keyof VATextColors | string

  /** Secondary fill color for duotone icons--fills icons inside main fill, defaults white */
  fill2?: keyof VAIconColors | keyof VATextColors | string

  /** Stroke color of the icon */
  stroke?: keyof VAIconColors | string

  /**  optional number use to set the width; otherwise defaults to svg's width */
  width?: number

  /**  optional number use to set the height; otherwise defaults to svg's height */
  height?: number

  /** optional boolean that prevents the icon from being scaled when set to true */
  preventScaling?: boolean

  /** Optional TestID */
  testID?: string
}

/**
 * A common component to display assets (SVGs).
 *
 * For all icons in the SVG definitions, on the primary/only path:
 *    - Set `fill` to `#000` to inherit VAIcon's fill color prop
 * If the SVG icon is duotone, additionally:
 *    - Set `color` to `#fff` on the top level svg (not path)
 *    - Set `fill` to `currentColor` on the secondary path to inherit VAIcon's fill2 color prop
 * If the SVG icon uses stroke, additionally:
 *    - Set `stroke` to `#00F` to inherit VAIcon's stroke color prop
 *
 * Example icons of each classification:
 *    - One layer: HomeSelected.svg
 *    - Duotone: CircleCheckMark.svg
 *    - Stroke: RadioEmpty.svg
 *
 * @returns VAIcon component
 */
const VAIcon: FC<VAIconProps> = ({ name, width, height, fill, fill2, stroke, preventScaling, testID, ...boxProps }) => {
  const theme = useTheme()
  const fs: (val: number) => number = useFontScale()
  const dispatch = useAppDispatch()
  const { fontScale } = useSelector<RootState, AccessibilityState>((state) => state.accessibility)
  let iconProps = Object.create({ name, width, height, stroke, preventScaling, fill })

  useEffect(() => {
    // Listener for the current app state, updates the font scale when app state is active and the font scale has changed
    const sub = AppState.addEventListener('change', (newState: AppStateStatus): void => updateFontScale(newState, fontScale, dispatch))
    return (): void => sub?.remove()
  }, [dispatch, fontScale])

  if (fill) {
    iconProps = Object.assign({}, iconProps, { fill: theme.colors.icon[fill as keyof VAIconColors] || theme.colors.text[fill as keyof VATextColors] || fill })
  }

  if (fill2) {
    iconProps = Object.assign({}, iconProps, { color: theme.colors.icon[fill2 as keyof VAIconColors] || theme.colors.text[fill2 as keyof VATextColors] || fill2 })
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
    <Box testID={testID} {...boxProps}>
      <Icon {...iconProps} />
    </Box>
  )
}

export default VAIcon

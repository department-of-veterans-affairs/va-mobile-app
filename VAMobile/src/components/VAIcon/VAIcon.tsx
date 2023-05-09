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

// SVGs should have `fill` set to `#000`. If `stroke` is used, set to `#00F`. See existing icons for guidance.

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
import CheckBoxFilled from './svgs/checkbox/CheckBoxFilled.svg'
import DisabledRadio from './svgs/radio/radioDisabled.svg'
import EmptyCheckBox from './svgs/checkbox/checkBoxEmpty.svg'
import EmptyRadio from './svgs/radio/radioEmpty.svg'
import ErrorCheckBox from './svgs/checkbox/checkBoxError.svg'
import FilledRadio from './svgs/radio/radioFilled.svg'
import IntermediateCheckBox from './svgs/checkbox/checkBoxIntermediate.svg'

// Misc

import Add from './svgs/Add.svg'
import BuildingSolid from './svgs/buildingSolid.svg'
import Bullet from './svgs/Bullet.svg'
import CheckMark from './svgs/CheckMark.svg'
import CircleCheckMark from './svgs/CircleCheckMark.svg'
import Compose from './svgs/Compose.svg'
import EllipsisSolid from './svgs/ellipsisSolid.svg'
import ExclamationTriangleSolid from './svgs/exclamationTriangleSolid.svg'
import ExternalLink from './svgs/ExternalLink.svg'
import FolderSolid from './svgs/folder-solid.svg'
import InboxSolid from './svgs/inbox-solid.svg'
import Info from './svgs/Info.svg'
import Lock from './svgs/Lock.svg'
import Logo from './svgs/vaParentLogo/Logo.svg'
import Minus from './svgs/Minus.svg'
import PaperClip from './svgs/PaperClip.svg'
import Phone from './svgs/Phone.svg'
import PickerArrows from './svgs/picker-arrows.svg'
import QuestionMark from './svgs/QuestionMark.svg'
import Redo from './svgs/Redo.svg'
import Remove from './svgs/Remove.svg'
import Reply from './svgs/Reply.svg'
import Save from './svgs/folder-medical-solid.svg'
import TrashSolid from './svgs/trash-solid.svg'
import Truck from './svgs/Truck.svg'
import Unread from './svgs/Unread.svg'
import VideoCamera from './svgs/VideoCamera.svg'
import WhiteCircleCheckMark from './svgs/WhiteCircleCheckMark.svg'
import WhiteRemove from './svgs/WhiteRemove.svg'

/**
 * Process for each icon:
 *   1. Update .svg file from spreadsheet
 *      1.5 Update fill from 'black' to '#000'
 *   2. Check if VAIcon name should change
 *   3. If so, update calling places (SAVE as you go)
 *   4. Check if SVG name should change
 *   5. If so, update file name, VAIcon import, and doc site file name/import
 *   6. Move icon up to the 'Done' section in alphabetical order
 *   7. If file name was case-only change, add `// Needs case fix` tag to remedy w/ Git
 *   8. Add any other notes if appropriate
 *   9. Update Home screen to icon and load app
 *   10. Check light/dark mode
 *   11. Inspect sizing good
 *   12. Spot check an actual place the icon is used that it looks good
 */

export const VA_ICON_MAP = {
  Add,
  AirForce,
  Army,
  BenefitsSelected,
  BenefitsUnselected,
  Bullet,
  Calendar,
  Chat,
  CheckBoxFilled,
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
  ExternalLink,
  HealthSelected,
  HealthUnselected,
  HomeSelected,
  HomeUnselected,
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
  PhoneTTY, // Design ?: should we simplify? Very small icon for "keyboard" on it
  ProfileSelected,
  QuestionMark, // Needs case fix
  Redo,
  Remove,
  Reply, // Needs case fix
  RightArrowInCircle, // SVG-only update, TODO: ticket 3402 (or separate implementation ticket) to remove this icon
  Text,
  Truck, // Needs case fix
  Unread,
  VideoCamera, // Needs case fix
  WhiteCircleCheckMark, // TODO: Combine with CircleCheckMark on follow-up ticket to enhance VAIcon for 2 fills
  WhiteRemove, // TODO: Combine with Remove on follow-up ticket to enhance VAIcon for 2 fills
  // Done ^
  EmptyCheckBox,
  IntermediateCheckBox,
  FolderSolid,
  EmptyRadio,
  EllipsisSolid,
  FilledRadio,
  DisabledRadio,
  PickerArrows, // RENAME TO 'Sort'
  ErrorCheckBox,
  ExclamationTriangleSolid,
  TrashSolid,
  InboxSolid,
  BuildingSolid,
  Save, // Design ?: What's the deal with this being a medical folder?
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

  /** Optional TestID */
  testID?: string
}

/**
 * A common component to display assets (SVGs).
 * In the SVG definitions, on the path:
 *    - Set `fill` to `#000` to inherit VAIcon's fill color prop
 *    - If `stroke` is used (uncommon), set to `#00F` to inherit VAIcon's stroke color prop
 *    - See existing icons for guidance
 *
 * @returns VAIcon component
 */
const VAIcon: FC<VAIconProps> = ({ name, width, height, fill, stroke, preventScaling, testID, ...boxProps }) => {
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
    <Box testID={testID} {...boxProps}>
      <Icon {...iconProps} />
    </Box>
  )
}

export default VAIcon

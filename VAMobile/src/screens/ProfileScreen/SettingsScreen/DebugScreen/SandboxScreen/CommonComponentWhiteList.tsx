import { BooleanOptions, ChildrenOptions, OnPressOptions, VABorderColorOptions, VAColorsOptions, VATextAndButtonColorOptions, objectToPickerOptions } from './PickerOptions'
import { ButtonTypesConstants, LabelTagTypeConstants, LinkTypeOptionsConstants, LinkUrlIconType } from 'components'
import { getTheme } from 'styles/themes/standardTheme'

const standardTheme = getTheme()

export type PropOptionObjectValueType = string | boolean | undefined | object
export type PropOptionObject = {
  label: string
  options: Array<{ label: string; value: PropOptionObjectValueType }>
}
export type PropOptionType = string | PropOptionObject
export type CommonComponentWhiteListProps = {
  [key: string]: {
    defaultProps: {
      [key: string]: string | boolean | undefined | object
    }
    propOptions: Array<PropOptionType>
  }
}

const CommonComponentWhiteList: CommonComponentWhiteListProps = {
  VAButton: {
    defaultProps: {
      onPress: OnPressOptions.DEFAULT,
      label: 'Label',
      buttonType: ButtonTypesConstants.buttonPrimary,
    },
    propOptions: ['label', { label: 'buttonType', options: objectToPickerOptions(ButtonTypesConstants) }],
  },
  AlertBox: {
    defaultProps: {
      border: standardTheme.colors.border.primary,
      title: 'title',
      text: 'text',
      children: undefined,
    },
    propOptions: [{ label: 'border', options: VABorderColorOptions }, 'title', 'text', { label: 'children', options: ChildrenOptions }],
  },
  CollapsibleAlert: {
    defaultProps: {
      border: standardTheme.colors.border.primary,
      headerText: 'HeaderText',
      body: undefined,
      a11yLabel: '',
    },
    propOptions: [{ label: 'border', options: VABorderColorOptions }, 'headerText', { label: 'body', options: ChildrenOptions }],
  },
  CollapsibleView: {
    defaultProps: {
      text: 'text',
      textColor: 'primary',
      showInTextArea: false,
      contentInTextArea: false,
    },
    propOptions: [
      'text',
      { label: 'textColor', options: VATextAndButtonColorOptions },
      { label: 'children', options: ChildrenOptions },
      { label: 'showInTextArea', options: BooleanOptions },
      { label: 'contentInTextArea', options: BooleanOptions },
    ],
  },
  LoadingComponent: {
    defaultProps: {
      text: 'Loading...',
      justTheSpinnerIcon: false,
      spinnerColor: undefined, // only used in sync screen
    },
    propOptions: ['text', { label: 'justTheSpinnerIcon', options: BooleanOptions }, { label: 'spinnerColor', options: VAColorsOptions }],
  },
  ClickForActionLink: {
    defaultProps: {
      displayedText: 'DisplayText',
      linkType: LinkTypeOptionsConstants.url,
      linkUrlIconType: LinkUrlIconType.Chat,
      metaData: {},
    },
    propOptions: [
      'displayedText',
      { label: 'linkType', options: objectToPickerOptions(LinkTypeOptionsConstants, true) },
      { label: 'linkUrlIconType', options: objectToPickerOptions(LinkUrlIconType, true) },
    ],
  },
  LabelTag: {
    defaultProps: {
      text: 'Tag',
      labelType: LabelTagTypeConstants.tagBlue,
      onPress: OnPressOptions.DEFAULT,
    },
    propOptions: [
      'text',
      { label: 'labelType', options: objectToPickerOptions(LabelTagTypeConstants, true) },
      {
        label: 'onPress',
        options: [
          { label: 'icon', value: OnPressOptions.DEFAULT },
          { label: 'noIcon', value: OnPressOptions.NONE },
        ],
      },
    ],
  },
}

export default CommonComponentWhiteList

"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1298],{38909:function(e,n,t){t.d(n,{Z:function(){return m}});var o=t(67294),i=t(19055),l=t(26396),r=t(58215),a=t(82224),s=t(36005),c=function(e){var n=e.props;return n?o.createElement(o.Fragment,null,s.ZP.isEmpty(n)?o.createElement("pre",{className:"preText"},"This component does not have props defined"):o.createElement("table",null,o.createElement("thead",null,o.createElement("tr",null,o.createElement("th",null,"Name"),o.createElement("th",null,"Type"),o.createElement("th",null,"Default Value"),o.createElement("th",null,"Required"),o.createElement("th",null,"Description"))),o.createElement("tbody",null,Object.keys(n).map((function(e){var t;return o.createElement("tr",{key:e},o.createElement("td",null,o.createElement("code",null,e)),o.createElement("td",{style:{minWidth:200}},null==(t=n[e].type)?void 0:t.name),o.createElement("td",null,n[e].defaultValue&&n[e].defaultValue.value.toString()),o.createElement("td",null,n[e].required?"Yes":"No"),o.createElement("td",null,n[e].description))}))))):null};function m(e){var n=(0,a.N)(e.componentName)[0],t=n.description,s=n.displayName,m=n.props,p="How to use the "+s+" component",d="Full code for the "+s+" component";return o.createElement(o.Fragment,null,t,o.createElement("br",null),o.createElement("br",null),o.createElement(l.Z,null,o.createElement(r.Z,{value:"props",label:"Properties"},o.createElement(c,{props:m})),o.createElement(r.Z,{value:"example",label:"Example"},e.example&&o.createElement(i.Z,{title:p,className:"language-tsx test"},e.example)),o.createElement(r.Z,{value:"code",label:"Source Code"},e.codeString&&o.createElement(i.Z,{title:d,className:"language-tsx"},e.codeString)),o.createElement(r.Z,{value:"accessibility",label:"Accessibility"},o.createElement("pre",{className:"preText"},e.accessibilityInfo))))}},69832:function(e,n,t){t.r(n),t.d(n,{contentTitle:function(){return c},default:function(){return g},exampleString:function(){return d},frontMatter:function(){return s},metadata:function(){return m},toc:function(){return p}});var o=t(87462),i=t(63366),l=(t(67294),t(3905)),r=(t(19055),t(38909)),a=["components"],s={},c=void 0,m={unversionedId:"Engineering/FrontEnd/ComponentsSection/Tabs/SegmentedControl",id:"Engineering/FrontEnd/ComponentsSection/Tabs/SegmentedControl",title:"SegmentedControl",description:"export const exampleString = `<SegmentedControl",source:"@site/docs/Engineering/FrontEnd/ComponentsSection/Tabs/SegmentedControl.mdx",sourceDirName:"Engineering/FrontEnd/ComponentsSection/Tabs",slug:"/Engineering/FrontEnd/ComponentsSection/Tabs/SegmentedControl",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Tabs/SegmentedControl",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Pagination",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Navigation/Pagination"},next:{title:"LabelTag",permalink:"/va-mobile-app/docs/Engineering/FrontEnd/ComponentsSection/Tags/LabelTag"}},p=[],d="<SegmentedControl \nvalues={[1, 2, 3, 4] \ntitles={['One', 'Two', 'Three', 'Four'] \nonChange={doSomething(selection: string)} />\n\n<SegmentedControl \nvalues={['a', 'b'] \ntitles={['Alpha', 'Bravo'] \nonChange={doSomething(selection: string)} \nselected={1} />",u={toc:p,exampleString:d};function g(e){var n=e.components,t=(0,i.Z)(e,a);return(0,l.kt)("wrapper",(0,o.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)(r.Z,{componentName:"SegmentedControl",example:d,codeString:"import { useTranslation } from 'react-i18next'\nimport React, { FC, useEffect } from 'react'\nimport styled from 'styled-components'\n\nimport { NAMESPACE } from '../constants/namespaces'\nimport { TouchableOpacity } from 'react-native'\nimport { a11yHintProp, a11yValueProp, testIdProps } from 'utils/accessibility'\nimport { themeFn } from '../utils/theme'\nimport Box, { BoxProps } from './Box'\nimport TextView from './TextView'\n\n/**\n * Signifies the props to send into the {@link SegmentedControl}\n */\nexport type ToggleButtonProps = {\n  /** function to call when the selected value has changed */\n  onChange: (selection: string) => void\n  /** The values to signify selection options */\n  values: string[]\n  /** the text to display in the selection option UI */\n  titles: string[]\n  /** the index of the currently selected item. used to set initial state  */\n  selected: number\n  /** optional list of accessibility hints, ordering dependent on values/titles ordering */\n  accessibilityHints?: string[]\n}\n\ntype ButtonContainerProps = {\n  /** lets the component know if it is selected */\n  isSelected: boolean\n  /** width percent of parent for the component */\n  widthPct: string\n}\n\nconst ButtonContainer = styled(TouchableOpacity)<ButtonContainerProps>`\n  border-radius: 8px;\n  padding-vertical: 7px;\n  width: ${themeFn<ButtonContainerProps>((theme, props) => props.widthPct)};\n  elevation: ${themeFn<ButtonContainerProps>((theme, props) => (props.isSelected ? 4 : 0))};\n  background-color: ${themeFn<ButtonContainerProps>((theme, props) =>\n    props.isSelected ? theme.colors.segmentedControl.buttonActive : theme.colors.segmentedControl.buttonInactive,\n  )};\n`\n/**A common component for filtering UI views by segments or lanes. Used for things like toggling between Active/Completed claims and Future/Past Appointments */\nconst SegmentedControl: FC<ToggleButtonProps> = ({ values, titles, onChange, selected, accessibilityHints }) => {\n  const { t } = useTranslation(NAMESPACE.COMMON)\n\n  useEffect(() => {\n    onChange(values[selected])\n  }, [selected, onChange, values])\n\n  const boxProps: BoxProps = {\n    flexDirection: 'row',\n    justifyContent: 'space-between',\n    backgroundColor: 'segmentedController',\n    p: 2,\n    borderRadius: 8,\n    alignSelf: 'baseline',\n    flexWrap: 'wrap',\n    accessibilityRole: 'tablist',\n  }\n\n  return (\n    <Box {...boxProps}>\n      {values.map((value, index) => {\n        const isSelected = selected === index\n\n        return (\n          <ButtonContainer\n            onPress={(): void => onChange(values[index])}\n            isSelected={isSelected}\n            key={index}\n            widthPct={`${100 / values.length}%`}\n            {...testIdProps(value)}\n            {...a11yHintProp(accessibilityHints ? accessibilityHints[index] : '')}\n            {...a11yValueProp({ text: t('listPosition', { position: index + 1, total: values.length }) })}\n            accessibilityRole={'tab'}\n            accessibilityState={{ selected: selected === index }}>\n            <TextView\n              variant={selected === index ? 'MobileBodyBold' : 'MobileBody'}\n              textAlign=\"center\"\n              color={isSelected ? 'segmentControllerActive' : 'segmentControllerInactive'}\n              allowFontScaling={false}>\n              {titles[index]}\n            </TextView>\n          </ButtonContainer>\n        )\n      })}\n    </Box>\n  )\n}\n\nexport default SegmentedControl\n",mdxType:"ComponentTopInfo"}))}g.isMDXComponent=!0}}]);
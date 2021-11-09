import React from 'react'
import useGlobalData from '@docusaurus/useGlobalData'
import CodeBlock from '@theme/CodeBlock'
import Tabs from '@theme/Tabs'
import Accordion from 'react-bootstrap/Accordion'

import TabItem from '@theme/TabItem'

export const getGlobalDataForComponent = (componentName: string) => {
  const globalData = useGlobalData()
  const myPluginData = globalData['docusaurus-plugin-react-docgen-typescript']['default']
  return myPluginData.filter((component) => component.displayName === componentName)
}

const getComponentsProps = (propsObject) => {
  var tifOptions = Object.keys(propsObject).map(function (key, index) {
    const { defaultValue, description, name, required, type } = propsObject[key]
    return (
      // <Accordion.Item eventKey={index.toString()} key={index}>
      //   <Accordion.Header>
      //     <strong style={{ color: 'blue' }}>{name}</strong>&nbsp;&nbsp; {type.name}
      //   </Accordion.Header>
      //   <Accordion.Body>{description}</Accordion.Body>
      // </Accordion.Item>
      <details
        key={index}
        className={
          'isBrowser_node_modules-@docusaurus-theme-common-lib-components-Details-styles-module alert alert--info details_node_modules-@docusaurus-theme-classic-lib-next-theme-Details-styles-module alert-custom'
        }>
        <summary>{name}</summary>
        <div className={'collapsibleContent_node_modules-@docusaurus-theme-common-lib-components-Details-styles-module'}>
          <div>This is the detailed content</div>
        </div>
      </details>
    )
  })

  return <Accordion>{tifOptions}</Accordion>
}

export default function ComponentInfo(props): JSX.Element {
  const globaldata = getGlobalDataForComponent(props.componentName)
  const { description, displayName, props: ComponentProps } = globaldata[0]
  const howToUseString = `How to use the ${displayName} component`
  const fullCodeString = `Full code for the ${displayName} component`

  return (
    <>
      <Tabs>
        <TabItem value="description" label="Description">
          <p>{description}</p>
        </TabItem>
        <TabItem value="props" label="Props">
          {getComponentsProps(ComponentProps)}
        </TabItem>
        <TabItem value="example" label="Example">
          {props.example && (
            <CodeBlock title={howToUseString} className="language-tsx">
              {props.example}
            </CodeBlock>
          )}
        </TabItem>
        <TabItem value="code" label="Full Code Source">
          {props.codeString && (
            <CodeBlock title={fullCodeString} className="language-tsx">
              {props.codeString}
            </CodeBlock>
          )}
        </TabItem>
        <TabItem value="accessibility" label="Accessibility">
          {''}
        </TabItem>
      </Tabs>
    </>
  )
}

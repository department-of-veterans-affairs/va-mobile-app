import React from 'react'
import useGlobalData from '@docusaurus/useGlobalData'
import CodeBlock from '@theme/CodeBlock'
import Tabs from '@theme/Tabs'

import TabItem from '@theme/TabItem'

export const getGlobalDataForComponent = (componentName: string) => {
  const globalData = useGlobalData()
  const myPluginData = globalData['docusaurus-plugin-react-docgen-typescript']['default']
  return myPluginData.filter((component) => component.displayName === componentName)
}

const getComponentsProps = (propsObject) => {
  var tifOptions = Object.keys(propsObject).map(function (key) {
    const { defaultValue, description, name, required } = propsObject[key]
    return (
      <>
        <div>
          <p>
            <strong>Name: </strong>
            {name}
          </p>
          <p>
            <strong>Description: </strong>
            {description}
          </p>
        </div>
      </>
    )
  })

  return tifOptions
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

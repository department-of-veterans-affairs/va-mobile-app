import useGlobalData from '@docusaurus/useGlobalData'

export const getGlobalDataForComponent = (componentName: string) => {
  const globalData = useGlobalData()
  const myPluginData = globalData['docusaurus-plugin-react-docgen-typescript']['default']
  return myPluginData.filter((component) => component.displayName === componentName)
}

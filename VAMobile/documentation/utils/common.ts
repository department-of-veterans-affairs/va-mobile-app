import useGlobalData from '@docusaurus/useGlobalData'

export const useGlobalDataForComponent = (componentName: string): Record<string, any> => {
  const globalData = useGlobalData()
  const myPluginData = globalData['docusaurus-plugin-react-docgen-typescript']['default']
  return myPluginData.filter((component) => component.displayName === componentName)
}

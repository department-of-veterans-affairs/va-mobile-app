import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import React, { FC } from 'react'

import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { ListItemObj } from '../List'
import { NAMESPACE } from '../../constants/namespaces'
import { TextLine } from '../types'
import { useTranslation } from '../../utils/hooks'

export type FileListProps = {
  files: Array<ImagePickerResponse> | Array<DocumentPickerResponse>
}

const FileList: FC<FileListProps> = ({ files }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)

  // refactor renderFileNames to use a util and use that
  const textLines: Array<TextLine> = [{ text: t('vaccines.vaccineName'), variant: 'MobileBodyBold', color: 'primaryTitle' }]
  const listObjs: Array<ListItemObj> = files.map((file) => {
    return {}
  })

  return <></>
}

export default FileList

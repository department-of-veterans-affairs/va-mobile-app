import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { ButtonDecoratorType } from 'components/BaseListItem'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { TextLine } from 'components/types'
import { getA11yLabelText, getFileDisplay } from 'utils/common'
import { useDestructiveAlert } from 'utils/hooks'
import DefaultList, { DefaultListItemObj } from 'components/DefaultList'

export type FileListProps = {
  /** List of files to display */
  files: Array<ImagePickerResponse> | Array<DocumentPickerResponse>
  /** Called when the delete is confirmed */
  onDelete: (fileToDelete: ImagePickerResponse | DocumentPickerResponse) => void
}

const FileList: FC<FileListProps> = ({ files, onDelete }) => {
  const { t } = useTranslation(NAMESPACE.CLAIMS)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const deleteFileAlert = useDestructiveAlert()

  const listObjs: Array<DefaultListItemObj> = files.map((file) => {
    const { fileName, fileSize: formattedFileSize } = getFileDisplay(file, t, false)

    const textLines: Array<TextLine> = [{ text: fileName, variant: 'MobileBodyBold', color: 'primaryTitle' }, { text: formattedFileSize }]

    const fileButton: DefaultListItemObj = {
      textLines,
      a11yHintText: t('fileUpload.delete.a11yHint'),
      testId: getA11yLabelText(textLines),
      decorator: ButtonDecoratorType.Delete,
      onPress: () => {
        deleteFileAlert({
          title: tc('file.removeConfirm'),
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          buttons: [
            {
              text: tc('cancel'),
            },
            {
              text: tc('delete'),
              onPress: () => {
                onDelete(file)
              },
            },
          ],
        })
      },
    }

    return fileButton
  })

  return <DefaultList items={listObjs} />
}

export default FileList

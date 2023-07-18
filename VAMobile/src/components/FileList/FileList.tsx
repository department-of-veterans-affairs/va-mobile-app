import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { ButtonDecoratorType } from 'components/BaseListItem'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { TextLine } from 'components/types'
import { getA11yLabelText, getFileDisplay } from 'utils/common'
import { useDestructiveActionSheet } from 'utils/hooks'
import DefaultList, { DefaultListItemObj } from 'components/DefaultList'

export type FileListProps = {
  /** List of files to display */
  files: Array<ImagePickerResponse> | Array<DocumentPickerResponse>
  /** Called when the delete is confirmed */
  onDelete: (fileToDelete: ImagePickerResponse | DocumentPickerResponse) => void
}

const FileList: FC<FileListProps> = ({ files, onDelete }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const deleteFileAlert = useDestructiveActionSheet()

  const listObjs: Array<DefaultListItemObj> = files.map((file) => {
    const { fileName, fileSize: formattedFileSize, fileSizeA11y: fileSizeA11y } = getFileDisplay(file, t, false)

    const textLines: Array<TextLine> = [{ text: fileName, variant: 'MobileBodyBold' }, { text: formattedFileSize }]
    const textLinesA11y: Array<TextLine> = [{ text: fileName, variant: 'MobileBodyBold' }, { text: fileSizeA11y }]

    const fileButton: DefaultListItemObj = {
      textLines,
      a11yHintText: t('fileUpload.delete.a11yHint'),
      testId: getA11yLabelText(textLinesA11y),
      decorator: ButtonDecoratorType.Delete,
      onPress: () => {
        deleteFileAlert({
          title: t('file.removeFile'),
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          buttons: [
            {
              text: t('keep'),
            },
            {
              text: t('remove'),
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

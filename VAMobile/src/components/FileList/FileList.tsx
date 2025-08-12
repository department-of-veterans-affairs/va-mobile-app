import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { ButtonDecoratorType } from 'components/BaseListItem'
import DefaultList, { DefaultListItemObj } from 'components/DefaultList'
import { TextLine } from 'components/types'
import { NAMESPACE } from 'constants/namespaces'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { getA11yLabelText, getFileDisplay } from 'utils/common'
import { useShowActionSheet2 } from 'utils/hooks'

export type FileListProps = {
  /** List of files to display */
  files: Array<ImagePickerResponse> | Array<DocumentPickerResponse>
  /** Called when the delete is confirmed */
  onDelete: (fileToDelete: ImagePickerResponse | DocumentPickerResponse) => void
}

const FileList: FC<FileListProps> = ({ files, onDelete }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const deleteFileAlert2 = useShowActionSheet2()

  const listObjs: Array<DefaultListItemObj> = files.map((file) => {
    const { fileName, fileSize: formattedFileSize, fileSizeA11y: fileSizeA11y } = getFileDisplay(file, t, false)

    const textLines: Array<TextLine> = [{ text: fileName, variant: 'MobileBodyBold' }, { text: formattedFileSize }]
    const textLinesA11y: Array<TextLine> = [{ text: fileName, variant: 'MobileBodyBold' }, { text: fileSizeA11y }]

    const options = [t('remove'), t('keep')]

    const fileButton: DefaultListItemObj = {
      textLines,
      a11yHintText: t('fileUpload.delete.a11yHint'),
      testId: getA11yLabelText(textLinesA11y),
      decorator: ButtonDecoratorType.Delete,
      onPress: () => {
        deleteFileAlert2(
          {
            options,
            title: t('file.removeFile'),
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1,
          },
          (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                onDelete(file)
                break
            }
          },
        )
        // deleteFileAlert({
        //   title: t('file.removeFile'),
        //   destructiveButtonIndex: 1,
        //   cancelButtonIndex: 0,
        //   buttons: [
        //     {
        //       text: t('keep'),
        //     },
        //     {
        //       text: t('remove'),
        //       onPress: () => {
        //         onDelete(file)
        //       },
        //     },
        //   ],
        // })
      },
    }

    return fileButton
  })

  return <DefaultList items={listObjs} />
}

export default FileList

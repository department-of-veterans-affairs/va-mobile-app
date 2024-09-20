import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Dimensions, Pressable, StyleSheet } from 'react-native'
import { Asset } from 'react-native-image-picker'
import { SharedElement, SharedElementNode, SharedElementTransition } from 'react-native-shared-element'
import { Image } from 'react-native-svg'

import { useIsFocused } from '@react-navigation/native'

import _ from 'underscore'

import { ClaimData } from 'api/types'
import { Box, DefaultList, DefaultListItemObj, PhotoPreview, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type ClaimFilesProps = {
  claim: ClaimData
}

function ClaimFiles({ claim }: ClaimFilesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const isFocused = useIsFocused()
  const { attributes } = claim
  const events = attributes.eventsTimeline.filter(
    (event) => (event.filename && event.filename.length > 0) || (event.documents && event.documents.length > 0),
  )
  const asset: Asset = {
    fileName: 'E0656078-7D72-46C3-BBFC-06A66589AD8F.jpg',
    fileSize: 4589750,
    height: 3024,
    type: 'image/jpg',
    uri: 'file:///Users/dylannienberg/Library/Developer/CoreSimulator/Devices/80D47114-FFE2-46D6-80A2-F6635FB7F909/data/Containers/Data/Application/8054AD29-3179-4EC5-A704-6F6BC6E85E20/tmp/E0656078-7D72-46C3-BBFC-06A66589AD8F.jpg',
    width: 4032,
  }
  const [imagesList, setImagesList] = useState<Asset[]>([asset])
  const [progress, setProgress] = useState(new Animated.Value(0))
  const [isScene2Visible, setIsScene2Visible] = useState(false)
  const [isInProgress, setIsInProgress] = useState(false)
  const [scene2Ancestor, setScene2Ancestor] = useState<SharedElementNode | null>(null)
  const [scene2Node, setScene2Node] = useState<SharedElementNode | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [assetImage, setAssetImage] = useState<Asset | undefined>(undefined)
  const [assetIndex, setAssetIndex] = useState(0)

  const onPressNavigate = (asset: Asset, index: number) => {
    setIsScene2Visible(true)
    setIsInProgress(true)
    setAssetImage(asset)
    setAssetIndex(index)
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => setIsInProgress(false))
  }

  const onPressBack = () => {
    setIsInProgress(true)
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setIsScene2Visible(false)
      setIsInProgress(false)
    })
    setAssetImage(undefined)
  }

  const displayImages = (): ReactElement => {
    const { condensedMarginBetween, gutter } = theme.dimensions
    /** Need to subtract gutter margins and margins between pics before dividing screen width by 3 to get the width of each image*/
    const calculatedWidth = Dimensions.get('window').width

    const uploadedImages = (): ReactElement[] => {
      return _.map(imagesList || [], (asset, index) => {
        return (
          /** Rightmost photo doesn't need right margin b/c of gutter margins
           * Every 3rd photo, right margin is changed to zero*/
          <Box mt={condensedMarginBetween} mr={condensedMarginBetween} key={index}>
            <PhotoPreview
              width={calculatedWidth}
              height={calculatedWidth}
              image={asset}
              onDeleteCallback={() => {}}
              onPress={() => {
                onPressNavigate(asset, index)
              }}
              photoPosition={t(
                imagesList && imagesList?.length > 1 ? 'fileUpload.ofTotalPhotos' : 'fileUpload.ofTotalPhoto',
                {
                  photoNum: index + 1,
                  totalPhotos: imagesList?.length,
                },
              )}
            />
          </Box>
        )
      })
    }

    return (
      <Box display="flex" flexDirection="row" flexWrap="wrap" pl={gutter} pr={condensedMarginBetween}>
        {uploadedImages()}
      </Box>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.main,
    },
    scene: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      resizeMode: 'cover',
      width: Dimensions.get('window').width,
      height: 300,
      borderRadius: 0,
    },
  })

  const files = (): Array<DefaultListItemObj> => {
    const items: Array<DefaultListItemObj> = []

    _.forEach(events, (event) => {
      if (event.filename) {
        const textLines: TextLine[] = [{ text: event.filename, variant: 'MobileBodyBold' }]
        if (event.type) {
          textLines.push({ text: t('appointmentList.requestType', { type: event.type }) })
        }
        if (event.documentType) {
          textLines.push({ text: t('appointmentList.documentType', { type: event.documentType }) })
        }
        if (event.uploadDate) {
          textLines.push({ text: t('appointmentList.received', { date: formatDateMMMMDDYYYY(event.uploadDate) }) })
        }
        items.push({ textLines: textLines })
      } else {
        _.forEach(event.documents || [], (document) => {
          if (document.filename) {
            const textLines: TextLine[] = [{ text: document.filename, variant: 'MobileBodyBold' }]
            if (document.fileType) {
              textLines.push({ text: t('appointmentList.requestType', { type: document.fileType }) })
            }
            if (document.documentType) {
              textLines.push({ text: t('appointmentList.documentType', { type: document.documentType }) })
            }
            if (document.uploadDate) {
              textLines.push({
                text: t('appointmentList.received', { date: formatDateMMMMDDYYYY(document.uploadDate) }),
              })
            }
            items.push({ textLines: textLines })
          }
        })
      }
    })
    return items
  }
  const filesList = files()
  if (isFocused && filesList.length > 0) {
    return (
      <Box>
        <Box
          backgroundColor={'contentBox'}
          borderTopWidth={1}
          borderTopColor="primary"
          borderBottomWidth={1}
          borderBottomColor="primary"
          pt={theme.dimensions.standardMarginBetween}
          pb={theme.dimensions.standardMarginBetween}>
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            {displayImages()}
          </Box>
        </Box>
        {isScene2Visible ? (
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              transform: [
                {
                  scale: Animated.multiply(0.5, Animated.add(progress, 1)),
                },
              ],
            }}>
            <SharedElement style={styles.scene} onNode={setScene2Ancestor}>
              <SharedElement onNode={setScene2Node}>
                <Pressable style={styles.container} onPress={onPressBack}>
                  <Image style={styles.image} source={assetImage} />
                  <TextView
                    variant="MobileBody"
                    mx={theme.dimensions.gutter}
                    mt={theme.dimensions.standardMarginBetween}>
                    {t('fileUpload.fileSize')}
                    <TextView
                      variant="MobileBody"
                      accessibilityLabel={
                        assetImage?.fileSize ? bytesToFinalSizeDisplayA11y(assetImage?.fileSize, t, false) : undefined
                      }>
                      {assetImage?.fileSize ? bytesToFinalSizeDisplay(assetImage?.fileSize, t, false) : undefined}
                    </TextView>
                  </TextView>
                  <TextView
                    variant="MobileBody"
                    mx={theme.dimensions.gutter}
                    my={theme.dimensions.standardMarginBetween}>
                    {t('fileUpload.fileName')}
                    <TextView variant="MobileBody">{assetImage?.fileName}</TextView>
                  </TextView>
                </Pressable>
              </SharedElement>
            </SharedElement>
          </Animated.View>
        ) : undefined}
        {isInProgress ? (
          <Box>
            <SharedElementTransition
              start={{
                node: null,
                ancestor: null,
              }}
              end={{
                node: scene2Node,
                ancestor: scene2Ancestor,
              }}
              position={progress}
              animation="fade-out"
              resize="auto"
              align="auto"
            />
          </Box>
        ) : undefined}
      </Box>
    )
  }
  return (
    <Box mx={theme.dimensions.gutter} my={theme.dimensions.fullScreenContentButtonHeight}>
      <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
        {t('claimDetails.noFiles')}
      </TextView>
    </Box>
  )
}

export default ClaimFiles

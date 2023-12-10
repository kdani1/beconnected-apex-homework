import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, VStack, HStack, Box } from '@chakra-ui/react'
import { MergedImage } from './MergedImage'

import { MomentContext } from '../context/moment'
import { TakePhotoActions } from '../context/moment.reducer'
import { mergeImages } from '../services/mergeimage' // Adjust the path based on your project structure
export const Review: React.FC = () => {
  const { appState, dispatchAppStateAction } = useContext(MomentContext)
  const [combinedImage, setCombinedImage] = useState<Blob>()

  const uploadMoment = () => {
    dispatchAppStateAction({
      type: TakePhotoActions.START_UPLOAD,
      data: combinedImage as Blob,
    })
  }

  const retakePhoto = () =>
    dispatchAppStateAction({
      type: TakePhotoActions.RETAKE_MOMENT,
    })

  useEffect(() => {
    const mergeAndSetImage = async () => {
      if (appState.environmentImage && appState.userImage) {
        try {
          const combinedImageResult = await mergeImages(
            appState.environmentImage,
            appState.userImage
          )
          setCombinedImage(combinedImageResult)
        } catch (error) {
          console.error('Error merging images:', error)
          // Handle error if necessary
        }
      }
    }

    mergeAndSetImage()
  }, [appState.environmentImage, appState.userImage])

  const handleDownload = () => {
    if (combinedImage) {
      const downloadLink = document.createElement('a')
      const blobUrl = URL.createObjectURL(combinedImage)
      downloadLink.href = blobUrl
      downloadLink.download = 'combined_image.png'
      downloadLink.click()
    }
  }

  // Disable scrolling
  useEffect(() => {
    const disableScroll = (e: Event) => {
      e.preventDefault()
    }

    document.body.style.overflow = 'hidden'

    document.addEventListener('touchmove', disableScroll, { passive: false })

    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('touchmove', disableScroll)
    }
  }, [])

  return (
    <Container>
      <Box
        user-select="none"
        color="white"
        fontSize="3xl"
        fontWeight="bold"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="10%"
      >
        BeConnected.
      </Box>
      <VStack height={'75vh'} py={4} justifyContent="space-between">
        <Box>
          <MergedImage
            backImage={appState.environmentImage}
            frontImage={appState.userImage}
          />
        </Box>
        <HStack p={4}>
          <Button size="lg" onClick={retakePhoto} colorScheme="red">
            Retake
          </Button>
          {combinedImage && (
            <Button size="lg" onClick={uploadMoment} colorScheme="teal">
              Post
            </Button>
          )}
          {combinedImage && (
            <Button size="lg" onClick={handleDownload} colorScheme="blue">
              Download
            </Button>
          )}
        </HStack>
      </VStack>
    </Container>
  )
}

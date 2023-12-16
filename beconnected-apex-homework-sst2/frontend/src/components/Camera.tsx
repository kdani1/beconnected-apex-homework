import React, { useContext, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Button, Flex } from '@chakra-ui/react'
import { MomentContext } from '../context/moment'
import { TakePhotoActions, TakePhotoSteps } from '../context/moment.reducer'
import { Loading } from '../components/Loading'

export const Camera: React.FC = () => {
  const webcamRef = useRef<null | Webcam>(null)
  const { appState, dispatchAppStateAction } = useContext(MomentContext)
  const { step, facingMode } = appState
  const [isVisible, setIsVisible] = useState(true)
  const displayLoadingOverlay = [TakePhotoSteps.SwapInitialize].includes(
    appState.step
  )

  const isApple = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = /Android/i.test(navigator.userAgent)
  const isChromebased = /Chrome/.test(navigator.userAgent)
  if (isChromebased) {
    if (isAndroid) {
      // Check the current status of camera permissions
      navigator.permissions
        .query({ name: 'camera' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'prompt') {
            // Camera permission has been asked for on this page
            console.log('Camera permission has been asked for on this page.')
            // attempt to get user media again
            navigator.mediaDevices
              .getUserMedia({ video: true })
              .then(() => {
                // If successful, reload the page
                window.location.reload()
              })
              .catch((retryError) => {
                // Handle the error
                console.error(
                  'Unable to access the camera after permission change:',
                  retryError
                )
              })
          } else {
            // Camera permission may have been granted or denied
            console.log('Camera permission status:', permissionStatus.state)
          }
        })
        .catch((error) => {
          // Handle errors
          console.error('Error checking camera permission status:', error)
        })
    } else if (isApple) {
      console.log('This is Apple.')
    } else {
      const checkCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })
          stream.getTracks().forEach((track) => track.stop())
        } catch (error) {
          // Handle the error
          alert(
            'Please allow camera access in your browser. Click ok when done.'
          )
          window.location.reload()
        }
      }

      checkCameraPermission()
    }
  }
  const captureEnv = () => {
    const environmentImage = webcamRef.current?.getScreenshot() || ''
    dispatchAppStateAction({
      type: TakePhotoActions.RECORD_MOMENT_ENV,
      data: environmentImage,
    })
  }
  const capture = () => {
    captureEnv()
    captureUser()
  }
  const captureUser = () => {
    setIsVisible(false)
    appState.facingMode = 'user'
    setTimeout(
      () => {
        const userImage = webcamRef.current?.getScreenshot() || ''
        dispatchAppStateAction({
          type: TakePhotoActions.RECORD_MOMENT_USER,
          data: userImage,
        })
      },
      Math.floor(Math.random() * (2500 - 800 + 1)) + 800
    )
  }

  const cameraLoaded = () => {
    if (step === TakePhotoSteps.Initialize) {
      dispatchAppStateAction({ type: TakePhotoActions.INITIALIZED })
    }
  }

  return (
    <>
      <Flex
        style={{ visibility: isVisible ? 'hidden' : 'visible' }}
        position="absolute"
        justifyContent="center"
        height="100%"
        background="black"
        w="100%"
      >
        {displayLoadingOverlay && <Loading />}
      </Flex>
      <Button
        position="absolute"
        justifyContent="center"
        size="lg"
        color="white"
        fontSize="4xl"
        fontWeight="bold"
        bg="transparent"
        border="none"
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        top="5%"
        user-select="none"
      >
        BeConnected.
      </Button>
      <Webcam
        ref={webcamRef}
        audio={false}
        forceScreenshotSourceSize={true}
        screenshotFormat="image/png"
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        videoConstraints={{ facingMode }}
        onUserMedia={cameraLoaded}
      />
      <Flex position="absolute" bottom={8} w="100%" justifyContent="center">
        <Button
          size="lg"
          onClick={capture}
          colorScheme="teal"
          style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        >
          Shooot!
        </Button>
      </Flex>
    </>
  )
}

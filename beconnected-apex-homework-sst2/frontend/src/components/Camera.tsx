import React, { useContext, useRef } from 'react'
import { MomentContext } from '../context/moment'
import Webcam from 'react-webcam'
import { TakePhotoActions, TakePhotoSteps } from '../context/moment.reducer'
import { Button, Flex } from '@chakra-ui/react'

export const Camera: React.FC = () => {
  const webcamRef = useRef<null | Webcam>(null)
  const { appState, dispatchAppStateAction } = useContext(MomentContext)
  const { step, facingMode } = appState

  const captureEnv = () =>
    dispatchAppStateAction({
      type: TakePhotoActions.RECORD_MOMENT_ENV,
      data: webcamRef.current?.getScreenshot() || '',
    })

  const cameraLoaded = () => {
    if (step === TakePhotoSteps.Initialize) {
      dispatchAppStateAction({ type: TakePhotoActions.INITIALIZED })
    }
  }

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        forceScreenshotSourceSize={true}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode }}
        onUserMedia={cameraLoaded}
      />
      <Flex position="absolute" bottom={8} w="100%" justifyContent="center">
        <Button size="lg" onClick={captureEnv} colorScheme="teal">
          Shooot!
        </Button>
      </Flex>
    </>
  )
}

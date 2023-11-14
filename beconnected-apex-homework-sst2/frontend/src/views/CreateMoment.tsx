import { useContext } from 'react'
import { MomentContext } from '../context/moment'
import { Camera } from '../components/Camera'
import { Review } from '../components/Review'
import { TakePhotoSteps } from '../context/moment.reducer'
import { Box, Flex } from '@chakra-ui/react'
import { Loading } from '../components/Loading'

const CreateMoment = () => {
  const { appState, s3UploadUrl } = useContext(MomentContext)

  if (!s3UploadUrl) {
    return <div>Not today, boi.</div>
  }

  const displayLoadingOverlay = [TakePhotoSteps.Initialize].includes(
    appState.step
  )

  const displayReview = [
    TakePhotoSteps.Review,
    TakePhotoSteps.Uploading,
  ].includes(appState.step)

  const success = TakePhotoSteps.Success === appState.step
  if (success) {
    return (
      <Flex
        height="100%"
        justifyContent="center"
        alignItems="center"
        background="black"
      >
        <Box color="white">You are cool!</Box>
      </Flex>
    )
  }

  return (
    <Flex
      position="relative"
      justifyContent="center"
      height="100%"
      background="black"
    >
      {displayLoadingOverlay && <Loading />}
      {displayReview ? <Review /> : <Camera />}
    </Flex>
  )
}

export default CreateMoment

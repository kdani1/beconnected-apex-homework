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
  const isSmartphone = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const slackWebLink = 'https://app.slack.com/client/'

  const openSlack = () => {
    if (isSmartphone) {
      // Try to open the Slack app
      window.location.href = 'slack://open'
    } else {
      // Open the Slack web client in the browser
      window.open(slackWebLink, '_self')
    }
  }
  const success = TakePhotoSteps.Success === appState.step
  if (success) {
    return (
      <Flex
        height="100vh" // Adjusted height to use the full viewport height
        flexDirection="column" // Set flexDirection to column
        justifyContent="center"
        alignItems="center"
        background="black"
      >
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

        <Box color="green" textAlign="center">
          You are cool! Now you can see the daily thread, check out what others
          posted! --{'>'}
          <span
            onClick={openSlack}
            style={{ marginLeft: '5px', cursor: 'pointer' }}
          >
            🚀
          </span>
        </Box>
      </Flex>
    )
  }

  const failed = TakePhotoSteps.Failed === appState.step
  if (failed) {
    return (
      <Flex
        height="100vh" // Adjusted height to use the full viewport height
        flexDirection="column" // Set flexDirection to column
        justifyContent="center"
        alignItems="center"
        background="black"
      >
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
        <Box color="red">Photo failed to upload!</Box>
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

import React, { useContext } from 'react'
import { Button, Container, VStack, HStack, Box } from '@chakra-ui/react'
import { MergedImage } from './MergedImage'

import { MomentContext } from '../context/moment'
import { TakePhotoActions } from '../context/moment.reducer'

export const Review: React.FC = () => {
  const { appState, dispatchAppStateAction } = useContext(MomentContext)

  const uploadMoment = () =>
    dispatchAppStateAction({
      type: TakePhotoActions.START_UPLOAD,
    })

  return (
    <Container>
      <VStack height={'100vh'} py={4} justifyContent="space-between">
        <Box>
          <MergedImage backImage={appState.environmentImage} />
        </Box>
        <HStack p={4}>
          <Button size="lg" onClick={uploadMoment} colorScheme="teal">
            Post
          </Button>
        </HStack>
      </VStack>
    </Container>
  )
}

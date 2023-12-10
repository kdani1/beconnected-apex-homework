import { Box, Spinner } from '@chakra-ui/react'
import { FC } from 'react'

export interface LoadingProps {}

export const Loading: FC<LoadingProps> = () => {
  return (
    <Box
      position="absolute"
      background="black"
      height="100%"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="100"
    >
      <Spinner color="white" size="lg" />
      <Box color="white" fontSize="3xl" fontWeight="bold" user-select="none">
        BeConnected.
      </Box>
    </Box>
  )
}

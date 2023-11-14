import React from 'react'
import { Box, Image } from '@chakra-ui/react'

type Props = {
  backImage: string
}

export const MergedImage: React.FC<Props> = ({ backImage }) => {
  return (
    <Box position={'relative'} className="mergedImageHolder">
      <Image
        src={backImage}
        borderRadius={'3xl'}
        maxHeight={'75vh'}
        borderColor={'black'}
        borderWidth={'1px'}
        borderStyle={'solid'}
      />
    </Box>
  )
}

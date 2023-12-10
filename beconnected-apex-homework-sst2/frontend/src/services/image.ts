export const getS3UrlFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const uploadUrl = queryParams.get('uploadUrl')
  return uploadUrl || ''
}
export const postImage = async (mergedImage: Blob, uploadUrl: string) => {
  try {
    // Upload the image to S3
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: mergedImage,
      headers: {
        'Content-Type': 'image/png', // Specify the correct header for content type
      },
    })
    if (response.ok) {
      console.log('Upload successful!')
      return response
    } else {
      console.log('Upload failed' + response)
    }
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

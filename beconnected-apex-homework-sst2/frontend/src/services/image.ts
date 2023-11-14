export const getS3UrlFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const uploadUrl = queryParams.get('uploadUrl')
  return uploadUrl
}

export const postImage = async () => {
  // TODO: finish this...
}

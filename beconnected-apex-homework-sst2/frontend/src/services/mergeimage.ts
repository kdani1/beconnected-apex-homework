export const mergeImages = async (
  backImage: string,
  frontImage: string
): Promise<Blob> => {
  return new Promise((resolve) => {
    const back = new Image()
    back.src = backImage

    const front = new Image()
    front.src = frontImage

    back.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (context) {
        canvas.width = back.width
        canvas.height = back.height

        // Draw the back image
        context.drawImage(back, 0, 0, back.width, back.height)

        if (frontImage) {
          // Scale the front image to be 40% of its original size
          const frontScale = 0.4
          const frontWidth = front.width * frontScale
          const frontHeight = front.height * frontScale

          // Adjust the position of the front image
          const frontPositionX = canvas.width * 0.05 // 5% from the left
          const frontPositionY = canvas.height * 0.05 // 5% from the top

          // Apply border and rounded corners to the front image
          const cornerRadius = 40 // Adjust the radius as needed
          context.beginPath()
          context.moveTo(cornerRadius + frontPositionX, frontPositionY)
          context.lineTo(
            frontWidth - cornerRadius + frontPositionX,
            frontPositionY
          )
          context.quadraticCurveTo(
            frontWidth + frontPositionX,
            frontPositionY,
            frontWidth + frontPositionX,
            cornerRadius + frontPositionY
          )
          context.lineTo(
            frontWidth + frontPositionX,
            frontHeight - cornerRadius + frontPositionY
          )
          context.quadraticCurveTo(
            frontWidth + frontPositionX,
            frontHeight + frontPositionY,
            frontWidth - cornerRadius + frontPositionX,
            frontHeight + frontPositionY
          )
          context.lineTo(
            cornerRadius + frontPositionX,
            frontHeight + frontPositionY
          )
          context.quadraticCurveTo(
            frontPositionX,
            frontHeight + frontPositionY,
            frontPositionX,
            frontHeight - cornerRadius + frontPositionY
          )
          context.lineTo(frontPositionX, cornerRadius + frontPositionY)
          context.quadraticCurveTo(
            frontPositionX,
            frontPositionY,
            cornerRadius + frontPositionX,
            frontPositionY
          )
          context.closePath()

          context.clip()

          // Draw the front image
          context.drawImage(
            front,
            frontPositionX,
            frontPositionY,
            frontWidth,
            frontHeight
          )

          // Draw a rounded white border around the front image
          const borderWidth = -2 // Adjust the width as needed
          context.beginPath()
          context.moveTo(
            cornerRadius + borderWidth / 2 + frontPositionX,
            borderWidth / 2 + frontPositionY
          )
          context.lineTo(
            frontWidth - cornerRadius - borderWidth / 2 + frontPositionX,
            borderWidth / 2 + frontPositionY
          )
          context.quadraticCurveTo(
            frontWidth - borderWidth / 2 + frontPositionX,
            borderWidth / 2 + frontPositionY,
            frontWidth - borderWidth / 2 + frontPositionX,
            cornerRadius + borderWidth / 2 + frontPositionY
          )
          context.lineTo(
            frontWidth - borderWidth / 2 + frontPositionX,
            frontHeight - cornerRadius - borderWidth / 2 + frontPositionY
          )
          context.quadraticCurveTo(
            frontWidth - borderWidth / 2 + frontPositionX,
            frontHeight - borderWidth / 2 + frontPositionY,
            frontWidth - cornerRadius - borderWidth / 2 + frontPositionX,
            frontHeight - borderWidth / 2 + frontPositionY
          )
          context.lineTo(
            cornerRadius + borderWidth / 2 + frontPositionX,
            frontHeight - borderWidth / 2 + frontPositionY
          )
          context.quadraticCurveTo(
            borderWidth / 2 + frontPositionX,
            frontHeight - borderWidth / 2 + frontPositionY,
            borderWidth / 2 + frontPositionX,
            frontHeight - cornerRadius - borderWidth / 2 + frontPositionY
          )
          context.lineTo(
            borderWidth / 2 + frontPositionX,
            cornerRadius + borderWidth / 2 + frontPositionY
          )
          context.quadraticCurveTo(
            borderWidth / 2 + frontPositionX,
            borderWidth / 2 + frontPositionY,
            cornerRadius + borderWidth / 2 + frontPositionX,
            borderWidth / 2 + frontPositionY
          )
          context.closePath()

          context.strokeStyle = 'white'
          context.lineWidth = borderWidth
          context.stroke()

          // Draw a rounded black border around the white border
          const blackBorderWidth = -4 // Adjust the width as needed
          context.beginPath()
          context.moveTo(
            cornerRadius +
              borderWidth / 2 -
              blackBorderWidth / 2 +
              frontPositionX,
            borderWidth / 2 - blackBorderWidth / 2 + frontPositionY
          )
          context.lineTo(
            frontWidth -
              cornerRadius -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionX,
            borderWidth / 2 - blackBorderWidth / 2 + frontPositionY
          )
          context.quadraticCurveTo(
            frontWidth -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionX,
            borderWidth / 2 - blackBorderWidth / 2 + frontPositionY,
            frontWidth -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionX,
            cornerRadius +
              borderWidth / 2 -
              blackBorderWidth / 2 +
              frontPositionY
          )
          context.lineTo(
            frontWidth -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionX,
            frontHeight -
              cornerRadius -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionY
          )
          context.quadraticCurveTo(
            frontWidth -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionX,
            frontHeight -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionY,
            frontWidth -
              cornerRadius -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionX,
            frontHeight -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionY
          )
          context.lineTo(
            cornerRadius +
              borderWidth / 2 -
              blackBorderWidth / 2 +
              frontPositionX,
            frontHeight -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionY
          )
          context.quadraticCurveTo(
            borderWidth / 2 - blackBorderWidth / 2 + frontPositionX,
            frontHeight -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionY,
            borderWidth / 2 - blackBorderWidth / 2 + frontPositionX,
            frontHeight -
              cornerRadius -
              borderWidth / 2 +
              blackBorderWidth / 2 +
              frontPositionY
          )
          context.lineTo(
            borderWidth / 2 - blackBorderWidth / 2 + frontPositionX,
            cornerRadius +
              borderWidth / 2 -
              blackBorderWidth / 2 +
              frontPositionY
          )
          context.quadraticCurveTo(
            borderWidth / 2 - blackBorderWidth / 2 + frontPositionX,
            borderWidth / 2 - blackBorderWidth / 2 + frontPositionY,
            cornerRadius +
              borderWidth / 2 -
              blackBorderWidth / 2 +
              frontPositionX,
            borderWidth / 2 - blackBorderWidth / 2 + frontPositionY
          )
          context.closePath()

          context.strokeStyle = 'black'
          context.lineWidth = blackBorderWidth
          context.stroke()
        }

        // Convert the canvas to a Blob (image file)
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            console.error('Error converting canvas to Blob')
          }
        }, 'image/png')
      }
    }
  })
}

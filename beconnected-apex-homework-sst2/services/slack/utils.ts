const makeHeaderBlock = (userId: string, headerContent: string = '') => {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `<@${userId}>${headerContent}`,
    },
  }
}

const makeTextBlock = (text: string) => {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text,
    },
  }
}

const makeImageBlock = (
  imageUrl: string,
  imageLabel?: string,
  altText?: string
) => {
  return {
    type: 'image',
    title: {
      type: 'plain_text',
      text: imageLabel || 'no comment',
      emoji: true,
    },
    image_url: imageUrl,
    alt_text: altText || imageLabel || '',
  }
}

const dividerBlock = {
  type: 'divider',
}

export function generateMessage(
  userId: string,
  imageUrl?: string,
  message?: string,
  imageLabel?: string,
  headerContent?: string
) {
  let payload = {
    blocks: [makeHeaderBlock(userId, headerContent)],
  }

  if (message) {
    // @ts-ignore
    payload.blocks.push(dividerBlock, makeTextBlock(message))
  }

  if (imageUrl) {
    // @ts-ignore
    payload.blocks.push(dividerBlock, makeImageBlock(imageUrl, imageLabel))
  }

  return payload
}

export const makeShortLinkText = (url: string, linkLabel?: string) =>
  `<${url}|${linkLabel ?? 'shortened link'}>`

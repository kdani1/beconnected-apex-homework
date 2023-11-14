import { Config, StackContext } from 'sst/constructs'

export default function ConfigStack({ stack }: StackContext) {
  const SLACK_SIGNING_SECRET = new Config.Secret(stack, 'SLACK_SIGNING_SECRET')
  const SLACK_BOT_TOKEN = new Config.Secret(stack, 'SLACK_BOT_TOKEN')
  const SLACK_CHANNEL_ID = new Config.Secret(stack, 'SLACK_CHANNEL_ID')

  const UPLOAD_EXPIRES = new Config.Parameter(stack, 'UPLOAD_EXPIRES', {
    value: '172800',
  })

  return {
    SLACK_SIGNING_SECRET,
    SLACK_BOT_TOKEN,
    SLACK_CHANNEL_ID,
    UPLOAD_EXPIRES,
  }
}

import { Config } from 'sst/node/config'
import { App, LogLevel } from '@slack/bolt'

export const getApp = (secret: string) => {
  const app = new App({
    signingSecret: secret,
    token: Config.SLACK_BOT_TOKEN,
    logLevel: LogLevel.DEBUG,
  })
  return app
}

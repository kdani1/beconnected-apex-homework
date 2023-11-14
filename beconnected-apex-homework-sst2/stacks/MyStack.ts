import {
  Bucket,
  Cron,
  FunctionDefinition,
  Queue,
  StackContext,
  use,
  StaticSite,
} from 'sst/constructs'
import * as cdk from 'aws-cdk-lib'

import ConfigStack from './ConfigStack'

export function MyStack({ stack, app }: StackContext) {
  const {
    SLACK_SIGNING_SECRET,
    SLACK_BOT_TOKEN,
    SLACK_CHANNEL_ID,
    UPLOAD_EXPIRES,
  } = use(ConfigStack)
  const bind = [
    SLACK_SIGNING_SECRET,
    SLACK_BOT_TOKEN,
    SLACK_CHANNEL_ID,
    UPLOAD_EXPIRES,
  ]

  const bucket = new Bucket(stack, 'beconnected-bucket', {
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    },
    cors: [
      {
        allowedHeaders: ['*'],
        allowedMethods: ['PUT'],
        allowedOrigins: ['*'],
      },
    ],
  })
  bucket.attachPermissions([bucket])

  // frontend
  const site = new StaticSite(stack, 'ViteSite', {
    path: 'frontend',
  })
  const siteUrl: string = app.local
    ? JSON.parse(require('fs').readFileSync('.sst/beconnected-ngrok.json'))
        .public_url
    : site.url

  // queues
  const flowStartQueue = new Queue(stack, 'flow-start-queue')
  const createMomentQueue = new Queue(stack, 'create-moment-queue')
  const channelUsersQueue = new Queue(stack, 'channel-users-queue')
  const uploadLinkQueue = new Queue(stack, 'upload-link-queue')
  const sendDmQueue = new Queue(stack, 'send-dm-queue')

  const dailyNotificationRuleName = `${app.stage}-daily-notification-rule`
  const triggerMomentHandler: FunctionDefinition = {
    handler: 'services/lambdas/cron.handler',
    bind,
    environment: {
      flowStartQueueUrl: flowStartQueue.queueUrl,
      cloudwatchRuleName: dailyNotificationRuleName,
    },
    permissions: '*',
  }

  new Cron(stack, 'Cron', {
    schedule: 'rate(1 minute)',
    cdk: { rule: { ruleName: dailyNotificationRuleName } },
    job: {
      function: triggerMomentHandler,
    },
  })

  // consumers
  flowStartQueue.addConsumer(stack, {
    function: {
      handler: 'services/lambdas/flow-start.handler',
      bind,
      environment: {
        createMomentQueueUrl: createMomentQueue.queueUrl,
      },
      permissions: [createMomentQueue],
    },
    cdk: { eventSource: { batchSize: 1 } },
  })

  createMomentQueue.addConsumer(stack, {
    function: {
      handler: 'services/lambdas/create-moment.handler',
      bind,
      environment: {
        channelUsersQueueUrl: channelUsersQueue.queueUrl,
      },
      permissions: [channelUsersQueue],
    },
    cdk: { eventSource: { batchSize: 1 } },
  })

  channelUsersQueue.addConsumer(stack, {
    function: {
      handler: 'services/lambdas/channel-users.handler',
      bind,
      environment: {
        uploadLinkQueueUrl: uploadLinkQueue.queueUrl,
      },
      permissions: [uploadLinkQueue],
    },
    cdk: { eventSource: { batchSize: 1 } },
  })

  uploadLinkQueue.addConsumer(stack, {
    function: {
      handler: 'services/lambdas/upload-link.handler',
      bind,
      environment: {
        sendDmQueueUrl: sendDmQueue.queueUrl,
        bucketName: bucket.bucketName,
        siteUrl,
      },
      permissions: [bucket, sendDmQueue],
    },
    cdk: { eventSource: { batchSize: 1 } },
  })

  sendDmQueue.addConsumer(stack, {
    function: {
      handler: 'services/lambdas/send-dm.handler',
      bind,
      environment: {
        siteUrl,
      },
    },
    cdk: { eventSource: { batchSize: 1 } },
  })

  stack.addOutputs({
    SiteUrl: siteUrl,
  })
}

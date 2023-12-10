export interface FlowStartMessageBody {
  nextDate: Date
}

export interface ClientData {
  clientName: string
  clientSlackSecret: string
  clientChannelId: string
}

export interface CreateMomentMessageBody {
  nextDate: Date
  clientName: string
  clientSlackSecret: string
  clientChannelId: string
}

export interface CreateUploadMessageBody {
  clientName: string
  clientSlackSecret: string
  clientChannelId: string
  image: string
}

export type ChannelUsersMessageBody = {
  nextDate: Date
  clientName: string
  clientSlackSecret: string
  clientChannelId: string
  threadId: string
}

export type UploadLinkMessageBody = {
  nextDate: Date
  clientName: string
  clientSlackSecret: string
  clientChannelId: string
  threadId: string
  userId: string
}

export type SlackUser = {
  userId: string
}

export type SendDmMessageBody = {
  clientSlackSecret: string
  uploadLink: string
  userId: string
}

// !
export type S3ImageMetaData = {
  clientslacksecret: string
  threadid: string
  clientchannelid: string
  userid: string
  timestamp: string
}

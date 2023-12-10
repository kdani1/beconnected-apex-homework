export enum TakePhotoSteps {
  Initialize = 'Initialize',
  EnvCameraReady = 'EnvCameraReady',
  SwapInitialize = 'SwapInitialize',
  UserCameraReady = 'UserCameraReady',
  Review = 'Review',
  Uploading = 'Uploading',
  Success = 'Success',
  Failed = 'Failed',
}

export enum TakePhotoActions {
  INITIALIZED = 'INITIALIZED',
  RECORD_MOMENT_ENV = 'RECORD_MOMENT_ENV',
  SWAPINITIALIZED = 'SWAPINITIALIZED',
  RECORD_MOMENT_USER = 'RECORD_MOMENT_USER',
  RETAKE_MOMENT = 'RETAKE_MOMENT',
  START_UPLOAD = 'START_UPLOAD',
  UPLOAD_SUCCESS = 'UPLOAD_SUCCESS',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
}

type InitializedAction = {
  type: TakePhotoActions.INITIALIZED
}
type RecordMomentEnvAction = {
  type: TakePhotoActions.RECORD_MOMENT_ENV
  data: string
}
type SwapInitializedAction = {
  type: TakePhotoActions.SWAPINITIALIZED
}
type RecordMomentUserAction = {
  type: TakePhotoActions.RECORD_MOMENT_USER
  data: string
}
type RetakeMomentAction = {
  type: TakePhotoActions.RETAKE_MOMENT
}
type StartUploadAction = {
  type: TakePhotoActions.START_UPLOAD
  data: Blob
}
type UploadSuccessAction = {
  type: TakePhotoActions.UPLOAD_SUCCESS
}
type UploadFailedAction = {
  type: TakePhotoActions.UPLOAD_FAILED
}

export type TakePhotoActionType =
  | InitializedAction
  | RecordMomentEnvAction
  | SwapInitializedAction
  | RecordMomentUserAction
  | RetakeMomentAction
  | StartUploadAction
  | UploadSuccessAction
  | UploadFailedAction

export enum FacingModes {
  user = 'user',
  environment = 'environment',
}

type FacingMode = keyof typeof FacingModes

export type TakePhotoState = {
  step: TakePhotoSteps
  facingMode: FacingMode
  environmentImage: string
  userImage: string
  mergedImage: Blob
}

export const momentReducer = (
  state: TakePhotoState,
  action: TakePhotoActionType
): TakePhotoState => {
  switch (action.type) {
    case TakePhotoActions.INITIALIZED:
      return {
        ...state,
        step: TakePhotoSteps.EnvCameraReady,
        facingMode: FacingModes.environment,
      }

    case TakePhotoActions.RECORD_MOMENT_ENV:
      return {
        ...state,
        step: TakePhotoSteps.SwapInitialize,
        environmentImage: action.data || '',
      }
    case TakePhotoActions.SWAPINITIALIZED:
      return {
        ...state,
        step: TakePhotoSteps.UserCameraReady,
        facingMode: FacingModes.user,
      }
    case TakePhotoActions.RECORD_MOMENT_USER:
      return {
        ...state,
        step: TakePhotoSteps.Review,
        userImage: action.data || '',
      }
    case TakePhotoActions.START_UPLOAD:
      return {
        ...state,
        step: TakePhotoSteps.Uploading,
        mergedImage: action.data || '',
      }

    case TakePhotoActions.UPLOAD_SUCCESS:
      return { ...state, step: TakePhotoSteps.Success }

    case TakePhotoActions.UPLOAD_FAILED:
      return { ...state, step: TakePhotoSteps.Failed }

    default:
      return { ...state, step: TakePhotoSteps.Initialize }
  }
}

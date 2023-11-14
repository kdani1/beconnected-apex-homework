export enum TakePhotoSteps {
  Initialize = 'Initialize',
  EnvCameraReady = 'EnvCameraReady',
  Review = 'Review',
  Uploading = 'Uploading',
  Success = 'Success',
}

export enum TakePhotoActions {
  INITIALIZED = 'INITIALIZED',
  RECORD_MOMENT_ENV = 'RECORD_MOMENT_ENV',
  START_UPLOAD = 'START_UPLOAD',
  UPLOAD_SUCCESS = 'UPLOAD_SUCCESS',
}

type InitializedAction = {
  type: TakePhotoActions.INITIALIZED
}
type RecordMomentEnvAction = {
  type: TakePhotoActions.RECORD_MOMENT_ENV
  data: string
}
type StartUploadAction = {
  type: TakePhotoActions.START_UPLOAD
}
type UploadSuccessAction = {
  type: TakePhotoActions.UPLOAD_SUCCESS
}

export type TakePhotoActionType =
  | InitializedAction
  | RecordMomentEnvAction
  | StartUploadAction
  | UploadSuccessAction

export enum FacingModes {
  user = 'user',
  environment = 'environment',
}

type FacingMode = keyof typeof FacingModes

export type TakePhotoState = {
  step: TakePhotoSteps
  facingMode: FacingMode
  environmentImage: string
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
        step: TakePhotoSteps.Review,
        environmentImage: action.data || '',
      }

    case TakePhotoActions.START_UPLOAD:
      return { ...state, step: TakePhotoSteps.Uploading }

    case TakePhotoActions.UPLOAD_SUCCESS:
      return { ...state, step: TakePhotoSteps.Success }

    default:
      return { ...state, step: TakePhotoSteps.Initialize }
  }
}

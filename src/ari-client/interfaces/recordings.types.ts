export interface StoredRecording {
  name: string;
  format: string;
}

export type RecordingState = 'queued' | 'recording' | 'paused' | 'done' | 'failed' | 'canceled';

export interface LiveRecording {
  name: string;
  format: string;
  target_uri: string;
  state: RecordingState;
  duration?: number;
  talking_duration?: number;
  silence_duration?: number;
  cause?: string;
}

export interface GetStoredParams {
  recordingName: string;
}

export interface DeleteStoredParams {
  recordingName: string;
}

export interface GetStoredFileParams {
  recordingName: string;
}

export interface CopyStoredParams {
  recordingName: string;
  destinationRecordingName: string;
}

export interface GetLiveParams {
  recordingName: string;
}

export interface CancelParams {
  recordingName: string;
}

export interface StopParams {
  recordingName: string;
}

export interface PauseParams {
  recordingName: string;
}

export interface UnpauseParams {
  recordingName: string;
}

export interface MuteParams {
  recordingName: string;
}

export interface UnmuteParams {
  recordingName: string;
}
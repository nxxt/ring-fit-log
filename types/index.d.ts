export type Item = {
  icon: string
  title: string
  to: string
}

export type Types = 'info' | 'error' | 'warning' | 'success'

export interface SnackbarPayload {
  message: string
  escape?: boolean
  top?: boolean
  right?: boolean
  left?: boolean
  bottom?: boolean
  timeout?: number
}

export interface SnackbarTypePayload extends SnackbarPayload {
  type: Types
}

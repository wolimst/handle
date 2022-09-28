export interface Encoder {
  decode: (data: string) => string
  encode: (data: string) => string
}

export const base64: Encoder = {
  decode: (data) => decodeURIComponent(window.atob(data)),
  encode: (data) => window.btoa(encodeURIComponent(data)),
}

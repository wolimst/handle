export interface Encoder {
  decode: (data: string) => string
  encode: (data: string) => string
}

const warningText =
  '***** DO NOT MODIFY THIS DATA / 이 데이터를 수정하지 마세요 *****'

export const base64: Encoder = {
  decode: (data) =>
    decodeURIComponent(window.atob(data.slice(warningText.length))),
  encode: (data) => warningText + window.btoa(encodeURIComponent(data)),
}

export const plaintext: Encoder = {
  decode: (data) => data,
  encode: (data) => data,
}

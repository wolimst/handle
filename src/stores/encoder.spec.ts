import { base64 } from './encoder'

test('base64', () => {
  expect(base64.decode(base64.encode('data'))).toEqual('data')
  expect(base64.decode(base64.encode('A한あ漢😊1!(['))).toEqual('A한あ漢😊1!([')
})

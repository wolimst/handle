import { base64 } from './encoder'

test('base64', () => {
  expect(base64.decode(base64.encode('data'))).toEqual('data')
  expect(base64.decode(base64.encode('Aíãæ¼¢ð1!(['))).toEqual('Aíãæ¼¢ð1!([')
})

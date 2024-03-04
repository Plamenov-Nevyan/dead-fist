import { Stream } from "stream"
const Readable = Stream.Readable

module.exports = (fileBuffer) => {
  const stream = new Readable()
  stream.push(fileBuffer)
  stream.push(null)
  return stream
}
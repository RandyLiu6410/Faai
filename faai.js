import http from "http"
import color from "picocolors"

http
  .createServer((req, res) => {
    res.end("hi")
  })
  .listen(process.env.HTTP_PORT)

console.log(
`${color.bgBlue(process.env.PROJECT_NAME)} is running now
${color.green(`http://127.0.0.1:${process.env.HTTP_PORT}`)}`
)

import http from "http"
import color from "picocolors"
import connect from "connect"
import { indexHTMLMiddleware } from "./middleware"

const middleware = connect()

const { PROJECT_NAME, HTTP_PORT } = process.env

middleware.use(indexHTMLMiddleware)

export function createServer() {
  http.createServer(middleware).listen(HTTP_PORT)

  console.log(
    `${color.bgBlue(PROJECT_NAME)} is running now
    ${color.green(`http://127.0.0.1:${HTTP_PORT}`)}`
  )
}

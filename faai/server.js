import http from "http"
import color from "picocolors"
import connect from "connect"
import { indexHTMLMiddleware } from "./middleware"
import { WebSocketServer } from "ws"

const { PROJECT_NAME, HTTP_PORT, WS_PORT } = process.env

const createWSServer = () => {
  const server = new WebSocketServer({
    port: WS_PORT,
  })

  server.on("connection", (ws) => {
    console.log(color.bgCyan("WS server connected!"))

    ws.on("message", (data) => {
      console.log("Received: %s", data)
    })
  })
}

const middleware = connect()
middleware.use(indexHTMLMiddleware)

export function createServer() {
  http.createServer(middleware).listen(HTTP_PORT)

  createWSServer()

  console.log(
    `${color.bgBlue(PROJECT_NAME)} is running now
    ${color.green(`http://127.0.0.1:${HTTP_PORT}`)}`
  )
}

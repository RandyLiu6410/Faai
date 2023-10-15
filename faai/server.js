import http from "http"
import color from "picocolors"
import connect from "connect"
import chokidar from "chokidar"
import { indexHTMLMiddleware, replaceImportMiddleware } from "./middlewares"
import { WebSocketServer } from "ws"
import { getRelativePath } from "./utils"

const { PROJECT_NAME, HTTP_PORT, WS_PORT } = process.env
const WATCH_LIST = ["index.html", "src/**/*.js", "src/**/*.css"]

const createWSServer = () => {
  const server = new WebSocketServer({
    port: WS_PORT,
  })

  server.on("connection", (ws) => {
    console.log(color.bgCyan("WS server connected!"))
    ws.send(
      JSON.stringify({
        type: "message",
        content: `${PROJECT_NAME} Connected`,
      })
    )

    // watcher
    const watcher = chokidar.watch(WATCH_LIST)
    watcher.on("change", (file) => {
      const msgObj = {
        type: "change",
        file: getRelativePath(file),
      }
      ws.send(JSON.stringify(msgObj))
    })

    ws.on("message", (data) => {
      console.log("Received: %s", data)
    })
  })
}

const middleware = connect()
middleware.use(replaceImportMiddleware)
middleware.use(indexHTMLMiddleware)

export function createServer() {
  http.createServer(middleware).listen(HTTP_PORT)

  createWSServer()

  console.log(
    `${color.bgBlue(PROJECT_NAME)} is running now on
${color.green(`http://127.0.0.1:${HTTP_PORT}`)}`
  )
}

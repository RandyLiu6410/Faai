import path from "path"
import { getFilePathAndContentType } from "../utils.js"

export const indexHTMLMiddleware = async (req, res) => {
  const { filePath, contentType } = getFilePathAndContentType(req.url)

  try {
    const file = Bun.file(filePath)
    let content = await file.text()

    if (path.basename(filePath) === "index.html") {
      const regex = /(<head>)([\s\S]*?<\/head>)/i
      const match = content.match(regex)
      const clientScript = '<script src="faai/client.js"></script>'
      if (match) {
        content = content.replace(match[0], match[1] + clientScript + match[2])
      }
    }

    res.writeHead(200, {
      "Content-Type": contentType,
    })
    res.end(content)
  } catch {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    })
    res.end("No file")
  }
}

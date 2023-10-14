import path from "path"
import { getEntryPoint, getFilePathAndContentType } from "./utils"

const EXCLUDE_LIST = ["/faai/client.js"]
/**
 * 處理js裡面用到外部library
 */
export const replaceImportMiddleware = async (req, res, next) => {
  const { url } = req

  if (url.endsWith("js") && !EXCLUDE_LIST.includes(url)) {
    const { filePath, contentType } = getFilePathAndContentType(url)

    const file = Bun.file(filePath)
    let content = await file.text()

    // pre-bundling
    const matches = content.match(regex)
    if (matches) {
      // 匹配一對引號括起來的文本，但不包括以 "./" 開頭的文本
      const mod_regex = /['"](?!\.\/)([^'"]+)['"]/
      const modules = matches
        .map((m) => {
          return m.match(mod_regex)[1]
        })
        .map(getEntryPoint)

      await Bun.build({
        entrypoints: modules.map(
          (entryPoint) => `./node_modules/${entryPoint}`
        ),
        outdir: "./node_modules/.faai/deps",
      })
      console.log(modules)
    }

    // 匹配 "from " 後跟一對引號括起來的文本，但不包括以 "./" 開頭的文本
    const regex = /from ['"](?!\.\/)([^'"]+)['"]/g
    content = content.replace(regex, (_match, capture) => {
      const entryPoint = getEntryPoint(capture)

      return `from "./node_modules/.faai/deps/${entryPoint}"`
    })

    res.writeHead(200, {
      "Content-Type": contentType,
    })
    res.end(content)
  }

  next()
}

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

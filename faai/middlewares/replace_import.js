import {
  getDepModulePath,
  getEntryPoint,
  getFilePathAndContentType,
} from "../utils.js"

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

    // 匹配 "from " 後跟一對引號括起來的文本，但不包括以 "./" 開頭的文本
    const regex = /from ['"](?!\.\/)([^'"]+)['"]/g

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
    }

    content = content.replace(regex, (_match, capture) => {
      const entryPoint = getEntryPoint(capture)

      return `from "${getDepModulePath(entryPoint)}"`
    })

    res.writeHead(200, {
      "Content-Type": contentType,
    })
    res.end(content)
  }

  next()
}

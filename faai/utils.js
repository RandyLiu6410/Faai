import path from "path"
import fs from "fs"

const ContentTypes = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
}

export const getFilePathAndContentType = (filename) => {
  if (filename === "/") {
    filename = "index.html"
  }

  const extname = path.extname(filename).replace(".", "")
  const contentType = ContentTypes[extname] || "text/html"
  const rootPath = process.cwd()
  const filePath = path.join(rootPath, filename)

  return {
    filePath,
    contentType,
  }
}

export function getEntryPoint(module) {
  if (!module.endsWith(".js")) {
    const packageFile = `./node_modules/${module}/package.json`
    const content = fs.readFileSync(packageFile, "utf-8")
    const result = JSON.parse(content)

    return path.join(module, result.main)
  }

  return module
}

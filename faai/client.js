const ws = new WebSocket("ws://127.0.0.1:5100")

ws.addEventListener("open", ({ target }) => {
  target.addEventListener("message", ({ data }) => {
    const result = JSON.parse(data)

    switch (result.type) {
      case "message":
        console.log(result.content)
        break
      case "change":
        const { file } = result

        if (file.endsWith(".css")) {
          fetch(file)
            .then((data) => data.text())
            .then((content) => {
              const el = document.querySelector("style#hot")
              if (el) {
                el.textContent = content
              } else {
                const el = document.createElement("style")
                el.id = "hot"
                el.textContent = content

                const head = document.querySelector("head")
                head.appendChild(el)
              }
            })
          // 換 css
        } else {
          window.location.reload()
        }

        break
    }
  })

  target.addEventListener("close", () => {
    console.log("closed")
  })
})

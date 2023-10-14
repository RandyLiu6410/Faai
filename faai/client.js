const ws = new WebSocket("ws://127.0.0.1:5100")

ws.addEventListener("open", ({ target }) => {
  target.addEventListener("message", ({ data }) => {
    console.log(data)
  })

  target.addEventListener("close", () => {
    console.log("closed")
  })
})

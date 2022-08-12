const draw = async () => {
  const timestamp = new Date()
  const canvas = document.querySelector("canvas")
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()
    const scale = window.devicePixelRatio

    canvas.width = rect.width * scale
    canvas.height = rect.height * scale

    ctx.scale(scale, scale)

    function playFieled() {
      let ss = 40
      let Y = 0
      let J = 0
      for (i = 0; i <= 458; i++) {
        const rectangle = new Path2D()
        rectangle.rect(ss * J, Y, ss, ss)
        ctx.strokeStyle = "rgba(0,0,0,1)"
        ctx.stroke(rectangle)
        J++
        if (J === 20) {
          Y += ss
          J = 0
        }
      }
    }

    function randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    }

    class InputHandler {
      constructor() {
        this.keys = []
        window.addEventListener("keydown", (e) => {
          if (
            (e.key === "ArrowDown" || e.key === "ArrowUp") &&
            this.keys.indexOf(e.key) === -1
          ) {
            this.keys.push(e.key)
          }
          if (
            (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
            this.keys.indexOf(e.key) === -1
          ) {
            this.keys.push(e.key)
            setTimeout(() => {
              this.keys.splice(this.keys.indexOf(e.key), 1)
            }, 20)
          }
        })
        window.addEventListener("keyup", (e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            this.keys.splice(this.keys.indexOf(e.key), 1)
          }
        })
      }
    }

    class Qubes {
      constructor() {
        this.x = randomNumber(0, 18)
        this.y = 0
        this.border = [0, 17]
        this.width = 40
        this.height = 40
        this.speed = 0.06 * 1
        this.texture = randomNumber(3, 3)
        this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
        this.diffusity = Math.floor((new Date() - timestamp) * 0.000001) + 1
      }

      update(input) {
        this.y += this.speed * this.diffusity
        if (input.keys.indexOf("ArrowDown") > -1) {
          this.y >= 21 ? this.y : (this.y += this.speed * 2)
        }
        if (input.keys.indexOf("ArrowRight") > -1) {
          this.x === this.border[1] ? this.x : (this.x += 1)
        }
        if (input.keys.indexOf("ArrowLeft") > -1) {
          this.x === this.border[0] ? this.x : (this.x -= 1)
        }
        return { x: this.x, y: this.y }
      }

      draw() {
        const litlBox = (x, y) => {
          const sX = x + 40 * this.x
          const sY = y + 40 * this.y
          ctx.fillRect(sX, sY, this.width, this.height)
          return { x: sX, y: sY }
        }
        this.qubesArray = []
        switch (this.texture) {
          case 0:
            //TANK PURPLE
            ctx.fillStyle = "#a000f0"
            this.qubesArray.push(
              litlBox(0, 0),
              litlBox(40, 40),
              litlBox(0, 40),
              litlBox(-40, 40)
            )
            return this.qubesArray
          case 1:
            //Z GREEN
            ctx.fillStyle = "#00f000"
            this.qubesArray.push(
              litlBox(40, 0),
              litlBox(40, 40),
              litlBox(0, 40),
              litlBox(80, 0)
            )
            return this.qubesArray
          case 2:
            //L ORANGE
            ctx.fillStyle = "#f0a000"
            this.qubesArray.push(
              litlBox(40, 0),
              litlBox(40, 40),
              litlBox(0, 40),
              litlBox(-40, 40)
            )
            return this.qubesArray
          case 3:
            //Square Yellow
            ctx.fillStyle = "#f0f000"
            this.qubesArray.push(
              litlBox(0, 0),
              litlBox(40, 40),
              litlBox(40, 0),
              litlBox(0, 40)
            )
            return this.qubesArray
          case 4:
            //L Blue
            ctx.fillStyle = "#0000f0"
            this.qubesArray.push(
              litlBox(-40, 0),
              litlBox(40, 40),
              litlBox(0, 40),
              litlBox(-40, 40)
            )
            return this.qubesArray
          case 5:
            //Z RED
            ctx.fillStyle = "#f00102"
            this.qubesArray.push(
              litlBox(40, 0),
              litlBox(40, 40),
              litlBox(0, 0),
              litlBox(80, 40)
            )
            return this.qubesArray
          case 6:
            //Line Cyan
            ctx.fillStyle = "#00f0f0"
            this.qubesArray.push(
              litlBox(0, 0),
              litlBox(0, 40),
              litlBox(0, 80),
              litlBox(0, 120)
            )
            return this.qubesArray

          default:
            break
        }
      }
    }

    const input = new InputHandler()
    const boxes = []
    let currBox = []
    let turrBox = []
    let boxMap = []
    function bix() {
      return new Promise((resolve) => {
        const box = new Qubes()
        boxes.push(box)
        function qube() {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          playFieled()
          boxes.forEach((b) => {
            b.draw()
          })
          currBox = boxes.map((bop) => {
            return bop
          })
          currBox = currBox.reverse()[0].qubesArray.forEach((o, i) => {
            turrBox[i] = o
          })
          const collision = (() => {
            let map = []
            if (boxMap.length > 0) {
              boxMap.forEach((b) => {
                b.qubesArray.forEach((box1) => {
                  turrBox.forEach((box2) => {
                    if (
                      box1.y < box2.y + 40 &&
                      box1.x < box2.x + 40 &&
                      box1.x + 40 > box2.x &&
                      box1.y + 40 > box2.y
                    ) {
                      map.push(1)
                    }
                    if (box2.y >= 22 * 40) {
                      map.push(1)
                    }
                  })
                })
              })
              return !map.some((tu) => tu == 1)
            } else {
              turrBox.forEach((box2) => {
                if (box2.y >= 22 * 40) {
                  map.push(1)
                }
              })
              return !map.some((tu) => tu == 1)
            }
          })()
          box.update(input)

          if (collision) {
            requestAnimationFrame(qube)
          } else {
            boxMap = boxes.map((bm) => {
              return bm
            })
            resolve(boxMap)
          }
        }
        qube()
      })
    }

    for (;;) {
      await bix()
    }
  }
}

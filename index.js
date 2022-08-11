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
        this.texture = randomNumber(0, 7)
        this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
        this.diffusity = Math.floor((new Date() - timestamp) * 0.00001) + 1
      }

      update(input) {
        this.y += this.speed * this.diffusity
        if (this.y >= 21) {
          this.y = 21
        }
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
          return [sX, sY]
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
    let oldBox = []
    // console.log((canvas.width - 2) / 40)
    // console.log((canvas.height -5) / 40)
    // playFieled()
    function bix() {
      return new Promise((resolve) => {
        const box = new Qubes()
        boxes.push(box)
        function qube() {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          boxes.forEach((b, i) => {
            currBox = b.draw()
            if (boxes.length > 1) {
              console.log(boxes[i].qubesArray)
            }
          })
          // console.log(oldBox)
          const curPos = box.update(input)
          const check =
            curPos.y >= 21 ||
            boxes.some((b) =>
              b.qubesArray.some((s) =>
                s.some((q) => q[1] - 40 <= currBox[0][1])
              )
            )

          if (!check) {
            requestAnimationFrame(qube)
          } else {
            resolve()
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

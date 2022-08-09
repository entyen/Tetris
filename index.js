const draw = async () => {
  const canvas = document.querySelector("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio;

    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    ctx.scale(scale, scale);

    function background() {
      let ss = 40;
      let Y = 0;
      let J = 0;
      for (i = 0; i <= 458; i++) {
        const rectangle = new Path2D();
        rectangle.rect(ss * J, Y, ss, ss);
        // ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.stroke(rectangle);
        J++;
        if (J === 20) {
          Y += ss;
          J = 0;
        }
      }
    }

    function randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    class InputHandler {
      constructor() {
        this.keys = [];
        window.addEventListener("keydown", (e) => {
          if (
            (e.key === "ArrowDown" ||
              e.key === "ArrowUp" ||
              e.key === "ArrowLeft" ||
              e.key === "ArrowRight") &&
            this.keys.indexOf(e.key) === -1
          ) {
            this.keys.push(e.key);
          }
        });
        window.addEventListener("keyup", (e) => {
          if (
            e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight"
          ) {
            this.keys.splice(this.keys.indexOf(e.key), 1);
          }
        });
      }
    }

    class Qubes {
      constructor() {
        this.x = randomNumber(0, 18);
        this.y = 0;
        this.border = [0, 17];
        this.width = 40;
        this.height = 40;
        this.speed = 0.06 * 1;
        this.texture = randomNumber(0, 3);
        this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      }

      update(input) {
        this.y += this.speed;
        if (this.y >= 21) {
          this.y = 21;
        }
        if (input.keys.indexOf("ArrowDown") > -1) {
          if (this.y >= 21) return;
          this.y += this.speed * 2;
        }
        if (input.keys.indexOf("ArrowRight") > -1) {
          if (this.x === this.border[1]) return;
          this.x += 1;
        }
        if (input.keys.indexOf("ArrowLeft") > -1) {
          if (this.x === this.border[0]) return;
          this.x -= 1;
        }
        return this.y;
      }

      draw() {
        ctx.fillStyle = this.color;
        switch (this.texture) {
          case 0:
            ctx.fillRect(
              0 + 40 * this.x,
              0 + 40 * this.y,
              this.width,
              this.height
            );
            ctx.fillRect(
              40 + 40 * this.x,
              40 + 40 * this.y,
              this.width,
              this.height
            );
            ctx.fillRect(
              0 + 40 * this.x,
              40 + 40 * this.y,
              this.width,
              this.height
            );
            break;
          case 1:
            ctx.fillRect(
              40 + 40 * this.x,
              0 + 40 * this.y,
              this.width,
              this.height
            );
            ctx.fillRect(
              40 + 40 * this.x,
              40 + 40 * this.y,
              this.width,
              this.height
            );
            ctx.fillRect(
              0 + 40 * this.x,
              40 + 40 * this.y,
              this.width,
              this.height
            );
            break;
          case 2:
            ctx.fillRect(
              0 + 40 * this.x,
              0 + 40 * this.y,
              this.width,
              this.height
            );
            ctx.fillRect(
              40 + 40 * this.x,
              40 + 40 * this.y,
              this.width,
              this.height
            );
            ctx.fillRect(
              40 + 40 * this.x,
              0 + 40 * this.y,
              this.width,
              this.height
            );
            ctx.fillRect(
              0 + 40 * this.x,
              40 + 40 * this.y,
              this.width,
              this.height
            );
            break;

          default:
            break;
        }
      }
    }

    const input = new InputHandler();
    const boxes = [];
    function h() {
      return new Promise((resolve) => {
        const box = new Qubes();
        boxes.push(box);
        function qube() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          background();
          const te = box.update(input);
          boxes.forEach((b) => b.draw());
          if (te != 21) {
            requestAnimationFrame(qube);
          } else {
            resolve();
          }
        }
        qube();
      });
    }

    for (;;) {
      await h();
    }
  }
};

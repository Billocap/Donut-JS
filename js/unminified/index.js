const FULL = Math.PI * 2;
const SUN = [
    cos(HALF / 2) * cos(Math.PI / 3),
    cos(HALF / 2) * sin(Math.PI / 3),
    sin(HALF / 2)
];
const CAM = [160, 0, 0];
const FOV = 350;
const param = [35, 50];
const HOFFSET = FULL / 100;
const VOFFSET = FULL / 40;

const PIXEL = [15 * 0.55, 15];

const ctx = document.querySelector("canvas").getContext("2d");

var angle_x = 0;
var angle_y = 0;
var angle_z = 0;

var zBuffer = new Array(Math.ceil(500 / PIXEL[1]));

for (let row = 0; row < zBuffer.length; row++) {
    zBuffer[row] = new Array(Math.ceil(500 / PIXEL[0])).fill(0);
}

var frameBuffer = new Array(Math.ceil(500 / PIXEL[1]));

for (let row = 0; row < frameBuffer.length; row++) {
    frameBuffer[row] = new Array(Math.ceil(500 / PIXEL[0])).fill(0);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,1000,1000);

    for (let a=0; a<=FULL; a+=HOFFSET) {
        for (let t=0; t<FULL; t+=VOFFSET) {
            const [w, r] = param;

            const point = rotate(Torus(a, t, w, r), angle_x, angle_y, angle_z);
            const normal = rotate(Torus(a, t, w + 2, r), angle_x, angle_y, angle_z);

            const na = normal[0] - point[0];
            const nb = normal[1] - point[1];
            const nc = normal[2] - point[2];

            const d = 1 / Distance(point, CAM);

            const [sx, sy, sz] = SUN;

            const lit = (na * sx) + (nb * sy) + (nc * sz);

            const [x, y] = Project(point, CAM, FOV);

            const nx = ((250 + x) - ((250 + x) % PIXEL[0])) / PIXEL[0];
            const ny = ((250 + y) - ((250 + y) % PIXEL[1])) / PIXEL[1];

            if (zBuffer[ny][nx] < d) {
                zBuffer[ny][nx] = d;

                frameBuffer[ny][nx] = (lit + 1) / 2;
            }
        }
    }

    frameBuffer.forEach((row, y) => {
        row.forEach((cell, x) => {
            ctx.font = `${(PIXEL[1])}px Consolas`;

            ctx.fillStyle = `white`;

            ctx.fillText(" .,-~:;!=*#$@"[Math.round(cell / (1 / 12))], x * PIXEL[0], y * PIXEL[1]);

            zBuffer[y][x] = 0;
            frameBuffer[y][x] = 0;
        });
    });

    angle_x += 0.01 + Math.random() * 0.02;
    angle_y += 0.01 + Math.random() * 0.02;
    angle_z += 0.01 + Math.random() * 0.02;
}

var mainLoop = setInterval(draw, 50 / 3);
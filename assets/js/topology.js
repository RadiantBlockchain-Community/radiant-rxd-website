// Noise implementation
const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

let perlin_octaves = 4;
let perlin_amp_falloff = 0.5;

const scaled_cosine = (i) => 0.5 * (1.0 - Math.cos(i * Math.PI));

let perlin = null;

function noise(x, y = 0, z = 0) {
  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  if (x < 0) x = -x;
  if (y < 0) y = -y;
  if (z < 0) z = -z;

  let xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  let xf = x - xi;
  let yf = y - yi;
  let zf = z - zi;
  let rxf, ryf;

  let r = 0;
  let ampl = 0.5;

  let n1, n2, n3;

  for (let o = 0; o < perlin_octaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = perlin[of & PERLIN_SIZE];
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = perlin[of & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
}

// Topology lines
let canvas, ctx;
let inputValues = [];
let thresholdIncrement = 5;
let thickLineThresholdMultiple = 3;
let res = 8;
let lineColor = "rgba(0, 122, 116, 0.1)"; // Default line color

let cols, rows;
let noiseMin = 100;
let noiseMax = 0;

// {{ Add theme color palettes }}
const themeColors = {
  light: {
    lineColor: "rgba(0, 122, 116, 0.05)"
  },
  dark: {
    lineColor: "rgba(0, 122, 116, 0.1)"
  }
};

// {{ Function to determine the current theme }}
function getCurrentTheme() {
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme === 'light') return 'light';
  if (theme === 'dark') return 'dark';
  if (theme === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default to 'dark' if no valid theme is set
}

// {{ Function to update topology colors based on the current theme }}
function updateThemeColors() {
  const currentTheme = getCurrentTheme();
  lineColor = themeColors[currentTheme].lineColor;
  render(); // Re-render the topology with the new color
}

function setupCanvas() {
  canvas = document.getElementById("topology");
  ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Could not get canvas context");
    return;
  }
  
  canvasSize();
  window.addEventListener("resize", canvasSize);
}

function canvasSize() {
  const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  cols = Math.floor(canvas.width / res) + 1;
  rows = Math.floor(canvas.height / res) + 1;

  generateNoise();
  render();
}

function generateNoise() {
  for (let y = 0; y < rows; y++) {
    inputValues[y] = [];
    for (let x = 0; x <= cols; x++) {
      inputValues[y][x] = noise(x * 0.02, y * 0.02) * 100;
      if (inputValues[y][x] < noiseMin) noiseMin = inputValues[y][x];
      if (inputValues[y][x] > noiseMax) noiseMax = inputValues[y][x];
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const roundedNoiseMin = Math.floor(noiseMin / thresholdIncrement) * thresholdIncrement;
  const roundedNoiseMax = Math.ceil(noiseMax / thresholdIncrement) * thresholdIncrement;

  for (
    let threshold = roundedNoiseMin;
    threshold < roundedNoiseMax;
    threshold += thresholdIncrement
  ) {
    renderAtThreshold(threshold);
  }
}

function renderAtThreshold(threshold) {
  ctx.beginPath();
  ctx.strokeStyle = lineColor; // Use the updated line color
  ctx.lineWidth =
    threshold % (thresholdIncrement * thickLineThresholdMultiple) === 0
      ? 2
      : 1;

  for (let y = 0; y < inputValues.length - 1; y++) {
    for (let x = 0; x < inputValues[y].length - 1; x++) {
      if (
        inputValues[y][x] > threshold &&
        inputValues[y][x + 1] > threshold &&
        inputValues[y + 1][x + 1] > threshold &&
        inputValues[y + 1][x] > threshold
      )
        continue;
      if (
        inputValues[y][x] < threshold &&
        inputValues[y][x + 1] < threshold &&
        inputValues[y + 1][x + 1] < threshold &&
        inputValues[y + 1][x] < threshold
      )
        continue;

      let gridValue = binaryToType(
        inputValues[y][x] > threshold ? 1 : 0,
        inputValues[y][x + 1] > threshold ? 1 : 0,
        inputValues[y + 1][x + 1] > threshold ? 1 : 0,
        inputValues[y + 1][x] > threshold ? 1 : 0
      );

      placeLines(gridValue, x, y, threshold);
    }
  }
  ctx.stroke();
}

function placeLines(gridValue, x, y, threshold) {
  let nw = inputValues[y][x];
  let ne = inputValues[y][x + 1];
  let se = inputValues[y + 1][x + 1];
  let sw = inputValues[y + 1][x];
  let a, b, c, d;

  switch (gridValue) {
    case 1:
    case 14:
      c = [x * res + res * linInterpolate(sw, se, threshold), y * res + res];
      d = [x * res, y * res + res * linInterpolate(nw, sw, threshold)];
      line(d, c);
      break;
    case 2:
    case 13:
      b = [x * res + res, y * res + res * linInterpolate(ne, se, threshold)];
      c = [x * res + res * linInterpolate(sw, se, threshold), y * res + res];
      line(b, c);
      break;
    case 3:
    case 12:
      b = [x * res + res, y * res + res * linInterpolate(ne, se, threshold)];
      d = [x * res, y * res + res * linInterpolate(nw, sw, threshold)];
      line(d, b);
      break;
    case 11:
    case 4:
      a = [x * res + res * linInterpolate(nw, ne, threshold), y * res];
      b = [x * res + res, y * res + res * linInterpolate(ne, se, threshold)];
      line(a, b);
      break;
    case 5:
      a = [x * res + res * linInterpolate(nw, ne, threshold), y * res];
      b = [x * res + res, y * res + res * linInterpolate(ne, se, threshold)];
      c = [x * res + res * linInterpolate(sw, se, threshold), y * res + res];
      d = [x * res, y * res + res * linInterpolate(nw, sw, threshold)];
      line(d, a);
      line(c, b);
      break;
    case 6:
    case 9:
      a = [x * res + res * linInterpolate(nw, ne, threshold), y * res];
      c = [x * res + res * linInterpolate(sw, se, threshold), y * res + res];
      line(c, a);
      break;
    case 7:
    case 8:
      a = [x * res + res * linInterpolate(nw, ne, threshold), y * res];
      d = [x * res, y * res + res * linInterpolate(nw, sw, threshold)];
      line(d, a);
      break;
    case 10:
      a = [x * res + res * linInterpolate(nw, ne, threshold), y * res];
      b = [x * res + res, y * res + res * linInterpolate(ne, se, threshold)];
      c = [x * res + res * linInterpolate(sw, se, threshold), y * res + res];
      d = [x * res, y * res + res * linInterpolate(nw, sw, threshold)];
      line(a, b);
      line(c, d);
      break;
    default:
      break;
  }
}

function line(from, to) {
  ctx.moveTo(from[0], from[1]);
  ctx.lineTo(to[0], to[1]);
}

function linInterpolate(x0, x1, threshold, y0 = 0, y1 = 1) {
  if (x0 === x1) {
    return 0;
  }

  return y0 + ((y1 - y0) * (threshold - x0)) / (x1 - x0);
}

function binaryToType(nw, ne, se, sw) {
  let a = [nw, ne, se, sw];
  return a.reduce((res, x) => (res << 1) | x);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupCanvas();

  // Initial theme color setup after canvas is ready
  updateThemeColors();

  // Listen for theme changes and update colors accordingly
  const themeSwitch = document.querySelector('.js-mode-switch');
  if (themeSwitch) {
    themeSwitch.addEventListener('change', updateThemeColors);
  }
});
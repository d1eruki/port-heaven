import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Черновая форма по hero-body-reference.png, а не восстановление скрытой анатомии.
// Условная высота и глубина выбраны для просмотра. Скелета и весов здесь пока нет.
// Запуск: node scripts/build-hero-body.mjs
const output = fileURLToPath(new URL("../src/assets/models/hero-body.glb", import.meta.url));
// Обводка видимого объёма тела в пикселях выбранного референса (1086 × 1448).
// Это контуры тела под одеждой, а не внешний контур футболки и джинсов.
// Скрытые кисти и задняя поверхность восстановлены приблизительно.
const contours = [
  { name: "torso-neck-pelvis", depth: 0.105, roundness: 0.137, z: 0, points: [
    [567,326],[589,323],[619,306],[643,307],[651,334],[679,350],
    [699,371],[714,398],[704,437],[675,476],[664,520],[650,568],
    [634,624],[625,678],[632,722],[652,765],[671,811],[655,859],
    [614,875],[569,861],[535,847],[495,864],[451,852],[432,816],
    [440,769],[455,716],[452,681],[466,625],[475,570],[481,519],
    [493,473],[501,422],[510,389],[536,368],[560,351]
  ] },
  { name: "far-arm", depth: 0.042, roundness: 0.044, z: -0.045, points: [
    [512,404],[525,434],[504,475],[490,516],[477,555],[461,592],
    [444,632],[433,663],[425,691],[433,711],[445,728],[446,749],
    [421,759],[400,736],[399,708],[410,677],[422,643],[432,606],
    [446,570],[456,527],[471,482],[479,441],[492,416]
  ] },
  { name: "near-arm", depth: 0.052, roundness: 0.059, z: 0.018, points: [
    [689,368],[717,377],[736,403],[748,438],[753,477],[763,516],
    [765,547],[754,580],[736,614],[718,644],[700,670],[680,697],
    [657,726],[635,747],[615,735],[609,713],[627,687],[645,663],
    [663,637],[678,610],[689,581],[699,552],[697,519],[686,481],
    [672,448],[666,411],[671,385]
  ] },
  { name: "far-hand", depth: 0.02, roundness: 0.029, z: 0.075, points: [
    [410,726],[433,725],[447,741],[453,762],[450,786],[439,803],
    [421,798],[411,782],[401,764],[399,743]
  ] },
  { name: "near-hand", depth: 0.022, roundness: 0.038, z: 0.09, points: [
    [619,721],[642,734],[651,749],[641,771],[626,797],[607,815],
    [590,820],[584,805],[591,784],[596,765],[590,771],[579,768],
    [585,751],[599,734]
  ] },
  { name: "far-leg", depth: 0.077, roundness: 0.077, z: -0.021, points: [
    [446,791],[484,783],[525,811],[538,854],[526,902],[515,948],
    [513,990],[511,1030],[504,1072],[495,1114],[488,1160],
    [482,1207],[478,1248],[473,1273],[440,1288],[415,1274],
    [417,1235],[421,1190],[419,1149],[411,1115],[407,1081],
    [416,1042],[420,1009],[411,977],[402,946],[402,904],
    [411,859],[424,818]
  ] },
  { name: "near-leg", depth: 0.083, roundness: 0.085, z: 0.015, points: [
    [547,803],[585,786],[622,805],[643,842],[647,883],[636,922],
    [630,952],[641,986],[662,1025],[676,1061],[685,1106],
    [697,1154],[709,1196],[716,1236],[711,1283],[690,1310],
    [658,1319],[637,1291],[627,1246],[612,1201],[597,1157],
    [585,1115],[568,1078],[552,1044],[541,1011],[540,978],
    [548,945],[545,905],[539,864]
  ] },
  { name: "far-foot", depth: 0.056, roundness: 0.06, z: 0.045, points: [
    [432,1257],[469,1255],[484,1274],[484,1293],[461,1308],
    [433,1318],[406,1320],[381,1317],[354,1310],[333,1302],
    [329,1287],[345,1277],[365,1274],[387,1271],[407,1261]
  ] },
  { name: "near-foot", depth: 0.06, roundness: 0.063, z: 0.062, points: [
    [658,1282],[695,1285],[714,1305],[709,1335],[690,1358],
    [663,1368],[637,1370],[612,1365],[589,1357],[579,1343],
    [583,1326],[601,1313],[625,1303],[646,1290]
  ] },
];
// Сглаживаем ломаную обводки, сохраняя её опорные точки.
for (const contour of contours) {
  const points = contour.points;
  const smooth = [];
  for (let i = 0; i < points.length; i++) {
    const p0 = points[(i + points.length - 1) % points.length];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const p3 = points[(i + 2) % points.length];
    for (let sample = 0; sample < 4; sample++) {
      const t = sample / 4;
      smooth.push([0, 1].map((axis) => 0.5 * (2 * p1[axis] + (-p0[axis] + p2[axis]) * t + (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t * t + (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t * t * t)));
    }
  }
  contour.points = smooth;
}
const scale = 0.00125;
const convert = ([px, py]) => [(px - 550) * scale, (1390 - py) * scale];
const shapes = contours.map((contour) => ({ ...contour, polygon: contour.points.map(convert) }));
const step = 0.005;
const origin = [-0.32, -0.015, -0.18];
const dimensions = [122, 282, 79];
const [nx, ny, nz] = dimensions;
const indexOf = (x, y, z) => (y * nz + z) * nx + x;
const field = new Float32Array(nx * ny * nz).fill(10);
const smoothMin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
// Горизонтальные сечения обведённого объёма. Каждое получает округлую
// глубину, при этом его ширина и смещение остаются взятыми с изображения.
function contourSection(py, polygon) {
  const crossings = [];
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[j];
    const b = polygon[i];
    if ((a[1] > py) !== (b[1] > py)) crossings.push(a[0] + (py - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
  }
  if (crossings.length < 2) return null;
  return [Math.min(...crossings), Math.max(...crossings)];
}
for (const shape of shapes) {
  for (let y = 0; y < ny; y++) {
    const section = contourSection(origin[1] + y * step, shape.polygon);
    if (!section) continue;
    const centerX = (section[0] + section[1]) / 2;
    const radiusX = Math.max(step * 0.25, (section[1] - section[0]) / 2);
    const depth = Math.min(shape.depth, radiusX * 0.88);
    const x0 = Math.max(0, Math.floor((section[0] - origin[0] - step * 4) / step));
    const x1 = Math.min(nx - 1, Math.ceil((section[1] - origin[0] + step * 4) / step));
    for (let x = x0; x <= x1; x++) {
      const dx = (origin[0] + x * step - centerX) / radiusX;
      for (let z = 0; z < nz; z++) {
        const dz = (origin[2] + z * step - shape.z) / depth;
        const distance = (Math.hypot(dx, dz) - 1) * Math.min(radiusX, depth);
        const index = indexOf(x, y, z);
        field[index] = smoothMin(field[index], distance, 0.004);
      }
    }
  }
}

// Убираем резкие переходы поля между частями до извлечения поверхности.
for (let pass = 0; pass < 3; pass++) {
  const previous = field.slice();
  for (let y = 1; y < ny - 1; y++) for (let z = 1; z < nz - 1; z++) for (let x = 1; x < nx - 1; x++) {
    const i = indexOf(x, y, z);
    if (Math.abs(previous[i]) > 0.03) continue;
    const neighbors = [previous[i - 1], previous[i + 1], previous[i - nx], previous[i + nx], previous[i - nx * nz], previous[i + nx * nz]];
    if (neighbors.some((value) => Math.abs(value) > 0.08)) continue;
    field[i] = previous[i] * 0.55 + neighbors.reduce((sum, value) => sum + value, 0) * 0.075;
  }
}

// Извлечение единой поверхности из объёма: тетраэдры делят каждую ячейку сетки.
const corners = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
const tetrahedra = [[0, 5, 1, 6], [0, 1, 2, 6], [0, 2, 3, 6], [0, 3, 7, 6], [0, 7, 4, 6], [0, 4, 5, 6]];
const positions = [];
const normals = [];
const triangles = [];
const edgeVertices = new Map();
const gradient = (id) => {
  const x = id % nx;
  const z = Math.floor(id / nx) % nz;
  const y = Math.floor(id / (nx * nz));
  return [field[indexOf(Math.min(x + 1, nx - 1), y, z)] - field[indexOf(Math.max(x - 1, 0), y, z)], field[indexOf(x, Math.min(y + 1, ny - 1), z)] - field[indexOf(x, Math.max(y - 1, 0), z)], field[indexOf(x, y, Math.min(z + 1, nz - 1))] - field[indexOf(x, y, Math.max(z - 1, 0))]];
};
const pointOf = (id) => [origin[0] + (id % nx) * step, origin[1] + Math.floor(id / (nx * nz)) * step, origin[2] + (Math.floor(id / nx) % nz) * step];
const vertexOn = (a, b) => {
  const key = a < b ? `${a}:${b}` : `${b}:${a}`;
  if (edgeVertices.has(key)) return edgeVertices.get(key);
  const t = field[a] / (field[a] - field[b]);
  const start = pointOf(a);
  const end = pointOf(b);
  const ga = gradient(a);
  const gb = gradient(b);
  const n = ga.map((v, axis) => v * (1 - t) + gb[axis] * t);
  const length = Math.hypot(...n) || 1;
  const id = positions.length / 3;
  positions.push(...start.map((v, axis) => v * (1 - t) + end[axis] * t));
  normals.push(...n.map((v) => v / length));
  edgeVertices.set(key, id);
  return id;
};
const triangle = (a, b, c) => {
  const p = [a, b, c].map((id) => positions.slice(id * 3, id * 3 + 3));
  const u = p[1].map((v, axis) => v - p[0][axis]);
  const v = p[2].map((value, axis) => value - p[0][axis]);
  const cross = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const outward = cross.reduce((sum, value, axis) => sum + value * normals[a * 3 + axis], 0);
  if (Math.hypot(...cross) < 1e-12) return;
  triangles.push(a, ...(outward >= 0 ? [b, c] : [c, b]));
};
for (let y = 0; y < ny - 1; y++) {
  for (let z = 0; z < nz - 1; z++) {
    for (let x = 0; x < nx - 1; x++) {
      const ids = corners.map(([dx, dy, dz]) => indexOf(x + dx, y + dy, z + dz));
      const values = ids.map((id) => field[id]);
      if (values.every((value) => value >= 0) || values.every((value) => value < 0)) continue;
      for (const tetra of tetrahedra) {
        const inside = tetra.filter((corner) => values[corner] < 0).map((corner) => ids[corner]);
        const outside = tetra.filter((corner) => values[corner] >= 0).map((corner) => ids[corner]);
        if (inside.length === 1 || inside.length === 3) {
          const single = inside.length === 1 ? inside[0] : outside[0];
          const others = inside.length === 1 ? outside : inside;
          triangle(...others.map((id) => vertexOn(single, id)));
        } else if (inside.length === 2) {
          const a = vertexOn(inside[0], outside[0]);
          const b = vertexOn(inside[1], outside[0]);
          const c = vertexOn(inside[1], outside[1]);
          const d = vertexOn(inside[0], outside[1]);
          triangle(a, b, c);
          triangle(a, c, d);
        }
      }
    }
  }
}

// Отдельная гладкая болванка головы служит только ориентиром пропорций.
const headPositions = [];
const headNormals = [];
const headTriangles = [];
const rings = 40;
const segments = 64;
const radii = [0.132, 0.171, 0.125];
const headTilt = 0.39;
const headCenter = convert([526, 224]);
for (let ring = 0; ring <= rings; ring++) {
  const phi = Math.PI * ring / rings;
  for (let segment = 0; segment <= segments; segment++) {
    const theta = 2 * Math.PI * segment / segments;
    const unit = [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
    const hx = unit[0] * radii[0];
    const hy = unit[1] * radii[1];
    headPositions.push(headCenter[0] + hx * Math.cos(headTilt) - hy * Math.sin(headTilt), headCenter[1] + hx * Math.sin(headTilt) + hy * Math.cos(headTilt), unit[2] * radii[2]);
    const normal = unit.map((v, axis) => v / radii[axis]);
    const length = Math.hypot(...normal);
    headNormals.push((normal[0] * Math.cos(headTilt) - normal[1] * Math.sin(headTilt)) / length, (normal[0] * Math.sin(headTilt) + normal[1] * Math.cos(headTilt)) / length, normal[2] / length);
    if (ring < rings && segment < segments) {
      const a = ring * (segments + 1) + segment;
      const b = a + segments + 1;
      if (ring > 0) headTriangles.push(a, a + 1, b);
      if (ring < rings - 1) headTriangles.push(a + 1, b + 1, b);
    }
  }
}

const buffers = [];
const views = [];
const accessors = [];
let offset = 0;
const store = (data, type, target) => {
  const componentType = data instanceof Uint32Array ? 5125 : 5126;
  const bytes = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  const view = views.length;
  views.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, target });
  buffers.push(bytes);
  offset += bytes.length;
  const descriptor = { bufferView: view, componentType, count: data.length / (type === "VEC3" ? 3 : 1), type };
  if (type === "VEC3") {
    descriptor.min = [Infinity, Infinity, Infinity];
    descriptor.max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < data.length; i++) {
      const axis = i % 3;
      descriptor.min[axis] = Math.min(descriptor.min[axis], data[i]);
      descriptor.max[axis] = Math.max(descriptor.max[axis], data[i]);
    }
  }
  accessors.push(descriptor);
  return accessors.length - 1;
};
const mesh = (name, p, n, t, material) => ({ name, primitives: [{ attributes: { POSITION: store(new Float32Array(p), "VEC3", 34962), NORMAL: store(new Float32Array(n), "VEC3", 34962) }, indices: store(new Uint32Array(t), "SCALAR", 34963), material }] });
const meshes = [mesh("body-base", positions, normals, triangles, 0), mesh("head-placeholder", headPositions, headNormals, headTriangles, 1)];
const document = {
  asset: { version: "2.0", generator: "Port Heaven body blockout; traced reference contours with inferred depth" },
  scene: 0,
  scenes: [{ name: "Hero body blockout", nodes: [0, 1] }],
  nodes: [{ name: "body-base", mesh: 0 }, { name: "head-placeholder", mesh: 1 }],
  meshes,
  materials: [
    { name: "neutral-body", pbrMetallicRoughness: { baseColorFactor: [0.36, 0.46, 0.56, 1], metallicFactor: 0, roughnessFactor: 0.72 } },
    { name: "placeholder-head", pbrMetallicRoughness: { baseColorFactor: [0.46, 0.51, 0.57, 1], metallicFactor: 0, roughnessFactor: 0.8 } },
  ],
  buffers: [{ byteLength: offset }],
  bufferViews: views,
  accessors,
  extras: { reference: "../hero-body-reference.png", pose: "reference pose, traced in image plane", contours, referenceWidth: 1086, referenceHeight: 1448, scale, pixelCenterX: 550, pixelBaseline: 1390, approximateScale: true, rigged: false, headIsPlaceholder: true, generationCommand: "node scripts/build-hero-body.mjs" },
};
let json = Buffer.from(JSON.stringify(document));
json = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)]);
const binary = Buffer.concat(buffers);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + json.length + 8 + binary.length, 8);
const chunk = (length, type) => { const buffer = Buffer.alloc(8); buffer.writeUInt32LE(length, 0); buffer.writeUInt32LE(type, 4); return buffer; };
await mkdir(new URL("../src/assets/models/", import.meta.url), { recursive: true });
await writeFile(output, Buffer.concat([header, chunk(json.length, 0x4e4f534a), json, chunk(binary.length, 0x004e4942), binary]));
console.log(`Модель сохранена: ${output}`);

import {
  Mat4,
  degToRad
} from "./math3d.js";

import {
  Renderer
} from "./renderer.js";

import {
  createCube,
  createCylinder,
  createSphere,
  createCone
} from "./shapes.js";

import {
  GameObject
} from "./gameObject.js";


const canvas =
  document.getElementById("glCanvas");

const gl =
  canvas.getContext("webgl2");

if (!gl) {
  throw new Error("WebGL2 unavailable");
}

const vertexShaderSource = `#version 300 es

in vec3 a_position;
in vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec3 v_normal;

void main() {

  v_normal =
    mat3(u_model) * a_normal;

  gl_Position =
    u_projection *
    u_view *
    u_model *
    vec4(a_position, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision highp float;

in vec3 v_normal;

uniform vec3 u_color;

out vec4 outColor;

void main() {

  vec3 N = normalize(v_normal);

  // Direction of our light
  vec3 L = normalize(vec3(2.0, 3.0, 4.0));

  // Diffuse lighting
  float diffuse =
    max(dot(N, L), 0.0);

  // Ambient lighting
  float ambient = 0.25;

  vec3 baseColor = u_color;

  vec3 finalColor =
    baseColor *
    (ambient + diffuse * 0.75);

  outColor =
    vec4(finalColor, 1.0);
}`;

function createShader(type, source) {

  const shader =
    gl.createShader(type);

  gl.shaderSource(
    shader,
    source
  );

  gl.compileShader(shader);

  if (!gl.getShaderParameter(
    shader,
    gl.COMPILE_STATUS
  )) {
    throw new Error(
      gl.getShaderInfoLog(shader)
    );
  }

  return shader;
}


const vertexShader =
  createShader(
    gl.VERTEX_SHADER,
    vertexShaderSource
  );

const fragmentShader =
  createShader(
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

const program =
  gl.createProgram();

gl.attachShader(
  program,
  vertexShader
);

gl.attachShader(
  program,
  fragmentShader
);

gl.linkProgram(program);

if (!gl.getProgramParameter(
  program,
  gl.LINK_STATUS
)) {
  throw new Error(
    gl.getProgramInfoLog(program)
  );
}

gl.useProgram(program);

const model =
  Mat4.identity();

const cameraPosition = [
  2.5,
  2.0,
  3.5
];

const cameraTarget = [
  0.0,
  0.0,
  0.0
];

const cameraUp = [
  0.0,
  1.0,
  0.0
];

const view =
  Mat4.lookAt(
    cameraPosition,
    cameraTarget,
    cameraUp
  );

const projection =
  Mat4.perspective(
    degToRad(60),
    canvas.width / canvas.height,
    0.1,
    100.0
  );
 
const colorLocation =
  gl.getUniformLocation(program, "u_color");

const modelLocation =
  gl.getUniformLocation(
    program,
    "u_model"
  );

const viewLocation =
  gl.getUniformLocation(
    program,
    "u_view"
  );

const projectionLocation =
  gl.getUniformLocation(
    program,
    "u_projection"
  );


gl.uniformMatrix4fv(
  modelLocation,
  false,
  model
);

gl.uniformMatrix4fv(
  viewLocation,
  false,
  view
);

gl.uniformMatrix4fv(
  projectionLocation,
  false,
  projection
);

const renderer =
  new Renderer(gl, program);

//Buat2 dibawah disini, createcube manggil kubus dari shapes.js, klo bentuk baru harus buat constnya dulu
//contoh dibawah cara makenya

const cubeMesh = renderer.createMesh(
  "cube",
  createCube()
);

const cylinderMesh = renderer.createMesh(
  "cylinder",
  createCylinder(0.5, 3, 32) //radius, tinggi, segment/seberapa smooth
);

const sphereMesh = renderer.createMesh(
  "sphere",
  createSphere(1, 32, 24) //radius, segment, rings
);

const coneMesh = renderer.createMesh(
  "cone",
  createCone(1, 2, 32) //radius, tinggi, segmen
);

//ini parent, ini gak dipanggil, lebih ke nama grupnya aja
//Kalau mau edit seluruh grup, edit disini
const building = new GameObject({

  name: "Building",

  position: [0, 0, 0],

  rotation: [0, 0, 0],

  scale: [1, 1, 1]

});

//child 1 badannya
const body = new GameObject({

  name: "Body",

  geometry: cubeMesh,

  position: [0, 0, 0],

  scale: [1, 1, 1],

  color: [0.2, 0.6, 1]

});

// child 2 ceritanya atap
const roof = new GameObject({

  name: "Roof",

  geometry: cubeMesh, //tipe bentuk: kek cube/sphere/cone/dll. Tambahinnya di shapes.js btw klo mau.

  position: [0, 0.5, 0], // [-1 = kiri +1 = kanan, -1 = turun +1 = naik, -1 = mundur +1 = maju ]

  scale: [1.5, 0.2, 1.3], // [-1 = kurus ke samping, -1 = pendek, -1 = kurus tapi ke dalem ]

  color: [0.8, 0.2, 0.2] //rgb

});

// child 3, depan gedungnya/pintu
const entrance = new GameObject({

  name: "Entrance",

  geometry: cubeMesh,

  position: [0.1, -0.15, 0.65],

  scale: [0.4, 0.5, 0.1],

  color: [0.5, 0.2, 0.15]


});


//ini konekin ke parent(building). Sintaksnya nama_parent.add(nama_child)
building.add(body);
building.add(roof);
building.add(entrance);

//tes pohon pake silinder + bola. 
//Klo butuh radius/segment/tinggi beda2 bisa buat const banyak

const trunkMesh = renderer.createMesh(
  "treeTrunk",
  createCylinder(0.2, 2, 16)
);

const leavesMesh = renderer.createMesh(
  "treeLeaves",
  createSphere(0.9, 16, 12)
);

// Parent
const tree = new GameObject({
  name: "Tree",
  position: [-2, -1, 0]
});

// Trunk
const trunk = new GameObject({
  name: "Trunk",
  geometry: trunkMesh,
  position: [0, 1, 0],
  color: [0.35, 0.18, 0.08]
});

// Leaves
const leaves = new GameObject({
  name: "Leaves",
  geometry: leavesMesh,
  position: [0, 2.3, 0],
  scale: [1.2, 1, 1.2],
  color: [0.1, 0.5, 0.15]
});

// Connect children
tree.add(trunk);
tree.add(leaves);


// panggil yg mau di render, tes aja klo di komen 1 yg ilang yg mana
const objects = [
  body,
  roof,
  entrance,
  trunk,
  leaves
];

gl.enable(gl.DEPTH_TEST);

gl.viewport(
    0,
  0,
  canvas.width,
  canvas.height
);

gl.clearColor(
  0.05,
  0.05,
  0.1,
  1.0
);

gl.clear(
  gl.COLOR_BUFFER_BIT |
  gl.DEPTH_BUFFER_BIT
);

for (const object of objects) {

  const model =
    object.createModelMatrix();

  gl.uniformMatrix4fv(
    modelLocation,
    false,
    model
  );

  gl.uniform3fv(
    colorLocation,
    object.color
  );

  renderer.drawMesh(
    object.geometry
  );

}

import {
  Mat4,
  degToRad,
  normalMatrixFromMat4
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
in vec2 a_texCoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normalMatrix;

out vec3 v_normal;
out vec3 v_worldPosition;
out vec2 v_texCoord;

void main() {

    vec4 worldPosition =
        u_model * vec4(a_position, 1.0);

    v_worldPosition = worldPosition.xyz;

    v_normal =
        normalize(u_normalMatrix * a_normal);

    v_texCoord = a_texCoord,

    gl_Position =
        u_projection *
        u_view *
        worldPosition;
}`;

const fragmentShaderSource = `#version 300 es

precision highp float;

in vec3 v_normal;
in vec3 v_worldPosition;
in vec2 v_texCoord;

uniform vec3 u_color;
uniform vec3 u_lightDirection;
uniform vec3 u_viewPosition;
uniform sampler2D u_texture;
uniform bool u_useTexture;

uniform float u_ambientStrength;
uniform float u_diffuseStrength;
uniform float u_specularStrength;
uniform float u_shininess;

out vec4 outColor;

void main() {

    vec3 N = normalize(v_normal);
    vec3 L = normalize(u_lightDirection);
    vec3 V = normalize(
        u_viewPosition - v_worldPosition
    );

    vec4 texel = vec4(1.0);
    vec3 baseColor = u_color;

    if (u_useTexture) {
        texel = texture(u_texture, v_texCoord);

        if (u_useTexture && texel.a < 0.1) {
            discard;
        }

        baseColor = texel.rgb;
    }


    vec3 ambient =
        u_ambientStrength * baseColor;

    float diffuseFactor =
        max(dot(N, L), 0.0);

    vec3 diffuse =
        u_diffuseStrength *
        diffuseFactor *
        baseColor;

    // Specular
    vec3 R = reflect(-L, N);

    float specularFactor =
        pow(
            max(dot(V, R), 0.0),
            u_shininess
        );

    vec3 specular =
        u_specularStrength *
        specularFactor *
        vec3(1.0);

    if (diffuseFactor <= 0.0) {
        specular = vec3(0.0);
    }

    vec3 finalColor =
        ambient + diffuse + specular;

    outColor = vec4(finalColor, u_useTexture ? texel.a : 1.0);
}
`;

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


//edit camera disini
const cameraPosition = [
  2.5,
  -2.0,
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

const textureLocation =
  gl.getUniformLocation(
    program,
    "u_texture"
  );

const useTextureLocation =
  gl.getUniformLocation(
    program,
    "u_useTexture"
  );

gl.uniform1i(textureLocation, 0);

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

const normalMatrixLocation =
  gl.getUniformLocation(
    program,
    "u_normalMatrix"
  );


const lightDirectionLocation =
    gl.getUniformLocation(program, "u_lightDirection");

const viewPositionLocation =
    gl.getUniformLocation(program, "u_viewPosition");

const ambientLocation =
    gl.getUniformLocation(program, "u_ambientStrength");

const diffuseLocation =
    gl.getUniformLocation(program, "u_diffuseStrength");

const specularLocation =
    gl.getUniformLocation(program, "u_specularStrength");

const shininessLocation =
    gl.getUniformLocation(program, "u_shininess");

// edit cahaya disini
gl.uniform3fv(
    lightDirectionLocation,
    [2.0, 3.0, 4.0]
);

gl.uniform3fv(
    viewPositionLocation,
    cameraPosition
);

//edit lain-lain sesuai nama
gl.uniform1f(ambientLocation, 0.25);
gl.uniform1f(diffuseLocation, 0.75);
gl.uniform1f(specularLocation, 0.3);
gl.uniform1f(shininessLocation, 32.0);


const renderer =
  new Renderer(gl, program);

  
  function loadTexture(url) {

  const texture = gl.createTexture();

  gl.bindTexture(
    gl.TEXTURE_2D,
    texture
  );
  
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 255])
  );

  const image = new Image();

  image.onload = () => {
    
    gl.bindTexture(
      gl.TEXTURE_2D,
      texture
    );
    
    gl.pixelStorei(
      gl.UNPACK_FLIP_Y_WEBGL,
      true
    );

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image
    );

    gl.generateMipmap(gl.TEXTURE_2D);

  };

  image.onerror = () => {
    console.error("Failed to load texture:", url);
  };

  image.src = url;
  
  return texture;
}

//tambah file buat texture disini
const TestTexture = loadTexture(
  "./img/leaves.png"
)

//Buat2 dibawah disini, createcube manggil kubus dari shapes.js, klo bentuk baru harus buat constnya dulu
//contoh dibawah cara makenya

const cubeMesh = renderer.createMesh(
  "cube",
  createCube()
);

const tiangBawahMesh = renderer.createMesh(
  "cylinder",
  createCylinder(0.1, 4, 32) //radius, tinggi, segment/seberapa smooth
);

const tiangAtasMesh = renderer.createMesh(
  "cylinder",
  createCylinder(1.0, 0.1, 32) //radius, tinggi, segment/seberapa smooth
);

const bulatPutihDalamMesh = renderer.createMesh(
  "cylinder",
  createCylinder(0.85, 0.11, 32)
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
const tiang = new GameObject({
  name: "Tiang",
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1]
});

const tiangBawah = new GameObject({
  name: "TiangBawah",
  geometry: tiangBawahMesh,
  position: [0, -4.5, 0],
  scale: [1, 2, 1],
  color: [1, 1, 1]
});

const tiangAtas = new GameObject({
  name: "TiangAtas",
  geometry: tiangAtasMesh,
  position: [0, 0.5, 0],
  rotation: [90, 30, 0],
  scale: [1, 1, 1],
  color: [1, 0, 0]
});

const bulatPutihDalam = new GameObject({
  name: "BulatPutihDalam",
  geometry: bulatPutihDalamMesh,
  position: [0, 0.5, 0],
  rotation: [90, 30, 0],
  scale: [1, 1, 1],
  color: [1, 1, 1]
});

tiang.add(tiangBawah);
tiang.add(tiangAtas);
tiang.add(bulatPutihDalam);

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
  color: [0.1, 0.5, 0.15],
  texture : TestTexture //klo g pake texture, tinggal g usah kasih baris texture
});

// Connect children
tree.add(trunk);
tree.add(leaves);


function renderObject(object) {

  const model = object.createModelMatrix();

  if (object.geometry) {

    const normalMatrix =
      normalMatrixFromMat4(model);

    gl.uniformMatrix3fv(
      normalMatrixLocation,
      false,
      normalMatrix
    );

    gl.uniformMatrix4fv(
      modelLocation,
      false,
      model
    );

    gl.uniform3fv(
      colorLocation,
      object.color
    );

    if (object.texture) {
      gl.activeTexture(gl.TEXTURE0);

      gl.bindTexture(
        gl.TEXTURE_2D,
        object.texture
      );

      gl.uniform1i(
        useTextureLocation,
        true
      );

    } else {

      gl.uniform1i(
        useTextureLocation,
        false
      );

    }

    renderer.drawMesh(object.geometry);
  }

  for (const child of object.children) {
    renderObject(child);
  }
}

const scene = [
  //building, //tadi ini buat contoh aja
  tree,,
  tiang
  // building, --------> tadi ini buat contoh aja
  // tree


];

gl.enable(gl.DEPTH_TEST);

gl.viewport(
  0,
  0,
  canvas.width,
  canvas.height
);

gl.clearColor(0, 0, 0, 0); //biar img di css

gl.clear(
  gl.COLOR_BUFFER_BIT |
  gl.DEPTH_BUFFER_BIT
);

function animate(time) {
  const seconds = time * 0.001;

  // contoh animasi rotasi
  building.rotation[1] = seconds * 10;

  gl.clear(
    gl.COLOR_BUFFER_BIT |
    gl.DEPTH_BUFFER_BIT
  );

  for (const object of scene) {
    renderObject(object);
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
  
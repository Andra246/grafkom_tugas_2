//basic shapes

export function createCube() {

  // Inisialisasi vertex dulu. Contohnya cube intinya tiap "face" atau "sisi" pake 2 triangle
  // tiap triangle 3 titik.

  const positions = new Float32Array([

    // depan
    -0.5,-0.5, 0.5,
     0.5,-0.5, 0.5,
     0.5, 0.5, 0.5,

    -0.5,-0.5, 0.5,
     0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,

    // belakang
     0.5,-0.5,-0.5,
    -0.5,-0.5,-0.5,
    -0.5, 0.5,-0.5,

     0.5,-0.5,-0.5,
    -0.5, 0.5,-0.5,
     0.5, 0.5,-0.5,

    // kiri
    -0.5,-0.5,-0.5,
    -0.5,-0.5, 0.5,
    -0.5, 0.5, 0.5,

    -0.5,-0.5,-0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5,-0.5,

    // kanan
     0.5,-0.5, 0.5,
     0.5,-0.5,-0.5,
     0.5, 0.5,-0.5,

     0.5,-0.5, 0.5,
     0.5, 0.5,-0.5,
     0.5, 0.5, 0.5,

    // atas
    -0.5, 0.5, 0.5,
     0.5, 0.5, 0.5,
     0.5, 0.5,-0.5,

    -0.5, 0.5, 0.5,
     0.5, 0.5,-0.5,
    -0.5, 0.5,-0.5,

    // bawah
    -0.5,-0.5,-0.5,
     0.5,-0.5,-0.5,
     0.5,-0.5, 0.5,

    -0.5,-0.5,-0.5,
     0.5,-0.5, 0.5,
    -0.5,-0.5, 0.5
  ]);

  const normals = new Float32Array([

    // depan
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,
     0, 0, 1,

    // belakang
     0, 0,-1,
     0, 0,-1,
     0, 0,-1,
     0, 0,-1,
     0, 0,-1,
     0, 0,-1,

    // kiri
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    // kanan
     1, 0, 0,
     1, 0, 0,
     1, 0, 0,
     1, 0, 0,
     1, 0, 0,
     1, 0, 0,

    // atas
     0, 1, 0,
     0, 1, 0,
     0, 1, 0,
     0, 1, 0,
     0, 1, 0,
     0, 1, 0,

    // bawah
     0,-1, 0,
     0,-1, 0,
     0,-1, 0,
     0,-1, 0,
     0,-1, 0,
     0,-1, 0
  ]);

  const faceUV = [
    0, 0,
    1, 0,
    1, 1,

    0, 0,
    1, 1,
    0, 1
  ];

  const texCoords = [];

  for (let face = 0; face < 6; face++) {
    texCoords.push(...faceUV);
  }

  return {
    positions,
    normals,
    texCoords: new Float32Array(texCoords),

    vertexCount: positions.length / 3
  };
}


export function createCylinder(
  radius = 0.5,
  height = 1,
  segments = 24
  //semakin banyak segments, semakin mulus sisinya
) {

  const positions = [];
  const normals = [];

  const halfHeight = height / 2;

  for (let i = 0; i < segments; i++) {

    const angle1 = (i / segments) * Math.PI * 2;
    const angle2 = ((i + 1) / segments) * Math.PI * 2;

    const x1 = Math.cos(angle1) * radius;
    const z1 = Math.sin(angle1) * radius;

    const x2 = Math.cos(angle2) * radius;
    const z2 = Math.sin(angle2) * radius;

    const bottom1 = [x1, -halfHeight, z1];
    const top1 = [x1, halfHeight, z1];

    const bottom2 = [x2, -halfHeight, z2];
    const top2 = [x2, halfHeight, z2];

    const normal1 = [Math.cos(angle1), 0, Math.sin(angle1)];
    const normal2 = [Math.cos(angle2), 0, Math.sin(angle2)];

    positions.push(...bottom1, ...top1, ...top2);
    normals.push(...normal1, ...normal1, ...normal2);

    positions.push(...bottom1, ...top2, ...bottom2);
    normals.push(...normal1, ...normal2, ...normal2);

  }

  for (let i = 0; i < segments; i++) {

    const angle1 = (i / segments) * Math.PI * 2;
    const angle2 = ((i + 1) / segments) * Math.PI * 2;

    const x1 = Math.cos(angle1) * radius;
    const z1 = Math.sin(angle1) * radius;

    const x2 = Math.cos(angle2) * radius;
    const z2 = Math.sin(angle2) * radius;

    const bottomCenter = [0, -halfHeight, 0];
    const topCenter = [0, halfHeight, 0];

    const bottom1 = [x1, -halfHeight, z1];
    const bottom2 = [x2, -halfHeight, z2];

    const top1 = [x1, halfHeight, z1];
    const top2 = [x2, halfHeight, z2];

    positions.push(...bottomCenter, ...bottom1, ...bottom2);
    normals.push(
      0, -1, 0,
      0, -1, 0,
      0, -1, 0
    );

    positions.push(...topCenter, ...top2, ...top1);
    normals.push(
      0, 1, 0,
      0, 1, 0,
      0, 1, 0
    );

  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    vertexCount: positions.length / 3
  };

}


export function createSphere(
  radius = 0.5,
  segments = 24,
  rings = 16
) {

  const positions = [];
  const normals = [];

  for (let i = 0; i < rings; i++) {

    const theta1 = (i / rings) * Math.PI;
    const theta2 = ((i + 1) / rings) * Math.PI;

    for (let j = 0; j < segments; j++) {

      const phi1 = (j / segments) * Math.PI * 2;
      const phi2 = ((j + 1) / segments) * Math.PI * 2;

      function point(theta, phi) {

        return [
          Math.sin(theta) * Math.cos(phi),
          Math.cos(theta),
          Math.sin(theta) * Math.sin(phi)
        ];

      }

      const p1 = point(theta1, phi1);
      const p2 = point(theta2, phi1);
      const p3 = point(theta2, phi2);
      const p4 = point(theta1, phi2);

      const triangles = [
        p1, p2, p3,
        p1, p3, p4
      ];

      for (const p of triangles) {

        positions.push(
          p[0] * radius,
          p[1] * radius,
          p[2] * radius
        );

        normals.push(
          p[0],
          p[1],
          p[2]
        );

      }

    }

  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    vertexCount: positions.length / 3
  };

}


export function createCone(
  radius = 0.5,
  height = 1,
  segments = 24
) {

  const positions = [];
  const normals = [];

  const halfHeight = height / 2;

  const tip = [0, halfHeight, 0];

  function normalize(x, y, z) {

    const length = Math.hypot(x, y, z);

    return [
      x / length,
      y / length,
      z / length
    ];

  }

  for (let i = 0; i < segments; i++) {

    const angle1 = (i / segments) * Math.PI * 2;
    const angle2 = ((i + 1) / segments) * Math.PI * 2;

    const x1 = Math.cos(angle1) * radius;
    const z1 = Math.sin(angle1) * radius;

    const x2 = Math.cos(angle2) * radius;
    const z2 = Math.sin(angle2) * radius;

    const p1 = [x1, -halfHeight, z1];
    const p2 = [x2, -halfHeight, z2];

    const n1 = normalize(
      height * Math.cos(angle1),
      radius,
      height * Math.sin(angle1)
    );

    const n2 = normalize(
      height * Math.cos(angle2),
      radius,
      height * Math.sin(angle2)
    );

    positions.push(...p1, ...tip, ...p2);

    normals.push(
      ...n1,
      ...normalize(
        Math.cos(angle1) + Math.cos(angle2),
        radius / height * 2,
        Math.sin(angle1) + Math.sin(angle2)
      ),
      ...n2
    );

    positions.push(
      0, -halfHeight, 0,
      ...p2,
      ...p1
    );

    normals.push(
      0, -1, 0,
      0, -1, 0,
      0, -1, 0
    );

  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    vertexCount: positions.length / 3
  };

}

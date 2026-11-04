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
) {
  const positions = [];
  const normals = [];
  const texCoords = [];

  const halfHeight = height / 2;

  // Curved surface
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

    positions.push(
      ...bottom1, ...top1, ...top2,
      ...bottom1, ...top2, ...bottom2
    );

    normals.push(
      ...normal1, ...normal1, ...normal2,
      ...normal1, ...normal2, ...normal2
    );

    const u1 = i / segments;
    const u2 = (i + 1) / segments;

    texCoords.push(
      u1, 0,
      u1, 1,
      u2, 1,

      u1, 0,
      u2, 1,
      u2, 0
    );
  }

  // Bottom and top caps
  for (let i = 0; i < segments; i++) {
    const angle1 = (i / segments) * Math.PI * 2;
    const angle2 = ((i + 1) / segments) * Math.PI * 2;

    const x1 = Math.cos(angle1) * radius;
    const z1 = Math.sin(angle1) * radius;

    const x2 = Math.cos(angle2) * radius;
    const z2 = Math.sin(angle2) * radius;

    // Bottom
    positions.push(
      0, -halfHeight, 0,
      x1, -halfHeight, z1,
      x2, -halfHeight, z2
    );

    normals.push(
      0, -1, 0,
      0, -1, 0,
      0, -1, 0
    );

    texCoords.push(
      0.5, 0.5,
      0.5 + 0.5 * Math.cos(angle1), 0.5 + 0.5 * Math.sin(angle1),
      0.5 + 0.5 * Math.cos(angle2), 0.5 + 0.5 * Math.sin(angle2)
    );

    // Top
    positions.push(
      0, halfHeight, 0,
      x2, halfHeight, z2,
      x1, halfHeight, z1
    );

    normals.push(
      0, 1, 0,
      0, 1, 0,
      0, 1, 0
    );

    texCoords.push(
      0.5, 0.5,
      0.5 + 0.5 * Math.cos(angle2), 0.5 + 0.5 * Math.sin(angle2),
      0.5 + 0.5 * Math.cos(angle1), 0.5 + 0.5 * Math.sin(angle1)
    );
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords),
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
  const texCoords = [];

  function point(theta, phi) {
    return [
      Math.sin(theta) * Math.cos(phi),
      Math.cos(theta),
      Math.sin(theta) * Math.sin(phi)
    ];
  }

  for (let i = 0; i < rings; i++) {
    const theta1 = (i / rings) * Math.PI;
    const theta2 = ((i + 1) / rings) * Math.PI;

    for (let j = 0; j < segments; j++) {
      const phi1 = (j / segments) * Math.PI * 2;
      const phi2 = ((j + 1) / segments) * Math.PI * 2;

      const p1 = point(theta1, phi1);
      const p2 = point(theta2, phi1);
      const p3 = point(theta2, phi2);
      const p4 = point(theta1, phi2);

      const triangles = [
        { p: p1, u: j / segments, v: 1 - i / rings },
        { p: p2, u: j / segments, v: 1 - (i + 1) / rings },
        { p: p3, u: (j + 1) / segments, v: 1 - (i + 1) / rings },

        { p: p1, u: j / segments, v: 1 - i / rings },
        { p: p3, u: (j + 1) / segments, v: 1 - (i + 1) / rings },
        { p: p4, u: (j + 1) / segments, v: 1 - i / rings }
      ];

      for (const vertex of triangles) {
        const p = vertex.p;

        positions.push(
          p[0] * radius,
          p[1] * radius,
          p[2] * radius
        );

        normals.push(p[0], p[1], p[2]);

        texCoords.push(vertex.u, vertex.v);
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords),
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
  const texCoords = [];

  const halfHeight = height / 2;
  const tip = [0, halfHeight, 0];

  function normalize(x, y, z) {
    const length = Math.hypot(x, y, z);
    return [x / length, y / length, z / length];
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

    const u1 = i / segments;
    const u2 = (i + 1) / segments;

    // Curved surface
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

    texCoords.push(
      u1, 0,
      (u1 + u2) / 2, 1,
      u2, 0
    );

    // Bottom cap
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

    texCoords.push(
      0.5, 0.5,
      0.5 + 0.5 * Math.cos(angle2), 0.5 + 0.5 * Math.sin(angle2),
      0.5 + 0.5 * Math.cos(angle1), 0.5 + 0.5 * Math.sin(angle1)
    );
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords),
    vertexCount: positions.length / 3
  };
}


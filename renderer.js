export class Renderer {

  constructor(gl, program) {

    this.gl = gl;
    this.program = program;

    this.locations = {

      position:
        gl.getAttribLocation(
          program,
          "a_position"
        ),

      normal:
        gl.getAttribLocation(
          program,
          "a_normal"
        )

    };

    this.meshes = new Map();

  }

  createBuffer(data) {

    const gl = this.gl;

    const buffer =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      buffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      data,
      gl.STATIC_DRAW
    );

    return buffer;

  }

createMesh(name, geometry) {

    const gl = this.gl;

    // Create VAO
    const vao = gl.createVertexArray();

    gl.bindVertexArray(vao);

    // Create buffers
    const positionBuffer =
        this.createBuffer(geometry.positions);

    const normalBuffer =
        this.createBuffer(geometry.normals);

    // POSITION ATTRIBUTE
    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        positionBuffer
    );

    gl.enableVertexAttribArray(
        this.locations.position
    );

    gl.vertexAttribPointer(
        this.locations.position,
        3,
        gl.FLOAT,
        false,
        0,
        0
    );

    // NORMAL ATTRIBUTE
    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        normalBuffer
    );

    gl.enableVertexAttribArray(
        this.locations.normal
    );

    gl.vertexAttribPointer(
        this.locations.normal,
        3,
        gl.FLOAT,
        false,
        0,
        0
    );

    // Unbind VAO
    gl.bindVertexArray(null);

    const mesh = {
        name,
        vao,
        vertexCount:
        geometry.vertexCount ??
        geometry.positions.length / 3
    };

    this.meshes.set(name, mesh);

    return mesh;
}


  drawMesh(mesh) {

    const gl = this.gl;

    gl.bindVertexArray(
      mesh.vao
    );

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      mesh.vertexCount
    );

    gl.bindVertexArray(null);

  }

  clearMeshes() {

    const gl = this.gl;

    for (const mesh of this.meshes.values()) {

      gl.deleteVertexArray(
        mesh.vao
      );

    }

    this.meshes.clear();

  }

}

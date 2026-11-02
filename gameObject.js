import {
  Mat4,
  degToRad
} from "./math3d.js";

export class GameObject {

  constructor({
    name = "Object",
    geometry,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    color = [0.2, 0.7, 1.0]
  }) {

    this.name = name;

    this.geometry = geometry;

    this.position = [...position];

    this.rotation = [...rotation];

    this.scale = [...scale];

    this.color = [...color];

    this.children = [];

    this.parent = null;

  }

  add(child) {

    child.parent = this;

    this.children.push(child);

  }
  
  createModelMatrix() {

    const translation =
      Mat4.translation(
        this.position[0],
        this.position[1],
        this.position[2]
      );

    const rotationX =
      Mat4.rotationX(
        degToRad(this.rotation[0])
      );

    const rotationY =
      Mat4.rotationY(
        degToRad(this.rotation[1])
      );

    const rotationZ =
      Mat4.rotationZ(
        degToRad(this.rotation[2])
      );

    const scaling =
      Mat4.scaling(
        this.scale[0],
        this.scale[1],
        this.scale[2]
      );

    //transformasinya
    let localMatrix =
      Mat4.identity();

    localMatrix =
      Mat4.multiply(
        localMatrix,
        translation
      );

    localMatrix =
      Mat4.multiply(
        localMatrix,
        rotationZ
      );

    localMatrix =
      Mat4.multiply(
        localMatrix,
        rotationY
      );

    localMatrix =
      Mat4.multiply(
        localMatrix,
        rotationX
      );

    localMatrix =
      Mat4.multiply(
        localMatrix,
        scaling
      );

    // klo ini anak, inherit transformasi parent
    if (this.parent) {

      const parentMatrix =
        this.parent.createModelMatrix();

      return Mat4.multiply(
        parentMatrix,
        localMatrix
      );

    }

    return localMatrix;

  }


}

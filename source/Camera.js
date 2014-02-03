var Camera = function () {
    Object3D.call(this);

    this.matrixWorldInverse = mat4.create();
    this.fov = 75;

    mat4.invert(this.matrixWorldInverse, this.matrixWorld);
};
Camera.prototype = Object.create(Object3D.prototype);

Camera.prototype.updateMatrixWorld = function (parentMatrixWorld) {
    Object3D.prototype.updateMatrixWorld.call(this, parentMatrixWorld);

    mat4.invert(this.matrixWorldInverse, this.matrixWorld);
};
var Object3D = function () {
    this.matrix = mat4.create();
    this.matrixWorld = mat4.create();

    this.position = vec3.create();
    this.scale = vec3.create();
    vec3.set(this.scale, 1.0, 1.0, 1.0);

    this.quaternion = quat.create();

    this.children = [];
};

Object3D.prototype.updateMatrix = function () {
    mat4x.compose(this.matrix, this.position, this.quaternion, this.scale );
};

Object3D.prototype.updateMatrixWorld = function (parentMatrixWorld) {
    if (parentMatrixWorld) {
        mat4.multiply(this.matrixWorld, parentMatrixWorld, this.matrix)
    } else {
        mat4.copy(this.matrixWorld, this.matrix)
    }

    for (var a = this.children, i = 0, l = a.length; i < l; i++) {
        a[ i ].updateMatrixWorld(this.matrixWorld);
    }
};
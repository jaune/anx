
var CSS3DObject = function (element) {

    Object3D.call(this);

    this.element = element;
    this.element.style.position = 'absolute';
};
CSS3DObject.prototype = Object.create(Object3D.prototype);
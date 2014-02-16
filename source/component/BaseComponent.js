var BaseComponent = function () {
    this.propertyName = null;
    this.facade = {};
};
BaseComponent.prototype.defineFacadeProperty = function (name) {
    Object.defineProperty(this.facade, name, {
        enumerable: false,
        configurable: false,
        get: (function (name) { return this[name] }).bind(this, name)
    });
};
BaseComponent.prototype.attach = function (entity) {
    if (!this.propertyName) {
        throw new Error('TODO');
    }
    Object.seal(this.facade);
    entity[this.propertyName] = this;
};

BaseComponent.prototype.detach = function (entity) {
    if (!this.propertyName) {
        throw new Error('TODO');
    }
    delete entity[this.propertyName];
};
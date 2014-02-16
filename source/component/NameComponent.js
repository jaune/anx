var NameComponent = function (value) {
    BaseComponent.apply(this, arguments);
    this.propertyName = 'name';
    this.value = value;

    this.defineFacadeProperty('value');
};
NameComponent.prototype = Object.create(BaseComponent.prototype);
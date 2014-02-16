var GaugeComponent = function (value, max) {
    BaseComponent.apply(this, arguments);
    this.value = value;
    this.max = max;

    this.defineFacadeProperty('value');
    this.defineFacadeProperty('max');
};
GaugeComponent.prototype = Object.create(BaseComponent.prototype);
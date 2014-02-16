var HPGaugeComponent = function () {
    GaugeComponent.apply(this, arguments);
    this.propertyName = 'hp';
};
HPGaugeComponent.prototype = Object.create(GaugeComponent.prototype);
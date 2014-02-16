/**
 * Created by jaune on 16/02/14.
 */
var MPGaugeComponent = function () {
    GaugeComponent.apply(this, arguments);
    this.propertyName = 'mp';
};
MPGaugeComponent.prototype = Object.create(GaugeComponent.prototype);
var PuppetComponent = function (puppeteer) {
    BaseComponent.apply(this, arguments);

    this.propertyName = 'puppet';

    this.puppeteer = puppeteer;
};
PuppetComponent.prototype = Object.create(BaseComponent.prototype);

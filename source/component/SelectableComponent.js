var SelectableComponent = function (onSelect) {
    BaseComponent.apply(this, arguments);
    this.propertyName = 'selectable';

    this.onSelect = onSelect || function (entity) {};
};
SelectableComponent.prototype = Object.create(BaseComponent.prototype);

SelectableComponent.prototype.attach = function (entity) {
    this.listener = this.onSelect.bind(this, entity);

    BaseComponent.prototype.attach.apply(this, arguments);
};

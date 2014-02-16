var Entity = function (id) {
    this.id = id;

    this.on = {
        attachComponent: new ListenerList(),
        detachComponent: new ListenerList()
    };
};

Entity.prototype.attachComponent = function (component) {
    component.attach(this);
    this.on.attachComponent.dispatch(this, component, component.propertyName);
};

Entity.prototype.detachComponent = function (component_alias) {
    var component = this[component_alias];

    if (component) {
        component.detach(this);
        delete this[component_alias];
        this.on.detachComponent.dispatch(this, component, component_alias);
    }

};

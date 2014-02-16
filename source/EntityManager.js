var EntityManager = function () {
    this.generator = new UniqueIdGenerator();
    this.entities = {};

    this.entitiesArray = [];
};

EntityManager.prototype.create = function () {
    var id = this.generator.generate();

    var entity = new Entity(id);

    Array.prototype.forEach.call(arguments, function (component) {
        component.attach(entity);
    }, this);

    this.entities[id] = entity;

    this.entitiesArray.push(entity);

    return entity;
};

EntityManager.prototype.get = function (id) {
    return this.entities[id];
};

EntityManager.prototype.filterByComponent = function (component_alias) {
    return this.entitiesArray.filter(function (entity) {
        return entity.hasOwnProperty(component_alias);
    });
};
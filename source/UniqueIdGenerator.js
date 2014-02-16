var UniqueIdGenerator = function () {
    this.prefix = Math.floor(Math.random() * 0xFFFFFFFF).toString(36);
};

UniqueIdGenerator.prototype.generate = function () {
    return this.prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 0xFFFFFFFF).toString(36);
};

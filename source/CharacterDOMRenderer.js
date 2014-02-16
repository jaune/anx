var CharacterDOMRenderer = function () {
    this.elements = {};
};

CharacterDOMRenderer.prototype.updateElement = function (entity) {
    var element = this.elements[entity.id];

    //if (entity.hasOwnProperty('mp')) {
        (function () {
            var ui = element.querySelector('.ui-mp');
            var current = entity.mp.value;
            var limit = entity.mp.max;

            ui.querySelector('.ratio > .current').innerHTML = current;
            ui.querySelector('.ratio > .limit').innerHTML = limit;
            ui.querySelector('.bar-outter > .bar-inner').setAttribute('style', 'width: ' + ((current / limit) * 100) + '%');
        })();
    // }

    //if (entity.hasOwnProperty('hp')) {
        (function () {
            var ui = element.querySelector('.ui-hp');
            var current = entity.hp.value;
            var limit = entity.hp.max;

            ui.querySelector('.ratio > .current').innerHTML = current;
            ui.querySelector('.ratio > .limit').innerHTML = limit;
            ui.querySelector('.bar-outter > .bar-inner').setAttribute('style', 'width: ' + ((current / limit) * 100) + '%');
        })();
    //}
};

CharacterDOMRenderer.prototype.createElement = function (entity) {

    var characterE = document.createElement('div');

    var classes = ['character'];

    if (entity.hasOwnProperty('selectable')) {
        classes.push('selectable');

        characterE.addEventListener('click', entity.selectable.listener, false);
    }

    entity.on.detachComponent.push(function (entity, component, component_alias) {
        if (component_alias === 'selectable') {
            characterE.classList.remove('selectable');
            characterE.removeEventListener('click', component.listener, false);
        }
    });

    entity.on.attachComponent.push(function (entity, component, component_alias) {
        if (component_alias === 'selectable') {
            characterE.classList.add('selectable');
            characterE.addEventListener('click', component.listener, false);
        }
    });

    characterE.style.width = '115px';
    characterE.style.height = '300px';
    characterE.style.background = 'url(asset/character.png)';
    characterE.className = classes.join(' ');
    characterE.innerHTML = '<div class="ui-status">' +
        '<div>' + entity.name.value + '</div>' +
        '<div class="ui-hp"><div class="header"><span class="title">HP</span> <span class="ratio"><span class="current">0</span>/<span class="limit">0</span></span></div><div class="bar-outter"><span class="bar-inner" style="width: 0%"></span></div></div>' +
        '<div class="ui-mp"><div class="header"><span class="title">MP</span> <span class="ratio"><span class="current">0</span>/<span class="limit">0</span></span></div><div class="bar-outter"><span class="bar-inner" style="width: 0%"></span></div></div>' +
        '</div>';

    this.elements[entity.id] = characterE;

    this.updateElement(entity);

    return characterE;
};
var SubjectActionTargetStateMachine = function (player, em) {
    this.selectedSubject = null;
    this.selectedAction = null;

    this.player = player;

    this.ui = null;
    this.em = em;

    this.on = {
        cancel: new ListenerList(),
        end: new ListenerList()
    };
};

SubjectActionTargetStateMachine.prototype.begin = function () {
    this.makeSubjectsSelectable();
};

SubjectActionTargetStateMachine.prototype.cancel = function () {
    if (this.ui) {
        this.ui.parentNode.removeChild(this.ui);
        this.ui = null;
    }
    this.em.filterByComponent('selectable').forEach(function (entity) {
        entity.detachComponent('selectable');
    });

    this.on.cancel.dispatch()
};

SubjectActionTargetStateMachine.prototype.makeSubjectsSelectable = function () {
    var me = this;
    var onSelectSubject = SubjectActionTargetStateMachine.prototype.onSelectSubject.bind(this);

    this.em.filterByComponent('puppet')
        .filter(function (entity) { return entity.puppet.puppeteer == me.player; })
        .forEach(function (entity) {
            entity.attachComponent(new SelectableComponent(onSelectSubject));
        });
};

SubjectActionTargetStateMachine.prototype.onSelectTarget = function (target) {
    this.em.filterByComponent('selectable').forEach(function (entity) {
        entity.detachComponent('selectable');
    });

    for (var item = null, items = document.querySelectorAll('.ui-action'), i = 0, l = items.length; i < l; ++i) {
        item = items[i];
        if (item.parentNode) {
            item.parentNode.removeChild(item);
        }
    }

    var s = this.selectedSubject, a = this.selectedAction;

    this.selectedSubject = null;
    this.selectedAction = null;

    this.on.end.dispatch(s, a, target);
};

SubjectActionTargetStateMachine.prototype.makeTargetsSelectable = function () {
    var onSelectTarget = SubjectActionTargetStateMachine.prototype.onSelectTarget.bind(this);

    this.em.filterByComponent('hp').forEach(function (entity) {
        if (!entity.hasOwnProperty('selectable')) {
            entity.attachComponent(new SelectableComponent(onSelectTarget));
        }
    });
};

SubjectActionTargetStateMachine.prototype.onSelectSubject = function (entity) {
    var me = this;

    if (entity.hasOwnProperty('puppet')) {
        if (entity.puppet.puppeteer == me.player) {
            entity.detachComponent('selectable');

            this.selectedSubject = entity;

            var ui = document.createElement('DIV');
            var classes = ['ui-action'];

            var actions = [
                {
                    action: 'SwordAction',
                    label: 'Sword'
                },
                {
                    action: 'FireballAction',
                    label: 'Fireball'
                },
                {
                    action: 'HealAction',
                    label: 'Heal'
                }
            ];

            ui.className = classes.join(' ');
            ui.innerHTML = '<div>'+entity.name.value+'</div><ul>'+actions.reduce(function (previousValue, currentValue, index, array) {
                return previousValue + '<li data-action="'+currentValue.action+'" class="action-item">'+currentValue.label+'</li>';
            }, '')+'</ul><div class="action-cancel">cancel</div>';
            document.body.appendChild(ui);

            ui.querySelector('.action-cancel').addEventListener('click', function () { me.cancel(); }, false);

            var onActionSelect = function () {

                for (var item = null, items = this.parentNode.querySelectorAll('.action-item'), i = 0, l = items.length; i < l; ++i) {
                    item = items[i];
                    item.classList.remove('active');
                }
                this.classList.add('active');

                me.selectedAction = this.getAttribute('data-action');

                me.makeTargetsSelectable();
            };

            for (var items = ui.querySelectorAll('.action-item'), i = 0, l = items.length; i < l; ++i) {
                items[i].addEventListener('click', onActionSelect, false);
            }

            this.ui = ui;

        }
    }
};
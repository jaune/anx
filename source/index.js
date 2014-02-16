"use strict";

(function () {

    var em = new EntityManager();

    var player0 = em.create(
        new NameComponent('Player 0'),
        new PuppeteerComponent()
    );

    var player1 = em.create(
        new NameComponent('Player 1'),
        new PuppeteerComponent()
    );

    em.create(
        new NameComponent('character0'),
        new HPGaugeComponent(1000, 1000),
        new MPGaugeComponent(1000, 1000),
        new PuppetComponent(player0)
    );

    em.create(
        new NameComponent('character2'),
        new HPGaugeComponent(200, 1000),
        new MPGaugeComponent(100, 100),
        new PuppetComponent(player1)
    );
    em.create(
        new NameComponent('character3'),
        new HPGaugeComponent(300, 1000),
        new MPGaugeComponent(100, 100),
        new PuppetComponent(player1)
    );
    em.create(
        new NameComponent('character1'),
        new HPGaugeComponent(400, 1000),
        new MPGaugeComponent(100, 100),
        new PuppetComponent(player1)
    );

    var satsm0 = new SubjectActionTargetStateMachine(player0, em);

    satsm0.on.end.push(function (subject, action, target) {
        console.debug(subject.name.value, action, target.name.value);
        satsm1.begin();
    });

    satsm0.on.cancel.push(function () {
        satsm0.begin();
    });

    satsm0.begin();


    var satsm1 = new SubjectActionTargetStateMachine(player1, em);

    satsm1.on.end.push(function (subject, action, target) {
        console.debug(subject.name.value, action, target.name.value);
        satsm0.begin();
    });

    satsm1.on.cancel.push(function () {
        satsm1.begin();
    });


    var Action = function () {
    };

    var AttackAction = function (subjet) {
        this.subject = subjet;
        this.target = null;
    };
    AttackAction.prototype = Object.create(Action.prototype);

    AttackAction.prototype.act = function (em) {
        var s = em.get(this.subject);
        var t = em.get(this.target);

        /*
         s.mp.value -= 10;
         t.hp.value -= 75;

         s.mp.use(75 * 2);
         t.hp.use(75);
         */

        /*
         updateCharacterElement(s);
         updateCharacterElement(t);
         */


    };

    window.addEventListener('load', function () {
        var bfr = new BattlefieldRenderer(em);

        bfr.initialize();

        document.body.appendChild(bfr.renderer.domElement);

    }, false);


})();
var BattlefieldRenderer = function (em) {
    this.em = em;

    this.scene = null;

    this.renderer = null;

    this.camera = null;
    this.cameraBeta = 0;
    this.cameraAlpha = 0;

    this.cameraAlphaStart = 0;
    this.cameraBetaStart = 0;
};

BattlefieldRenderer.prototype.pushFloorObject = function () {
    var floor = document.createElement('div');

    floor.style.width = '1500px';
    floor.style.height = '750px';
    floor.style.background = 'url(asset/checkerboard-gray.png)';

    var floorO = new CSS3DObject(floor);

    quat.rotateX(floorO.quaternion, floorO.quaternion, Math.PI / 2);

    floorO.updateMatrix();

    this.scene.children.push(floorO);
};

BattlefieldRenderer.prototype.pushGrassObjects = function () {
    for (var i = 0; i < 20; i++) {

        var element = document.createElement('div');
        element.style.width = '50px';
        element.style.height = '50px';
        // element.style.background = 'rgb(' + Math.floor(Math.random() * 255) +', ' + Math.floor(Math.random() * 255) +', ' + Math.floor(Math.random() * 255) +')';
        element.style.background = 'url(asset/grass-50.png)';


        // var object = new CSS3DObject( element );
        var object = new CSS3DSprite(element);

        object.position[1] = 25;
        object.position[0] = Math.random() * 1500 - 750;
        object.position[2] = Math.random() * 750 - (750 / 2);

        object.updateMatrix();

        this.scene.children.push(object);
    }

};

BattlefieldRenderer.prototype.render = function () {
    var me = this;
    var camera = this.camera;

    if (false) {
        camera.updateMatrix();
    } else {
        var target = vec3.create();
        var up = vec3.create();
        up[1] = 1.0;

        // mat4.identity(camera.matrix);
        mat4.lookAt(camera.matrix, camera.position, target, up);

        mat4.rotateX(camera.matrix, camera.matrix, this.cameraBeta);
        mat4.rotateY(camera.matrix, camera.matrix, this.cameraAlpha);


        mat4.copy(camera.matrixWorldInverse, camera.matrix);
    }

    window.requestAnimationFrame(function () {
        me.renderer.render(me.scene, me.camera);
    });

};

BattlefieldRenderer.prototype.buildRenderer = function () {
    var me = this;
    var renderer = new Renderer();

    renderer.domElement.addEventListener('trackend', function (event) {
    }, false);

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;

    renderer.domElement.addEventListener('trackstart', function (event) {
        me.cameraAlphaStart = me.cameraAlpha;
        me.cameraBetaStart = me.cameraBeta;
    }, false);
    renderer.domElement.addEventListener('track', function (event) {
        me.cameraAlpha = me.cameraAlphaStart + ((event.dx / screen.width) * Math.PI * 2);
        me.cameraBeta =  me.cameraBetaStart + ((event.dy / screen.height) * Math.PI * 2);

        if (me.cameraBeta > 0) {
            me.cameraBeta = 0;
        }
        if (me.cameraBeta < -(Math.PI / 5)) {
            me.cameraBeta = -(Math.PI / 5);
        }

        me.render();
    }, false);



    return renderer;
};

BattlefieldRenderer.prototype.initialize = function () {
    this.buildScene();

    var camera = new Camera();
    vec3.set(camera.position, 0, 1000, 1000);

    this.camera = camera;

    this.renderer = this.buildRenderer();

    this.render();
};


BattlefieldRenderer.prototype.buildScene = function () {
    var cr = new CharacterDOMRenderer();

    var scene = new Object3D();
    this.scene = scene;

    this.pushFloorObject();
    this.pushGrassObjects();

    var em = this.em;

    em.filterByComponent('puppeteer').forEach(function (puppeteer, index) {
        var offsetX = (1000 * index) - 500;

        var puppets = em.filterByComponent('puppet').filter(function (puppet) {
            return puppet.puppet.puppeteer == puppeteer;
        });

        var l = puppets.length;
        var ySpace = (750 - 100) / l;
        var lRemainder = (l % 2);
        var yModifier = ((l - lRemainder) / 2) - ((1 - lRemainder) / 2);
        var yOffset = ySpace * yModifier;

        puppets.forEach(function (character, character_index) {
            var y = (character_index * ySpace) - yOffset;
            var characterO = new CSS3DSprite(cr.createElement(character));

            characterO.position[1] = (300 / 2);
            characterO.position[0] = offsetX;
            characterO.position[2] = y;

            characterO.updateMatrix();

            scene.children.push(characterO);
        });

    });

    this.scene.updateMatrixWorld();

    return scene;
};

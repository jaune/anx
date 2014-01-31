(function () {

    var Object3D = function () {
        this.matrix = mat4.create();
        this.matrixWorld = mat4.create();

        this.position = vec3.create();
        this.scale = vec3.create();
        vec3.set(this.scale, 1.0, 1.0, 1.0);

        this.quaternion = quat.create();

        this.children = [];
    };

    Object3D.prototype.updateMatrix = function () {
        mat4x.compose(this.matrix, this.position, this.quaternion, this.scale );
    };

    Object3D.prototype.updateMatrixWorld = function (parentMatrixWorld) {
        if (parentMatrixWorld) {
            mat4.multiply(this.matrixWorld, parentMatrixWorld, this.matrix)
        } else {
            mat4.copy(this.matrixWorld, this.matrix)
        }

        for (var a = this.children, i = 0, l = a.length; i < l; i++) {
            a[ i ].updateMatrixWorld(this.matrixWorld);
        }
    };

    var Camera = function () {
        Object3D.call(this);

        this.matrixWorldInverse = mat4.create();
        this.fov = 75;

        mat4.invert(this.matrixWorldInverse, this.matrixWorld);
    };
    Camera.prototype = Object.create(Object3D.prototype);

    Camera.prototype.updateMatrixWorld = function (parentMatrixWorld) {
        Object3D.prototype.updateMatrixWorld.call(this, parentMatrixWorld);

        mat4.invert(this.matrixWorldInverse, this.matrixWorld);
    };

    var CSS3DObject = function (element) {

        Object3D.call(this);

        this.element = element;
        this.element.style.position = 'absolute';
    };
    CSS3DObject.prototype = Object.create(Object3D.prototype);

    var CSS3DSprite = function (element) {
        CSS3DObject.call(this, element);
    };
    CSS3DSprite.prototype = Object.create(CSS3DObject.prototype);


    var Renderer = function () {

        var _width, _height;
        var _widthHalf, _heightHalf;

        var matrix = mat4.create();

        var domElement = document.createElement('div');
        domElement.style.overflow = 'hidden';

        domElement.style.WebkitTransformStyle = 'preserve-3d';
        domElement.style.MozTransformStyle = 'preserve-3d';
        domElement.style.oTransformStyle = 'preserve-3d';
        domElement.style.transformStyle = 'preserve-3d';

        this.domElement = domElement;

        var cameraElement = document.createElement('div');

        cameraElement.style.WebkitTransformStyle = 'preserve-3d';
        cameraElement.style.MozTransformStyle = 'preserve-3d';
        cameraElement.style.oTransformStyle = 'preserve-3d';
        cameraElement.style.transformStyle = 'preserve-3d';

        domElement.appendChild(cameraElement);

        this.setClearColor = function () {

        };

        this.setSize = function (width, height) {

            _width = width;
            _height = height;

            _widthHalf = _width / 2;
            _heightHalf = _height / 2;

            domElement.style.width = width + 'px';
            domElement.style.height = height + 'px';

            cameraElement.style.width = width + 'px';
            cameraElement.style.height = height + 'px';

        };

        var epsilon = function (value) {

            return Math.abs(value) < 0.000001 ? 0 : value;

        };

        var getCameraCSSMatrix = function (elements) {

            return 'matrix3d(' +
                epsilon(elements[ 0 ]) + ',' +
                epsilon(-elements[ 1 ]) + ',' +
                epsilon(elements[ 2 ]) + ',' +
                epsilon(elements[ 3 ]) + ',' +
                epsilon(elements[ 4 ]) + ',' +
                epsilon(-elements[ 5 ]) + ',' +
                epsilon(elements[ 6 ]) + ',' +
                epsilon(elements[ 7 ]) + ',' +
                epsilon(elements[ 8 ]) + ',' +
                epsilon(-elements[ 9 ]) + ',' +
                epsilon(elements[ 10 ]) + ',' +
                epsilon(elements[ 11 ]) + ',' +
                epsilon(elements[ 12 ]) + ',' +
                epsilon(-elements[ 13 ]) + ',' +
                epsilon(elements[ 14 ]) + ',' +
                epsilon(elements[ 15 ]) +
                ')';

        };

        var getObjectCSSMatrix = function (elements) {

            return 'translate3d(-50%,-50%,0) matrix3d(' +
                epsilon(elements[ 0 ]) + ',' +
                epsilon(elements[ 1 ]) + ',' +
                epsilon(elements[ 2 ]) + ',' +
                epsilon(elements[ 3 ]) + ',' +
                epsilon(-elements[ 4 ]) + ',' +
                epsilon(-elements[ 5 ]) + ',' +
                epsilon(-elements[ 6 ]) + ',' +
                epsilon(-elements[ 7 ]) + ',' +
                epsilon(elements[ 8 ]) + ',' +
                epsilon(elements[ 9 ]) + ',' +
                epsilon(elements[ 10 ]) + ',' +
                epsilon(elements[ 11 ]) + ',' +
                epsilon(elements[ 12 ]) + ',' +
                epsilon(elements[ 13 ]) + ',' +
                epsilon(elements[ 14 ]) + ',' +
                epsilon(elements[ 15 ]) +
                ')';

        };

        var renderObject = function (object, camera) {

            if (object instanceof CSS3DObject) {

                var style;

                object.updateMatrixWorld();

                if (object instanceof CSS3DSprite) {

                    // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

                    mat4.transpose(matrix, camera.matrixWorldInverse);
                    mat4x.copyPosition(matrix, object.matrixWorld);
                    mat4.scale(matrix, matrix, object.scale);

                    matrix[ 3 ] = 0;
                    matrix[ 7 ] = 0;
                    matrix[ 11 ] = 0;
                    matrix[ 15 ] = 1;

                    style = getObjectCSSMatrix(matrix);

                } else {

                    style = getObjectCSSMatrix(object.matrixWorld);

                }

                var element = object.element;

                element.style.WebkitTransform = style;
                element.style.MozTransform = style;
                element.style.oTransform = style;
                element.style.transform = style;

                if (element.parentNode !== cameraElement) {

                    cameraElement.appendChild(element);

                }

            }

            for (var i = 0, l = object.children.length; i < l; i++) {

                renderObject(object.children[ i ], camera);

            }

        };

        var DEG_TO_RAD = Math.PI / 180;

        /**
         *
         * @param scene
         * @param camera
         */
        this.render = function (scene, camera) {

            var fov = 0.5 / Math.tan(( camera.fov * 0.5 * DEG_TO_RAD)) * _height;

            domElement.style.WebkitPerspective = fov + "px";
            domElement.style.MozPerspective = fov + "px";
            domElement.style.oPerspective = fov + "px";
            domElement.style.perspective = fov + "px";

            var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix(camera.matrixWorldInverse) +
                " translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

            cameraElement.style.WebkitTransform = style;
            cameraElement.style.MozTransform = style;
            cameraElement.style.oTransform = style;
            cameraElement.style.transform = style;

            renderObject(scene, camera);

        };

    };



    function buildScene() {
        var scene = new Object3D();

        for ( var i = 0; i < 20; i ++ ) {

            var element = document.createElement( 'div' );
            element.style.width = '100px';
            element.style.height = '100px';
            element.style.background = 'rgb(' + Math.floor(Math.random() * 255) +', ' + Math.floor(Math.random() * 255) +', ' + Math.floor(Math.random() * 255) +')';

            var object = new CSS3DObject( element );
            //var object = new CSS3DSprite( element );
            object.position[0] = Math.random() * 200 - 100;
            object.position[1] = Math.random() * 200 - 100;
            object.position[2] = Math.random() * 200 - 100;
            object.scale[0] = Math.random() + 0.5;
            object.scale[1] = Math.random() + 0.5;
/*
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    object.rotation.z = Math.PI / 2;
                    break;
                case 1:
                    object.rotation.y = Math.PI / 2;
                    break;
                case 2:
                    object.rotation.x = Math.PI / 2;
                    break;
            }
*/
            object.updateMatrix();

            scene.children.push( object );
        }

        return scene;
    }

    var camera, scene, alpha = 0, beta = 0, betaStart = 0, alphaStart = 0, r;


    window.addEventListener('load', function () {

        r = new Renderer();

        r.domElement.addEventListener('trackstart', function (event) {
            alphaStart = alpha;
            betaStart = beta;
        }, false);
        r.domElement.addEventListener('track', function (event) {
            alpha = alphaStart + ((event.dx / screen.width) * Math.PI * 2);
            beta = betaStart + ((event.dy / screen.height) * Math.PI * 2);


            renderScene();

        }, false);

        r.domElement.addEventListener('trackend', function (event) {
        }, false);

        r.setSize( window.innerWidth, window.innerHeight );

        r.domElement.style.position = 'absolute';
        r.domElement.style.top = 0;
        document.body.appendChild(r.domElement);

        camera = new Camera();
        vec3.set(camera.position, 0, 1000, 1000);

        scene = buildScene();

        scene.updateMatrixWorld();

        renderScene();


    }, false);

    var renderScene = function () {

        if (false) {
            camera.updateMatrix();
        } else {
            var target = vec3.create();
            var up = vec3.create();
            up[1] = 1.0;

            // mat4.identity(camera.matrix);
            mat4.lookAt(camera.matrix, camera.position, target, up);

            mat4.rotateX(camera.matrix, camera.matrix, beta );
            mat4.rotateY(camera.matrix, camera.matrix, alpha );


            mat4.copy(camera.matrixWorldInverse, camera.matrix);
        }

        requestAnimationFrame(function() {
            r.render(scene, camera);
        });

    };

})();
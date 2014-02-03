(function () {

    function buildScene() {
        var scene = new Object3D();

        var floor = document.createElement( 'div' );

        floor.style.width = '1500px';
        floor.style.height = '1500px';
        floor.style.background = 'url(asset/checkerboard-gray.png)';

        var floorO = new CSS3DObject( floor );

        quat.rotateX(floorO.quaternion, floorO.quaternion, Math.PI / 2);

        floorO.updateMatrix();

        scene.children.push( floorO );


        for ( var i = 0; i < 20; i ++ ) {

            var element = document.createElement( 'div' );
            element.style.width = '50px';
            element.style.height = '50px';
            // element.style.background = 'rgb(' + Math.floor(Math.random() * 255) +', ' + Math.floor(Math.random() * 255) +', ' + Math.floor(Math.random() * 255) +')';
            element.style.background = 'url(asset/grass-50.png)';



            // var object = new CSS3DObject( element );
            var object = new CSS3DSprite( element );

            object.position[0] = Math.random() * 1500 - 750;
            object.position[1] = 25;
            object.position[2] = Math.random() * 1500 - 750;
//            object.scale[0] = Math.random() + 0.5;
//            object.scale[1] = Math.random() + 0.5;
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

    var camera, scene,
        alpha = 0, alphaStart = 0,
        beta = 0, betaStart = 0;


    window.addEventListener('load', function () {

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
                renderer.render(scene, camera);
            });

        };


        var renderer = new Renderer();

        renderer.domElement.addEventListener('trackstart', function (event) {
            alphaStart = alpha;
            betaStart = beta;
        }, false);
        renderer.domElement.addEventListener('track', function (event) {
            alpha = alphaStart + ((event.dx / screen.width) * Math.PI * 2);
            beta = betaStart + ((event.dy / screen.height) * Math.PI * 2);

            renderScene();

        }, false);

        renderer.domElement.addEventListener('trackend', function (event) {
        }, false);

        renderer.setSize( window.innerWidth, window.innerHeight );

        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = 0;
        document.body.appendChild(renderer.domElement);

        camera = new Camera();
        vec3.set(camera.position, 0, 1000, 1000);

        scene = buildScene();

        scene.updateMatrixWorld();

        renderScene();

    }, false);



})();
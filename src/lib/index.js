import { browser } from '$app/environment'
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        
        let camera, scene, renderer, controls, clock, gridHelper, axesHelper, labelRenderer

        let width = window.innerWidth * .6
        let height = window.innerHeight * .75

        const baseRadius = width / 38.4
        // let orbits = []
        const init = (el) => {
            scene = new THREE.Scene()
            
            // camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, .005, 1000 );
            camera = new THREE.PerspectiveCamera(45, width / height, .0001, 100000)
                camera.position.z = baseRadius *.9
                camera.position.y = baseRadius *.8
                camera.position.x = baseRadius *.9
            
            gridHelper = new THREE.GridHelper(baseRadius, 10, 0xffffff)

            const xAxisDiv = document.createElement( 'div' );
                    xAxisDiv.className = 'label';
                    xAxisDiv.textContent = 'X (♈︎)';
                    xAxisDiv.style.backgroundColor = 'transparent';
                    xAxisDiv.style.color ='red';
            const xAxisLabel = new CSS2DObject( xAxisDiv );
                    xAxisLabel.position.set( baseRadius/1.8, 0, 0 );
                    xAxisLabel.center.set( 0, 0 );

            const yAxisDiv = document.createElement( 'div' );
                    yAxisDiv.className = 'label';
                    yAxisDiv.textContent = 'Y';
                    yAxisDiv.style.backgroundColor = 'transparent';
                    yAxisDiv.style.color ='green';
            const yAxisLabel = new CSS2DObject( yAxisDiv );
                    yAxisLabel.position.set( 0, baseRadius/1.8, 0 );
                    yAxisLabel.center.set( 0, 0 );
            
            const zAxisDiv = document.createElement( 'div' );
                    zAxisDiv.className = 'label';
                    zAxisDiv.textContent = 'Z';
                    zAxisDiv.style.backgroundColor = 'transparent';
                    zAxisDiv.style.color ='blue';
            const zAxisLabel = new CSS2DObject( zAxisDiv );
                    zAxisLabel.position.set( 0, 0, baseRadius/1.8 );
                    zAxisLabel.center.set( 0, 0 );

            let light = new THREE.AmbientLight(0xffffff, 1)

            let light1 = new THREE.PointLight(0xffffff, 1, 111)


            clock = new THREE.Clock()

            axesHelper = new THREE.AxesHelper( baseRadius/1.9 )
            
            labelRenderer = new CSS2DRenderer();
                labelRenderer.setSize(width, height)
                labelRenderer.domElement.style.position = 'absolute'
                labelRenderer.domElement.style.top = '0px'
                // main.appendChild( labelRenderer.domElement )
                el.appendChild( labelRenderer.domElement )

            renderer = new THREE.WebGLRenderer({ antialias: true })
                renderer.setPixelRatio(window.devicePixelRatio)
                renderer.setSize(width, height)
                // main.appendChild(renderer.domElement)
                el.appendChild( renderer.domElement )

            controls = new OrbitControls(camera, labelRenderer.domElement)

            scene.add(gridHelper)
            scene.add(xAxisLabel)
            scene.add(yAxisLabel)
            scene.add(zAxisLabel)
            scene.add(light)
            scene.add(light1)
            scene.add(axesHelper)

            function animate() {
                requestAnimationFrame( animate );
                renderer.render( scene, camera );
                labelRenderer.render( scene, camera );
            }
            animate();

            return { baseRadius, animate, camera, scene, renderer, controls, clock, gridHelper, axesHelper, labelRenderer}
        }

        export {init}
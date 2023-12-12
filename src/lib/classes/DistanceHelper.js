import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { Vector3, Mesh  } from 'three';
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max)
class DistanceHelper extends Mesh{
    constructor(
            length = 1,
            start = new Vector3(),
            end = new Vector3(1, 0, 0),
            color
        ) {
        super();
        
        const line = new THREE.Line( 
            new THREE.BufferGeometry().setFromPoints( [start, end] ),
                new THREE.LineBasicMaterial({ color })
            )
        this.add(line)

        this.addEventListener( 'removed', removeChildren )
        function removeChildren( event ) {
            const object = event.target;
            for ( const children of object.children ) {
                object.remove( children );
            }
        }
    }
}

export { DistanceHelper }
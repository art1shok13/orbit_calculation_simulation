import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { LabelHelper } from '$lib/classes/LabelHelper.js'
import { RAD2DEG, DEG2RAD, toColor } from '$lib/classes/utils.js'
import { Vector3, ArrowHelper, Mesh  } from 'three';
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const { sin, cos, PI, sqrt, tan, sinh, cosh, abs } = Math


class AngleHelper extends Mesh {
    constructor(
            angle,
            target = new Vector3(1, 1, 1),
            startAxis = new Vector3(1, 0, 0),
            origin = new Vector3(0, 0, 0),
            color = 0x00FF00,
        ) {
        super();

        const length = target.length()
        startAxis.normalize()
        target.normalize()
        const arrowHelper = new ArrowHelper(target, origin, length, color)
        const arrowHelper1 = new ArrowHelper(startAxis, origin, length, color)

        const _ringFunction = (t, v, vector) => {
            const rotationAxis = new Vector3()
                            .crossVectors(target, startAxis)
                            .normalize()
                            .negate();
            if(angle > 3.1415) { rotationAxis.negate() }   

            vector.copy(startAxis)
                  .applyAxisAngle( rotationAxis, t*( angle ) )
                  .multiplyScalar(length/2)
        }

        const _ringGeometry = new ParametricGeometry(_ringFunction, 100, 1)
        const _ringMaterial = new THREE.MeshStandardMaterial( { color, side: THREE.DoubleSide, wireframe: true} )
        const ring = new Mesh( _ringGeometry, _ringMaterial)

        let Label = new LabelHelper(`${angle.toFixed(3)} rad (${Math.round(RAD2DEG*angle)}°)`, toColor(color), `${100+1*2}%`, target.clone().multiplyScalar(length/2))

        this.position.copy( origin )
        this.add( ring )
        this.add( arrowHelper )
        this.add( arrowHelper1 )
        // this.add( Label )

        // this.addEventListener( 'removed', removeChildren )
        function removeChildren( event ) {
            const object = event.target;
            for ( const children of object.children ) {
                object.remove( children );
            }
        }
    }
}

export { AngleHelper }
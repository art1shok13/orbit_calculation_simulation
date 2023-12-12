import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { Vector3, ArrowHelper, Mesh  } from 'three';
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max)
class AngleHelper extends Mesh{
    constructor(
            angle,
            target = new Vector3(1, 1, 1),
            startAxis = new Vector3(1, 0, 0),
            origin = new Vector3(0, 0, 0),
            color = 0x00FF00,
        ) {
        super();    
        

        // let angleStart = new Vector3(plane.x, 0, Math.clamp(plane.z-plan xe.x, 0, 1))
        // dir.applyAxisAngle( axis, angle*( (-1)**(plane.y-plane.x) ) )
        const dir = target.clone().normalize()
        const length = target.length()
        this.arrowHelper = new ArrowHelper(dir, origin, length, color)
        this.arrowHelper1 = new ArrowHelper(startAxis.clone().normalize(), origin, length, color)

        const _ringFunction = (t, v, vector) => {
            const p0 = startAxis.clone()
                                .normalize()
                                .divideScalar(2.5)
            const p2 = target.clone()
                             .normalize()
                             .divideScalar(2.5)
            const p1 = p0.clone()
                         .lerp( p2, .5)
                         .normalize()
                         .divideScalar(2.5)
                         .multiplyScalar(1.1)
            if(Math.abs(angle) > 3.1415){
                p1.negate().multiplyScalar(1.5)
            }
            const u = 1 - t;
            const tt = t * t;
            const uu = u * u;
            let p = p0.multiplyScalar( uu ); 
            p.add( p1.multiplyScalar(2 * u * t) )
            p.add( p2.multiplyScalar(tt) )
            vector.set(p.x, p.y, p.z)
        }

        const _ringGeometry = new ParametricGeometry(_ringFunction, 100, 1)
        const _ringMaterial = new THREE.MeshStandardMaterial( { color, side: THREE.DoubleSide, wireframe: true} )
        this.ring = new Mesh( _ringGeometry, _ringMaterial)

        this.position.copy( origin )
        this.add( this.ring )
        this.add(this.arrowHelper)
        this.add(this.arrowHelper1)

        // this.addEventListener( 'removed', removeChildren )
        // function removeChildren( event ) {
        //     const object = event.target;
        //     for ( const children of object.children ) {
        //         object.remove( children );
        //     }
        // }
    }
    // layersSet( n ){
    //     this.traverse( function( child ) { child.layers.set( n ) } )
    // }
}

export { AngleHelper }
import { Vector3, ArrowHelper, Mesh  } from 'three';
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const { sin, cos, PI, sqrt, tan, sinh, cosh, abs } = Math

class VectorHelper extends Mesh {
    constructor(
            target = new Vector3(0, 1, 0),
            length = 1,
            origin = new Vector3(0, 0, 0),
            color
        ) {
        super()
        const arrow = new ArrowHelper(target, origin, length, color)
        
        this.position.copy( origin )
        this.add(arrow)
    }
    removeSelf(scene){
        function removeChildren( event ) {
            for ( const children of object.children ) {
                scene.remove( arrow );
            }
        }
        removeChildren()
    }
}

export { VectorHelper }
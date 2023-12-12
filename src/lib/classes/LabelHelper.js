import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { Vector3, Mesh  } from 'three';
class LabelHelper extends Mesh{
    constructor(
            text = '',
            color = '#111222',
            fontSize = '',
            pos = Vector3(0, 0, 0)
        ) {

        super();

        const LabelDiv = document.createElement('div')
            LabelDiv.className = 'label'
            LabelDiv.textContent = text
            LabelDiv.style.backgroundColor = 'transparent'
            LabelDiv.style.color = color
            LabelDiv.style.fontSize = fontSize
        let Label = new CSS2DObject( LabelDiv )
            Label.position.copy(pos)
            Label.translateY(.13)
            Label.center.set( 0, 0 )

        this.add(Label)

        this.addEventListener( 'removed', removeChildren )
        function removeChildren( event ) {
            const object = event.target;
            for ( const children of object.children ) {
                object.remove( children );
            }
        }
    }
}

export { LabelHelper }
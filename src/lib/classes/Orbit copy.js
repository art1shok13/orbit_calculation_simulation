import * as THREE from 'three';
import { Vector3, Euler } from 'three'
import { AngleHelper } from '$lib/classes/AngleHelper.js'
import { DistanceHelper } from '$lib/classes/DistanceHelper.js'
import { LabelHelper } from '$lib/classes/LabelHelper.js'
const { sin, cos, PI, sqrt, tan, sinh, cosh, abs } = Math

class Orbit {
    transform
    constructor({i = 0, Ω = 0, ω = 0}, P, a = 0, e = 0, {x = 0, y = 0, z = 0}, color = '#46a62d', phi = 1, name = 'orbit', states = { aphelion: 0, iAngle: 0, ΩAngle: 0, ωAngle: 0, } ) {
        this.i = i
        this.Ω = Ω
        this.ω = ω
        this.P = P
        this.a = a
        this.e = e
        this.x = x
        this.y = y
        this.x = z

        this.name = name
        this.c = a*e
        
        this.color = color
        this.phi = phi

        this.states = { aphelion: 0, iAngle: 0, ΩAngle: 0, ωAngle: 0, }
        
        this.transform = (i, Ω, ω, _x, _y, _z, xr = 0, yr = 0 , zr = 0) => {
            if (!i) Ω = 0
            if (e>=1) Ω += PI
            
            let point = new Vector3(_x, _y, _z)
            let r_point = new Vector3(xr, yr, zr)

            const euler1 = new Euler( i, ω, 0 )
            const euler2 = new Euler( 0, Ω, 0)
            point.sub(r_point)
                 .applyEuler(euler1)
                 .applyEuler(euler2)
            return point
        }
        //orbit func with t: [0,1]
        const orbitFunction = (t) => {
            let _x, _y, _z

            if(e<1) {
                // elipse paramtric func
                const v = 2*PI*t
                const b = sqrt(a**2 - (a*e)**2 )

                _x = a*cos(v) - a*e
                _y = 0
                _z = b * sin(v)
            }
            if(e === 1) {
                // parabola parametric func
                const v = (t*2-1)*6

                _x = a*(v**2 - 1)   
                _y = 0
                _z = 2*a*v

            }
            if(e>1){
                // hyperbola parametric func
                const v = (t*2-1)*PI
                const b = a*(e**2-1)/sqrt(e**2-1)

                _x = a*( cosh(v) - e )
                _y = 0
                _z = b*sinh(v)

            }

            return this.transform(i, Ω, ω, _x, _y, _z)
        }
        this.orbitFunction = orbitFunction

        this.Mesh = new THREE.Group()

        class OrbitCurve extends THREE.Curve {
            constructor() { super() }
            getPoint = orbitFunction
        }
        let curve = new THREE.Mesh(
            new THREE.TubeGeometry( new OrbitCurve(), 128, a*.005+.01, 8, false ),
            new THREE.MeshBasicMaterial( { color: color } )
        )
        
        const origin = new THREE.Vector3(x, y, z)

        this.parihelion = this.special_point(color)
        this.parihelion.position.copy(this.getParihelionCords())
        this.parihelionLabel = new LabelHelper(name + ' (Q)', color, `${100+a*8}%`, this.getParihelionCords())

        this.aphelion = this.special_point(color)
        this.aphelion.position.copy(this.getAphelionCords())

        this.iAngle = new AngleHelper(i, this.getParihelionCords(0), new Vector3( 1, 0, 0 ), origin, 0x00ff84)
        
        this.ωAngle = new AngleHelper(ω, this.getParihelionCords(0), this.getAscendingNodeVector(), origin, 0xff0084)

        if(i != 0 ){
            this.ΩAngle = new AngleHelper(Ω, new Vector3( 1, 0, 0 ), this.getAscendingNodeVector(), origin, 0xff00ff)
        }

        this.Mesh.add(curve)
        this.Mesh.add(this.parihelion)
        this.Mesh.add(this.parihelionLabel)

        for(const [name, state] of Object.entries(states)) {
            this.toggleObject(name, state)
        }

        this.Mesh.addEventListener( 'removed', removeChildren )
        function removeChildren( event ) {
            const object = event.target;
            for ( const children of object.children ) {
                object.remove( children );
            }
        }
    }
    remove(scene){
        scene.remove(this.getMesh())
    }

    special_point(color, radius = .05) {
        return new THREE.Mesh( 
            new THREE.SphereGeometry( radius, 1, 1 ), 
            new THREE.MeshBasicMaterial( { color } )
        )
    }

    getMesh(){
        return this.Mesh
    }

    getOrbitNormalVector(){
        const {i, Ω, ω, c} = this

        const vector = new Vector3(0, 1, 0)
        const euler = new Euler( i, 0, 0 )
            vector.applyEuler(euler)
        return vector
    }

    getAscendingNodeVector(){
        const {i, Ω, ω, c} = this
        if (!Ω) {return new Vector3(1, 0, 0)} 
        const vector = new Vector3().crossVectors(new Vector3(0, 1, 0), this.getOrbitNormalVector() )
        const euler = new Euler( 0, Ω, 0 )
            vector.applyEuler(euler)
        return vector
    }

    getFocusCords(){
        const {i, Ω, ω, c, e, a} = this
        return [
                this.transform( i, Ω, ω,  c, 0, 0, c ), 
                this.transform( i, Ω, ω, -c, 0, 0, c )
            ]
    }   

    getAphelionCords(){
        const {i, Ω, ω, c, a} = this

        return this.transform( i, Ω, ω, -a, 0, 0, c )
    }

    getParihelionCords( omega ){
        const {i, Ω, ω, a, e, c} = this
        if(e>=1) return this.transform( i, Ω, omega ? omega:ω, 0, 0, 0, c )

        return this.transform( i, Ω, omega ? omega:ω, a, 0, 0, c )
    }

    getSemiLatusRectumCords(){
        const {i, Ω, ω, a, e} = this
        if(e<1){
            return [
                this.transform( i, Ω, ω, a*e, 0, a*(1-e**2), a*e ),
                this.transform( i, Ω, ω, a*e, 0, -a*(1-e**2), a*e )
            ]
        }
        if(e === 1){
            return [
                this.transform( i, Ω, ω, a*e, 0, 2*a, a*e ),
                this.transform( i, Ω, ω, a*e, 0, -2*a, a*e )
            ]
        }
        if(e>1){
            return [
                this.transform( i, Ω, ω, a*e, 0, a*(e**2-1), a*e ),
                this.transform( i, Ω, ω, a*e, 0, -a*(e**2-1), a*e )
            ]
        }
    }

    toggleObject(name, state){

        if(!this.states[name] && state){
            this.getMesh().add(this[name])
            this.states[name] = state
        }

        if(this.states[name] && !state){
            this.getMesh().remove(this[name])
            this.states[name] = state
        }
    }

    revokeObjects(){

    }
}
export { Orbit }
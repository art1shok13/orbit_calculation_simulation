import * as THREE from 'three';
import { Vector3, Euler } from 'three'
import { AngleHelper } from '$lib/classes/AngleHelper.js'
import { DistanceHelper } from '$lib/classes/DistanceHelper.js'
import { LabelHelper } from '$lib/classes/LabelHelper.js'
import { VectorHelper } from '$lib/classes/VectorHelper.js'

const { sin, cos, PI, sqrt, tan, sinh, cosh, abs } = Math

class Orbit {
    transform
    constructor({i = 0, Ω = 0, ω = 0}, P, a = 0, e = 0, {x = 0, y = 0, z = 0}, color = '#46a62d', phi = 1, name = 'orbit', states = {} ) {
        this.name = name
        //kepler orbit elements
        this.i = i
        this.Ω = Ω
        this.ω = ω
        this.a = a
        this.e = e
        this.c = a*e
        this.semilatusrectum = e!=1   ?   a*(1-e**2) : 2*a
        this.P = P
        
        //vector orbit elements
        this.P_vec = new THREE.Vector3(
            cos(Ω)*cos(ω) - sin(Ω)*sin(ω)*cos(i),
            sin(Ω)*cos(ω) + cos(Ω)*sin(ω)*cos(i),
            sin(ω)*sin(i)
        )
        this.Q_vec = new THREE.Vector3(
            -1*( cos(Ω)*sin(ω) + sin(Ω)*cos(ω)*cos(i) ),
            -1*( sin(Ω)*sin(ω) - cos(Ω)*cos(ω)*cos(i) ),
            cos(ω)*sin(i)
        )
 
        this.color = color
        this.phi = phi

        this.states = states//{ aphelionHelper: false, iHelper: false, ΩHelper: false, ωHelper: false, hHelper: false, nHelper: false, qHelper: false, QHelper: false, aHelper: false}

        //orbit func with t: [0,1]
        const orbitFunction = (t, v) => {
            if(e === 1) {
                const sigma = (t*2-1)*4
                const new_Q = this.Q_vec.clone().multiplyScalar(2*sigma)
                const vec = this.P_vec
                                .clone()
                                .multiplyScalar(2*(1-sigma**2))
                                .add( new_Q )
                                .multiplyScalar(a)
                return new THREE.Vector3(vec.x, vec.y, vec.z)
            }
            if(e > 1) {
                const H = (t*2-1)*4
                const new_Q = this.Q_vec.clone().multiplyScalar(sqrt(e**2-1) * sinh(H))
                const vec = this.P_vec
                                .clone()
                                .multiplyScalar(e - cosh(H))
                                .add( new_Q ) 
                                .multiplyScalar(a)  
                return new THREE.Vector3(vec.x, vec.y, vec.z)
            }

            v = t*2*PI
            const r = this.semilatusrectum / ( 1 + e*cos(v) )

            const new_Q = this.Q_vec.clone().multiplyScalar(r*sin(v))
            const vec = this.P_vec
                            .clone()
                            .multiplyScalar(r*cos(v))
                            .add( new_Q )            
            return new THREE.Vector3(vec.x, vec.y, vec.z)//this.transform(i, Ω, ω, _x, _y, _z)
        }

        this.orbitFunction = orbitFunction

        this.Mesh = new THREE.Group()   

        class OrbitCurve extends THREE.Curve {
            constructor() { super() }
            getPoint = orbitFunction
        }
        let curve = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints( new OrbitCurve().getPoints(a*128) ),//new THREE.TubeGeometry( new OrbitCurve(), 200, a*.005+.01, 8, false ),
            new THREE.MeshBasicMaterial( { color: color } )
        )
        
        const origin = new THREE.Vector3(x, y, z)

        this.parihelion = this.special_point(color)
        this.parihelion.position.copy(this.getParihelionCords())
        this.parihelionLabel = new LabelHelper(name + ' (Q)', color, `${100+a*2}%`, this.getParihelionCords())

        this.aphelionHelper = this.special_point(color)
        this.aphelionHelper.position.copy(this.getAphelionCords())

        this.iHelper = new AngleHelper(i, this.getOrbitNormalVector().multiplyScalar(a), new Vector3(0, 0, 1),  origin, 0x00ff84)
        this.iHelperLabel = new LabelHelper(`${this.i.toFixed(3)} rad (${Math.round(THREE.MathUtils.radToDeg(this.i))}°)`, '#00ff84', `${100 + a * 2}%`, this.getOrbitNormalVector().multiplyScalar(a / 2))

        this.ωHelper = new AngleHelper(abs(ω), this.getParihelionCords(), this.getAscendingNodeVector(), origin, 0xff0084)
        this.ωHelperLabel = new LabelHelper(`${abs(ω).toFixed(3)} rad (${Math.round(THREE.MathUtils.radToDeg(abs(ω)))}°)`, '#ff0084', `${100 + a * 2}%`, this.getParihelionCords().multiplyScalar(0.5))

        this.ΩHelper = new AngleHelper(abs(Ω), this.getAscendingNodeVector(), new Vector3(1, 0, 0), origin, 0xff00ff)
        this.ΩHelperLabel = new LabelHelper(`${abs(Ω).toFixed(3)} rad (${Math.round(THREE.MathUtils.radToDeg(abs(Ω)))}°)`, '#ff00ff', `${100 + a * 2}%`, this.getAscendingNodeVector().multiplyScalar(0.5))

        this.hHelper = new VectorHelper(this.getOrbitNormalVector(), a, origin, color) 
        this.nHelper = new VectorHelper(this.getAscendingNodeVector(), a, origin, color)  
        
        this.QHelper = new DistanceHelper(this.c - this.a, origin, this.getParihelionCords(), '#FFFFFF')
        this.QHelperLabel = new LabelHelper(`Q: ${abs(this.c - this.a).toFixed(3)} au`, '#FFFFFF', `${100 + a * 2}%`, this.getParihelionCords().multiplyScalar(0.5))

        this.qHelper = new DistanceHelper(this.c + this.a, origin, this.getAphelionCords(), '#FFFFFF')
        this.qHelperLabel = new LabelHelper(`q: ${(this.c + this.a).toFixed(3)} au`, '#FFFFFF', `${100 + a * 2}%`, this.getAphelionCords().multiplyScalar(0.5))

        this.aHelper = new DistanceHelper(a, this.getParihelionCords().normalize().negate().multiplyScalar(this.c), this.getParihelionCords(), '#FFFFFF')
        this.aHelperLabel = new LabelHelper(`a: ${a.toFixed(3)} au`, '#FFFFFF', `${100 + a * 2}%`, this.getParihelionCords().multiplyScalar(0.5))
        
        this.Mesh.add(curve)
        this.Mesh.add(this.parihelion)
        this.Mesh.add(this.parihelionLabel)

        for(const [name, state] of Object.entries(states)) {
            if(state) {
                this.getMesh().add(this[name])
                this.getMesh().add(this[name+'Label'])
            }
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
        scene.remove(this.Mesh)
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
        const {P_vec, Q_vec} = this
        
        return new Vector3().crossVectors(P_vec, Q_vec)
    }

    getAscendingNodeVector(){
        const {Ω, a} = this
        const vector = new Vector3(1, 0, 0).applyAxisAngle(new Vector3(0, 0, 1), Ω).normalize().multiplyScalar(a)
        return vector
    }
    getParihelionCords( omega ){
        const {P_vec, a, e} = this
        const q = a*(1-e)
        const vec = P_vec.clone().normalize().multiplyScalar(q)
        if(e>1) vec.negate()
        if(e===1) vec.set(vec.x + 2*a, vec.y, vec.z)
        return vec
    }

    getAphelionCords(){
        const {P_vec, a, e} = this
        const Q = a*(1+e)
        if(e >= 1) return new Vector3(0, 0, 0)
        return P_vec.clone().normalize().negate().multiplyScalar(Q)
    }

    getSemiLatusRectumCords(){
        const {Q_vec, semilatusrectum, e} = this
        if(e<1){
            return [
                Q_vec.clone().normalize().multiplyScalar(semilatusrectum),
                Q_vec.clone().negate().normalize().multiplyScalar(semilatusrectum)
            ]
        }
    }

    // toggleObject(name, state){

    //     if(!this.states[name] && state){
    //         this.getMesh().add(this[name])
    //         this.getMesh().add(this[name+'Label'])
    //         this.states[name] = Boolean(state)
    //     }
    //     if(this.states[name] && !state){
    //         this.getMesh().remove(this[name])
    //         this.getMesh().remove(this[name+'Label'])
    //         this.states[name] = Boolean(state)
    //     }
    // }
}
export { Orbit }
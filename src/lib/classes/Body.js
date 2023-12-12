class Body {
    #Mesh
    constructor(weight, radius, color, orbit ){
        this.weight = weight
        this.orbit = orbit.orbitFunction
        this.#Mesh = new THREE.Mesh( 
            new THREE.MeshBasicMaterial( { color } ),
            new THREE.SphereGeometry( radius, 10, 10 )
        )
    }
    getMesh(){
        return this.#Mesh
    }
}
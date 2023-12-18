
<script>
    import { onMount } from "svelte"
    import { init } from "$lib/index.js"
    import { Orbit } from "$lib/classes/Orbit.js"
    import OrbitHTML from "$lib/components/OrbitHTML.svelte"
    import ElementsToggle from "$lib/components/ElementsToggle.svelte"
    import CalculatorInput from "$lib/components/CalculatorInput.svelte";
    import {DEG2RAD} from "$lib/classes/utils.js"


    let canvas, addOrbit, addOrbitToScene, changeOrbit, deleteOrbit, toggleObject, show, doShowElements, addSolarSystem, currentElement = {id: null, do: false}, orbitsList = []
    onMount(() => {
        let { baseRadius, animate, camera, scene, renderer, controls, clock, gridHelper, axesHelper, labelRenderer} = init(canvas)
        addOrbit = () => {
            const orbit = new Orbit({i: 0, Ω: 0, ω: 0}, 0, 1, 0, {}, '#46a62d', 1, 'New Orbit' )
            scene.add(orbit.getMesh())
            orbitsList = [...orbitsList, orbit]
            orbitsList = orbitsList
            // orbit.toggleObject('ΩAngle', 1)
            // orbit.toggleObject('ωAngle', 1)
        }
        changeOrbit = ({i, Ω, ω, P, a, e, color, name, id}) => {
            orbitsList[id].remove(scene)
            orbitsList[id] = new Orbit({i, Ω, ω}, P, a, e, {}, color, 1, name, orbitsList[id].states )
            scene.add(orbitsList[id].getMesh())

            orbitsList = orbitsList
        }
        deleteOrbit = (id) => {
            orbitsList[id].remove(scene)
            orbitsList.splice(id, 1)
            orbitsList = orbitsList

            doShowElements = false
            currentElement = {}
        }
        currentElement = {id: null, do: false, states: null}
        show = (id) => {
            if(currentElement.id != id && currentElement.do) return
            currentElement.id = id
            currentElement.do = !currentElement.do
            currentElement.states = orbitsList[id].states
        }   
        toggleObject = (obj) => {
            const [key, value] = Object.entries(obj)[0]
            orbitsList[currentElement.id].toggleObject(key, value)
        }
        addOrbitToScene = ({semimajor_axis: a, eccentricity: e, i, omega: ω, OMEGA: Ω }) => {
            const orbit = new Orbit({i, Ω, ω}, 1, a, e, {}, undefined, 1)
            scene.add(orbit.getMesh())
            orbitsList.push(orbit)
            orbitsList = orbitsList
        }
        addSolarSystem = () => {
            const solarSystem = [
                new Orbit({i: DEG2RAD*7, Ω: DEG2RAD*48, ω: DEG2RAD*29}, 0, 0.387, 0.206, {}, '#ffffff', 1, 'Mercury' ),
                new Orbit({i: DEG2RAD*3.4, Ω: DEG2RAD*77, ω: DEG2RAD*54}, 0, 0.723, 0.007, {}, '#ffffff', 1, 'Venus' ),
                new Orbit({i: 0, Ω: 0, ω: DEG2RAD*103}, 0, 1, 0.017, {}, '#ffffff', 1, 'Earth' ),
                new Orbit({i: DEG2RAD*1.85, Ω: DEG2RAD*49, ω: DEG2RAD*287}, 0, 1.524, 0.093, {}, '#ffffff', 1, 'Mars' ),
                new Orbit({i: DEG2RAD*1.3, Ω: DEG2RAD*100, ω: DEG2RAD*-86}, 0, 5.203, 0.048, {}, '#ffffff', 1, 'Jupiter' ),
                new Orbit({i: DEG2RAD*2.48, Ω: DEG2RAD*113, ω: DEG2RAD*-20}, 0, 9.555, 0.056, {}, '#ffffff', 1, 'Saturn' ),
                new Orbit({i: DEG2RAD*0.76, Ω: DEG2RAD*74, ω: DEG2RAD*99}, 0, 19.218, 0.047, {}, '#ffffff', 1, 'Uranus' ),
                new Orbit({i: DEG2RAD*1.77, Ω: DEG2RAD*132, ω: DEG2RAD*-84}, 0, 30.110, 0.009, {}, '#ffffff', 1, 'Neptune' )
            ]

            orbitsList = [...orbitsList, ...solarSystem]
            orbitsList = orbitsList
            solarSystem.forEach( (orbit) => {
                scene.add(orbit.getMesh())
            })
        }
        // addSolarSystem()
    })
    
</script>

<div id="calculator">
    <CalculatorInput on:addOrbitToScene = "{({detail}) => addOrbitToScene(detail)}"/>
    <button on:click={addSolarSystem} style="width: 10em;">ADD SOLAR SYSTEM</button>
</div>

<div id="orbits-list">
    {#each orbitsList as {i, Ω, ω, P, a, e, color, name}, index}
        <OrbitHTML elements = {{i, Ω, ω, P, a, e, color, name, id: index}} id={index} on:show={({detail})=>{show(detail)}} on:change={({detail}) => changeOrbit(detail)} on:delete = { ({detail}) => deleteOrbit(detail)}/>
    {/each}
    <div class="orbit">
        <button on:click={() => addOrbit()}>ADD ORBIT</button>
    </div>
</div>
<div bind:this={canvas}></div>
<div id="orbit-elements">
    {#if currentElement.do}
        <ElementsToggle states="{currentElement.states}" on:toggleObject="{({detail}) => toggleObject(detail)}"/>
    {/if}
</div>
<style>
    :global(body){
        display: grid;
        grid-template-columns: 30vw 60vw 10vw;
        grid-template-rows: 75vh 25vh;
        padding: 0;
        margin: 0;
        text-decoration: none;
        color: white;
    }
    * {
        padding: 0;
        margin: 0;
        text-decoration: none;
        border: 0;
        color: white;
    }

    :root {
        --input-color: #3f4146;
        --menu-color: #202124;
        --orbit-color: #333439;
    }

    #calculator {
        border-right: solid 1px black;
        grid-column: 1 / 2;
        grid-row: 1 / 3;
        background-color: var(--menu-color);
        z-index: 2;
        
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        justify-content: flex-start;
        padding: 1em;
    }

    #orbits-list {
        border-left: solid 1px black;
        grid-column: 2 / 4;
        grid-row: 2 / 2;
        background-color: var(--menu-color);

        overflow-y: auto;
    }

    #orbit-elements {
        border-left: solid 1px black;
        grid-column: 3 / 5;
        grid-row: 1 / 1;
        background-color: var(--menu-color);
    }

    .orbit {
        width: 98%;
        background-color: var(--orbit-color);
        height: 1.8em;
        margin: .3em auto;
        
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    .orbit:nth-of-type(1) {
        margin-top: 1em;
    }

    button {
        background-color: var(--input-color);
        padding: .2em;
        border-radius: 6px;
        width: 10%;
        cursor: pointer;
    }
</style>

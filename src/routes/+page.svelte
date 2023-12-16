
<script>
    import { onMount } from "svelte"
    import { init } from "$lib/index.js"
    import { Orbit } from "$lib/classes/Orbit.js"
    import OrbitHTML from "$lib/components/OrbitHTML.svelte"
    import ElementsToggle from "$lib/components/ElementsToggle.svelte"
    import CalculatorInput from "$lib/components/CalculatorInput.svelte";

    let canvas, addOrbit, addOrbitToScene, changeOrbit, deleteOrbit, toggleObject, show, doShowElements, currentElement = {id: null, do: false}, orbitsList = []
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
    })
    
</script>

<div id="calculator">
    <CalculatorInput on:addOrbitToScene = "{({detail}) => addOrbitToScene(detail)}"/>
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

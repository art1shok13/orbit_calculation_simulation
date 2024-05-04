
<script>
    const {PI} = Math
    import { onMount } from "svelte"
    import { init } from "$lib/index.js"
    import { Orbit } from "$lib/classes/Orbit.js"
    import OrbitHTML from "$lib/components/OrbitHTML.svelte"
    import ElementsToggle from "$lib/components/ElementsToggle.svelte"
    import CalculatorInput from "$lib/components/CalculatorInput.svelte";
    import {DEG2RAD} from "$lib/classes/utils.js"
    import {threeObservationsData} from '$lib/classes/store.js';


    let canvas, orbitsList = [], clearScene, addOrbit, inputTester, addOrbitToScene, changeOrbit, deleteOrbit, toggleObject, show, doShowElements, addSolarSystem, currentElement = {id: null, do: false}
    onMount(() => {
        let { baseRadius, animate, camera, scene, renderer, controls, clock, gridHelper, axesHelper, labelRenderer} = init(canvas)
        addOrbit = () => {
            const orbit = new Orbit({i: 0, Ω: 0, ω: 0}, 0, 1, 0, {}, '#46a62d', 1, 'New Orbit' + [...orbitsList].length )
            scene.add(orbit.getMesh())
            orbitsList.push(orbit)
            orbitsList = orbitsList
        }
        changeOrbit = ({elements: {i, Ω, ω, a, e, color, name}, id})=> {
            scene.remove(orbitsList[id].getMesh())
            orbitsList.splice(id, 1, new Orbit({i, Ω, ω}, 0, a, e, {}, color, 1, name, orbitsList[id].states ))
            scene.add(orbitsList[id].getMesh())

            orbitsList = orbitsList
        }
        deleteOrbit = (id, el) => {
            scene.remove(orbitsList[id].getMesh())
            el.remove()
            orbitsList.splice(id, 1, null);
            
            orbitsList = orbitsList
            doShowElements = false
            currentElement = {}
        }
        clearScene = () => {
            orbitsList = orbitsList.filter((el) => el!==null)
            orbitsList.forEach((el) => {scene.remove(el.getMesh())})
            orbitsList = []
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
            orbitsList[currentElement.id].toggleObject(key, value, scene)
        }
        addOrbitToScene = ([name, color, {semimajor_axis: a, eccentricity: e, i, omega: ω, OMEGA: Ω }]) => {
            const orbit = new Orbit({i, Ω, ω}, 1, a, e, {}, color, 1, name)
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
                new Orbit({i: DEG2RAD*1.3, Ω: DEG2RAD*100, ω: DEG2RAD*-86+2*PI}, 0, 5.203, 0.048, {}, '#ffffff', 1, 'Jupiter' ),
                new Orbit({i: DEG2RAD*2.48, Ω: DEG2RAD*113, ω: DEG2RAD*-20+2*PI}, 0, 9.555, 0.056, {}, '#ffffff', 1, 'Saturn' ),
                new Orbit({i: DEG2RAD*0.76, Ω: DEG2RAD*74, ω: DEG2RAD*99}, 0, 19.218, 0.047, {}, '#ffffff', 1, 'Uranus' ),
                new Orbit({i: DEG2RAD*1.77, Ω: DEG2RAD*132, ω: DEG2RAD*-84+2*PI}, 0, 30.110, 0.009, {}, '#ffffff', 1, 'Neptune' )
            ]
            solarSystem.forEach( (orbit) => {
                scene.add(orbit.getMesh())
            })
            orbitsList = [...orbitsList, ...solarSystem]
        }
        inputTester = (index) => {
            const testers = [
                {
                    X: [-0.99558786, -0.91681386, -0.73632421],
                    Y: [-0.10133704, -0.35890992, -0.60944062],
                    Z: [-0.04393054, -0.155592, -0.26419895],
                    alpha: [{h:14, m:7, s:12.74}, {h:14, m:41, s:18.41}, {h:15, m:20, s:23.68}],
                    delta: [{d:-5, m:47, s:32.6}, {d:-9, m:9, s:21.8}, {d:-12, m:28, s:51.2}],
                    date: ['2011-09-30', '2011-10-17', '2011-11-05'],
                    time: ['00:00:00', '00:00:00', '00:00:00']
                },
                {
                    X: [0.816712395, 0.98637432, 0.84017824],
                    Y: [-0.50943544, -0.11265284, 0.50685726],
                    Z: [-0.22085384, -0.04884073, 0.21973176],
                    alpha: [{h:0, m:18, s:0.9}, {h:0, m:56, s:48.41}, {h:1, m:55, s:49.47}],
                    delta: [{d:7, m:12, s:8.1}, {d:9, m:50, s:27.1}, {d:13, m:45, s:38.4}],
                    date: ['2011-02-15', '2011-3-14', '2011-04-24'],
                    time: ['00:00:00', '00:00:00', '00:00:00']
                },
                {
                    X: [-0.5076442725808777,-0.008253474995058999,0.5083235212755292],
                    Y: [-0.7775134786620973,-0.9025583921114275,-0.773125989459974],
                    Z: [-0.3370282761754168,-0.3912335962105993,-0.3351297099671546],
                    alpha: [{h:2,m:24,s:40.05},{h:2,m:15,s:22.2},{h:2,m:17,s:43.7}],
                    delta: [{d:12,m:54,s:24.5},{d:12,m:15,s:47.2},{d:12,m:37,s:47.1}],
                    date: ["2023-11-22","2023-12-22","2024-01-22"],
                    time: ["00:00:00","00:00:00","00:00:00"]
                }
            ]
            $threeObservationsData = testers[index]
            // $threeObservationsData = {X, Y, Z, alpha, delta, date, time}
        }  
    }) 

</script>

<div id="calculator">
    <CalculatorInput on:addOrbitToScene = "{({detail}) => addOrbitToScene(detail)}"/>
    <button on:click={addSolarSystem} style="width: 10em;">ADD SOLAR SYSTEM</button>
</div>

<div id="orbits-list">
    <div class="orbit">
        <button on:click={() => addOrbit()}>ADD ORBIT</button>
        <button on:click={() => clearScene()}>CLEAR SCENE</button>
    </div>
    {#each orbitsList as elements, id}
        <OrbitHTML {elements} {id} {show} {changeOrbit} {deleteOrbit}/>
    {/each} 
</div>  
<div bind:this={canvas}></div>
<div id="orbit-elements">
    {#if currentElement.do}
        <ElementsToggle states="{currentElement.states}" on:toggleObject="{({detail}) => toggleObject(detail)}"/>
    {/if}
    <a href="/solar">SOLAR COORDINATES</a>
    <a href="/integrate">ORBIT INTEGRATION</a>
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
        background-color: var(--menu-color);
    }
    * {
        padding: 0;
        margin: 0;
        text-decoration: none;
        border: 0;
        color: white;
    }
    a {
        text-decoration: underline;
        font-size: 75%;
        padding: 10px;
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

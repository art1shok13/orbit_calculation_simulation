<script>
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    
    import {OrbitCalculator} from '$lib/classes/ThreeObservations.js';
    import {threeObservationsData} from '$lib/classes/store.js';

    if(Object.entries($threeObservationsData).length != 7) {
        $threeObservationsData = {
            X: [0, 0, 0],
            Y: [0, 0, 0],
            Z: [0, 0, 0],
            alpha: [{}, {}, {}],
            delta: [{}, {}, {}],
            date: [],
            time: ['00:00:00', '00:00:00', '00:00:00']
        }
    }
    let {X, Y, Z, alpha, delta, date, time} = $threeObservationsData
    $: $threeObservationsData = {X, Y, Z, alpha, delta, date, time}

    let outputLOG = []
    let orbitElements = {}
    
    const submit = () => {
        const date_time = ['', '', ''].map( (val, i) => {
            if(!date[i] || !time[i]) return '20.10.2001'

            return date[i].toString() + ' ' + time[i].toString()
        })

        const Calculator = new OrbitCalculator(X, Y, Z, alpha, delta, date_time)
        orbitElements = Calculator.calculate_orbit()
        outputLOG = Calculator.getLOG()
    }

    const clear = () => {
        if(!confirm('CLEAR?')) return
        X = [0, 0, 0]
        Y = [0, 0, 0]
        Z = [0, 0, 0]
        
        alpha = [{}, {}, {}]
        delta = [{}, {}, {}]
        date = []
        time = []

        outputLOG = []
        orbitElements = {}
    }

    const inputTester = (index) => {
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
                    delta: [{d:7, m:13, s:8.1}, {d:9, m:50, s:27.1}, {d:13, m:45, s:38.4}],
                    date: ['2011-02-15', '2011-03-14', '2011-04-24'],
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
            const testerNames = ['Test 1', 'Test 2', 'Test 3']
            const testerColors = ["#2233ff", '#6644ff', '#28FFEE']
            $threeObservationsData = testers[index]
            X = $threeObservationsData.X
            Y = $threeObservationsData.Y
            Z = $threeObservationsData.Z
            alpha = $threeObservationsData.alpha
            delta = $threeObservationsData.delta
            date = $threeObservationsData.date  
            time = $threeObservationsData.time
            outputLOG = []
            submit()
            dispatch('addOrbitToScene', [testerNames[index], testerColors[index], orbitElements])
    }
    
</script>
<!-- <form action=""> -->
    <div class="indata-wrapper">
        <div class="input-wrapper alpha-input">
            <span>α<sub>0</sub>:</span>
            <input required type="number" bind:value={alpha[0].h} placeholder="h">
            <input required type="number" bind:value={alpha[0].m} placeholder="m">
            <input required type="number" bind:value={alpha[0].s} placeholder="s">
        </div>
        <div class="input-wrapper delta-input">
            <span>δ<sub>0</sub>:</span>
            <input required type="number" bind:value={delta[0].d} placeholder="°">
            <input required type="number" bind:value={delta[0].m} placeholder="m">
            <input required type="number" bind:value={delta[0].s} placeholder="s">
        </div>
        <div class="input-wrapper t-input">
            <span>t<sub>0</sub>:</span>
            <input required bind:value={date[0]} type="date">
            <input required bind:value={time[0]} type="time">
        </div>
        <div class="input-wrapper X-input">
            <span>X<sub>0</sub>:</span>
            <input required bind:value={X[0]} type="number">
        </div>
        <div class="input-wrapper Y-input">
            <span>Y<sub>0</sub>:</span>
            <input required bind:value={Y[0]} type="number">
        </div>
        <div class="input-wrapper Z-input">
            <span>Z<sub>0</sub>:</span>
            <input required bind:value={Z[0]} type="number">
        </div>
        <div class="input-wrapper alpha-input">
            <span>α<sub>1</sub>:</span>
            <input required type="number" bind:value={alpha[1].h} placeholder="h">
            <input required type="number" bind:value={alpha[1].m} placeholder="m">
            <input required type="number" bind:value={alpha[1].s} placeholder="s">
        </div>
        <div class="input-wrapper delta-input">
            <span>δ<sub>1</sub>:</span>
            <input required type="number" bind:value={delta[1].d} placeholder="°">
            <input required type="number" bind:value={delta[1].m} placeholder="m">
            <input required type="number" bind:value={delta[1].s} placeholder="s">
        </div>
        <div class="input-wrapper t-input">
            <span>t<sub>1</sub>:</span>
            <input required bind:value={date[1]} type="date">
            <input required bind:value={time[1]} type="time">
        </div>
        <div class="input-wrapper X-input">
            <span>X<sub>1</sub>:</span>
            <input required bind:value={X[1]} type="number">
        </div>
        <div class="input-wrapper Y-input">
            <span>Y<sub>1</sub>:</span>
            <input required bind:value={Y[1]} type="number">
        </div>
        <div class="input-wrapper Z-input">
            <span>Z<sub>1</sub>:</span>
            <input required bind:value={Z[1]} type="number">
        </div>
        <div class="input-wrapper alpha-input">
            <span>α<sub>2</sub>:</span>
            <input required type="number" bind:value={alpha[2].h} placeholder="h">
            <input required type="number" bind:value={alpha[2].m} placeholder="m">
            <input required type="number" bind:value={alpha[2].s} placeholder="s">
        </div>
        <div class="input-wrapper delta-input">
            <span>δ<sub>2</sub>:</span>
            <input required type="number" bind:value={delta[2].d} placeholder="°">
            <input required type="number" bind:value={delta[2].m} placeholder="m">
            <input required type="number" bind:value={delta[2].s} placeholder="s">
        </div>
        <div class="input-wrapper t-input">
            <span>t<sub>2</sub>:</span>
            <input required bind:value={date[2]} type="date">
            <input required bind:value={time[2]} type="time">
        </div>
        <div class="input-wrapper X-input">
            <span>X<sub>2</sub>:</span>
            <input required bind:value={X[2]} type="number">
        </div>
        <div class="input-wrapper Y-input">
            <span>Y<sub>2</sub>:</span>
            <input required bind:value={Y[2]} type="number">
        </div>
        <div class="input-wrapper Z-input">
            <span>Z<sub>2</sub>:</span>
            <input required bind:value={Z[2]} type="number">
        </div>
        <div class="input-wrapper"></div>
        <div class="input-wrapper"><button type="submit" style="width: 6em;" on:click={submit}>Calculate</button></div>
        <div class="input-wrapper"></div>
        <div class="textarea">
            {#each outputLOG as text}
                {text} <br>
            {/each}
        </div>
        <div class="input-wrapper"><button type="submit" style="width: 10em;" on:click={clear}>CLEAR</button></div>
        <div class="input-wrapper"></div>
        <div class="input-wrapper"><button type="submit" style="width: 10em;" on:click={ () => { dispatch('addOrbitToScene', ['orbit', '#ff11ff', orbitElements]) } }>ADD ORBIT</button></div>
        <div class="input-wrapper"><button on:click={()=>{inputTester(0)}} style="width: 10em;">TEST 1</button></div>
        <div class="input-wrapper"><button on:click={()=>{inputTester(1)}} style="width: 10em;">TEST 2</button></div>
        <div class="input-wrapper"><button on:click={()=>{inputTester(2)}} style="width: 10em;">TEST 3</button></div>
    </div>
<!-- </form> -->

<style>

.indata-wrapper {
    width: 97%;
    margin-top: .7em;
    display: grid;
    grid-template-columns: 33% 33% 33%;
}

.input-wrapper {
    width: calc( 100% - 1em );
    height: 5vh;
    margin: 0 .5em;
        
    display: flex;
    justify-content: center;
    align-items: center;
}

.textarea {
    grid-column: 1 / 4;
    height: 35vh;
    /* width: 100%; */
    overflow-y: auto;
    background-color: var(--input-color);
    border-radius: 5px;
    padding: 5px;
}

input {
    margin-left: .2em;
    width: 65%;
    background-color: var(--input-color);
    border-radius: 3px;
    padding: 3px;
    color: white;
}

.t-input {
    width: 50%;
    padding-left: 20px;
}

button {
        background-color: var(--input-color);
        padding: .2em;
        border-radius: 6px;
        width: 10%;
        cursor: pointer;
        color: white;
        }
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}
</style>
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
            time: []
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
        <div class="input-wrapper"><button type="submit" style="width: 10em;" on:click={ () => { dispatch('addOrbitToScene', orbitElements) } }>ADD ORBIT</button></div>
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
    width: 70%;
    background-color: var(--input-color);
    border-radius: 3px;
    padding: 3px;
    color: white;
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
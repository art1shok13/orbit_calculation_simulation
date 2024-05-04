<script>
    import EARTH from '$lib/json/VSOP87.json'
    import { solarRect } from '$lib/utils/utils.js'
    const {sin, cos, tan, sqrt, trunc, PI, asin, atan, abs, sign, atan2, round} = Math

    let year = 2000, month = 1, date = 1, hour = 0, minute = 0, second = 0
    let X = (1).toFixed(6)
    let Y = (1).toFixed(6)
    let Z = (1).toFixed(6)
    let dist = Math.sqrt(X*X + Y*Y + Z*Z).toFixed(6)
    function CALC() {
        const coords = solarRect(year, month, date, hour, minute, second, EARTH)
        X = coords.X.toFixed(6)
        Y = coords.Y.toFixed(6)
        Z = coords.Z.toFixed(6)
        dist = Math.sqrt(X*X + Y*Y + Z*Z).toFixed(6)
    }
    CALC()

</script>

<div class="container">
    <div class="inputs">
        <span>Y:</span>
        <input required type="number" bind:value={year}>
        <span>M:</span>
        <input required type="number" bind:value={month}>
        <span>D:</span>
        <input required type="number" bind:value={date}>
        <span>H:</span>
        <input required type="number" bind:value={hour}>
        <span>M:</span>
        <input required type="number" bind:value={minute}>
        <span>S:</span>
        <input required type="number" bind:value={second}>
    </div>
    <div class="output">
        X: {X}<br>
        Y: {Y}<br>
        Z: {Z}<br>
        R: {dist}
    </div>
    <button on:click={CALC}>CALCULATE</button>
    <a href="/">ORBITS</a>
</div>

<style>
    .output {
        font-size: 150%;
    }
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .inputs {
        width: 35%;
        display: flex;  
        align-items: center;
        margin-bottom: 15px;
    }
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

    :root {
        --input-color: #3f4146;
        --menu-color: #202124;
        --orbit-color: #333439;
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
    input {
        margin-left: .2em;
        margin-top: .3em;
        width: 10%;
        background-color: var(--input-color);
        border-radius: 3px;
        padding: 3px;
        color: white;
    }
    a {
        text-decoration: underline;
        font-size: 100%;
        padding: 10px;
        color: white;
    }
</style>
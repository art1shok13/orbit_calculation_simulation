<script>
    export let elements
    export let id
    export let deleteOrbit
    export let changeOrbit
    export let show
    let {i, Ω, ω, a, e, color, name} = elements
    $: elements = {i, Ω, ω, a, e, color, name}

    let el
</script>

<div class="orbit" id="{id}" bind:this = {el}>
    <input type="text" class="name" placeholder="name" bind:value="{name}" on:input={ ()=> changeOrbit({elements, id}) }>
    <span>i:</span>
    <input type="number" class="i-param" placeholder="i" step="0.01" bind:value="{i}" on:input={ ()=> changeOrbit({elements, id}) }>
    <span>Ω:</span>
    <input type="number" class="Ω-param" placeholder="Ω" step="0.01" bind:value="{Ω}" on:input={ ()=> changeOrbit({elements, id}) }>
    <span>ω:</span>
    <input type="number" class="ω-param" placeholder="ω" step="0.01" bind:value="{ω}" on:input={ ()=> changeOrbit({elements, id}) }>
    <span>a:</span>
    <input type="number" class="a-param" placeholder="a" step="0.01" bind:value="{a}" min="0.00001" on:input={ ()=> changeOrbit({elements, id}) }>
    <span>e:</span>
    <input type="number" class="e-param" placeholder="e" step="0.01" bind:value="{e}" min="0" on:input={ ()=> changeOrbit({elements, id}) }>
    <!-- <span>v:</span> -->
    <!-- <input type="number" class="v-param" placeholder="anomaly" step="0.01" bind:value="{v}" min="0" on:input={ ()=>dispatch('change', elements) }> -->
    <!-- <span>P:</span> -->
    <!-- <input type="number" class="P-param" placeholder="P" step="0.1" bind:value="{P}" on:input={ ()=>dispatch('change', elements) }> -->
    <span>color:</span>
    <input type="color" bind:value="{color}" on:input={ ()=> changeOrbit({elements, id}) }>
    <button type="button" on:click={ () => show(id) }>✎</button>
    <button type="button" on:click={ () => deleteOrbit(id, el) }>x</button>
</div>

<style>
    input {
        margin-left: .2em;
        width: 8%;
        background-color: var(--input-color);
        border-radius: 3px;
        padding: 3px; 
        color: white;
        
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
    .name {
        background-color: var(--orbit-color);
        border: none;
    }
    button {
        background-color: var(--input-color);
        color: white;
    }
</style>
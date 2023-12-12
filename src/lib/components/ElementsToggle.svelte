<script>
    import Vector from "$lib/components/Vector.svelte"
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    
    export let states
    let {iHelper, ΩHelper, ωHelper, aHelper, QHelper, qHelper, hHelper, nHelper} = states
    // on:input={ ()=>dispatch('change', elements) }
</script>

<div>
    <h3>Kepler elements</h3>
    <div class="input-grid">
        <label for="i">i:<input bind:checked="{iHelper}" type="checkbox" on:change={()=> dispatch('toggleObject', {iHelper})} id="i"></label>
        <label for="Omega">Ω:<input bind:checked="{ΩHelper}" type="checkbox" on:change={()=> dispatch('toggleObject', {ΩHelper})} id="Omega"></label>
        <label for="omega">ω:<input bind:checked="{ωHelper}" type="checkbox" on:change={()=> dispatch('toggleObject', {ωHelper})} id="omega"></label>
        <label for="a">a:<input bind:checked="{aHelper}" type="checkbox" on:change={()=> dispatch('toggleObject', {aHelper})} id="a"></label>
        <!-- <label for="e">e:<input bind:value="{i}" type="checkbox" id="e"></label> -->
    </div>
</div>
<div>
    <h3>Scalar elements</h3>
    <div class="input-grid">
        <label for="Q">Q:<input bind:value="{QHelper}" type="checkbox" on:change={()=> dispatch('toggleObject', {QHelper})} id="Q"></label>
        <label for="q">q:<input bind:value="{qHelper}" type="checkbox" on:change={()=> dispatch('toggleObject', {qHelper})} id="q"></label>
    </div>
</div>
<div>
    <h3>Vector elements</h3>
    <div class="input-grid">
        <label for="normal"><Vector text="h"/><input bind:value="{hHelper}" type="checkbox" on:change={()=> dispatch('toggleObject', {hHelper})} id="normal"></label>
        <label for="ascending-node"><Vector text="n"/><input bind:value="{nHelper}" type="checkbox" on:change={()=> dispatch('toggleObject', {nHelper})} id="ascending-node"></label>
    </div>
</div>

<style>

</style>
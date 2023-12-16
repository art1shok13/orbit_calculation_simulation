import { writable, get } from "svelte/store";
// import { browser } from "$app/environment";

export const threeObservationsData = writable(localStorage.getItem('threeObservationsData') || '{}')
threeObservationsData.set(JSON.parse( get(threeObservationsData) ))
threeObservationsData.subscribe( (val) => localStorage.setItem('threeObservationsData', JSON.stringify(val)))

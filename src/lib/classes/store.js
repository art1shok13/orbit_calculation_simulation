import { writable, get } from "svelte/store";
import { browser } from "$app/environment";

export const threeObservationsData = writable(browser && localStorage.getItem('threeObservationsData') || '{}')

if (browser){
    threeObservationsData.set(JSON.parse( get(threeObservationsData) ))
    threeObservationsData.subscribe( (val) => localStorage.setItem('threeObservationsData', JSON.stringify(val)))
}    

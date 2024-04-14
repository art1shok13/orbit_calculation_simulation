<script>
    const { atan, sin, cos, PI, sqrt, sign, tan, sinh, cosh, abs, asin, acos } = Math
    import { dateToJulianNumber } from '$lib/utils/utils.js'

    import mer from '$lib/json/VSOP87A.mer.json'
    import ven from '$lib/json/VSOP87A.ven.json'
    import ear from '$lib/json/VSOP87A.ear.json'
    import mar from '$lib/json/VSOP87A.mar.json'
    import jup from '$lib/json/VSOP87A.jup.json'
    import sat from '$lib/json/VSOP87A.sat.json'
    import ura from '$lib/json/VSOP87A.ura.json'
    import nep from '$lib/json/VSOP87A.nep.json'

    function RECTPLANETCALC(JDE, PLANET, eps){
            const tau = (JDE - 2451545) / 365250
        
            const {X0, X1, X2, X3, X4, X5, Y0, Y1, Y2, Y3, Y4, Y5, Z0, Z1, Z2, Z3, Z4, Z5} = PLANET
            const termValue = (acc, L) => { return acc + L.A * cos(L.B + L.C * tau) }
            const X = (X0.reduce(termValue, 0) + X1.reduce(termValue, 0)*tau**1 + X2.reduce(termValue, 0)*tau**2 + X3.reduce(termValue, 0)*tau**3 + (X4 || []).reduce(termValue, 0)*tau**4 + (X5 || []).reduce(termValue, 0)*tau**5)
            const Y = (Y0.reduce(termValue, 0) + Y1.reduce(termValue, 0)*tau**1 + Y2.reduce(termValue, 0)*tau**2 + Y3.reduce(termValue, 0)*tau**3 + (Y4 || []).reduce(termValue, 0)*tau**4 + (Y5 || []).reduce(termValue, 0)*tau**5)
            const Z = (Z0.reduce(termValue, 0) + Z1.reduce(termValue, 0)*tau**1 + Z2.reduce(termValue, 0)*tau**2 + Z3.reduce(termValue, 0)*tau**3 + (Z4 || []).reduce(termValue, 0)*tau**4 + (Z5 || []).reduce(termValue, 0)*tau**5)

            const Xeq = X
            const Yeq = Y*cos(eps) - Z*sin(eps)
            const Zeq = Y*sin(eps) + Z*cos(eps)

            return [Xeq, Yeq, Zeq]
    }

    const k = 0.017202098950
    const plnMk2_25 = [ 0.01057, 0.1822, 0.2242, 0.02391, 70.6336, 21.137, 3.235, 3.830 ]

    const VSOP = [mer, ven, ear, mar, jup, sat, ura, nep]

    function keplerEquation(M, e, i){
        let E = M
        for(let j=0; j!=90; j++){
            const M1 = E - e*sin(E)
            E = E + (M - M1) / ( 1 - e*cos(E) )
        }
        return E
    }

    function eps(JD){
        const T = (JD - 2451545) / 36525
        const _omega_ = ( 125 + (2 + 40.28/60)/60 ) - ( 1934 + (8 + 10.539/60)/60 )*T + (7.455/3600)*T**2 + (0.008/3600)*T**3
        const E0 = (84381.448 - 46.815*T - 0.00059*T**2 + 0.001813*T**3) / 3600
        const DE = 9.2025*cos(_omega_/180*PI) / 3600
        const eps = (E0 + DE)/180*PI

        return eps
    }

    // const M0 = (75 + 46/60 + 11.94/3600) / 180*PI  
    // const omega = (71 + 4/60 + 5.06/3600) / 180 * PI
    // const OMEGA = (80 + 48/60 + 50.71/3600) / 180 * PI
    // const i = (10 + 35/60 + 49.0/3600 ) / 180 * PI
    // const phi = sin( 0.07942668 )
    // const mu = k/sqrt( 2.76723786**3)

    // const JD = dateToJulianNumber(1941, 1, 6)
    // const JD0  = dateToJulianNumber(1946, 8, 28)
    // const h = 10
    let log = ''
    function calc(M0, mu, OMEGA, omega, i, phi, JD0, JD, h){

        const a = ( k/mu )**(2/3)
        const e = sin(phi)

        function vectorElements(){

            const alpha = [
                sin(OMEGA)*sin(omega),
                sin(OMEGA)*cos(omega)
            ]
            const beta = [
                cos(OMEGA)*sin(omega),
                cos(OMEGA)*cos(omega)
            ]
            const gamma = [
                sin(i)*sin(omega),
                sin(i)*cos(omega)
            ]

            const sinPHI = e
            const cosPHI = sqrt(1 - sinPHI**2)
            
            const sinEPS = -0.39788118
            const cosEPS = -0.91743695

            const Px = beta[1] - alpha[0]*cos(i)
            const Py = (alpha[1] + beta[0]*cos(i))*cosEPS - gamma[0]*sinEPS
            const Pz = (alpha[1] + beta[0]*cos(i))*sinEPS + gamma[0]*cosEPS
            
            const Qx =   -beta[0] - alpha[1]*cos(i)
            const Qy = ( -alpha[0] + beta[1]*cos(i))*cosEPS - gamma[1]*sinEPS
            const Qz = ( -alpha[0] + beta[1]*cos(i))*sinEPS + gamma[1]*cosEPS
            
            const Ax = a*Px
            const Ay = a*Py
            const Az = a*Pz
            
            const Bx = a*cosPHI*Qx
            const By = a*cosPHI*Qy
            const Bz = a*cosPHI*Qz

            return [Ax, Ay, Az, Bx, By, Bz]
        }
        const [Ax, Ay, Az, Bx, By, Bz] = vectorElements()

        const E = keplerEquation(M0, e, 100)

        const sinE = sin(E)
        const cosE = cos(E)

        const x0 = (Ax*(cosE - e) + Bx*sinE)
        const y0 = (Ay*(cosE - e) + By*sinE)
        const z0 = (Az*(cosE - e) + Bz*sinE)
        const r = sqrt(x0**2 + y0**2 + z0**2)

        const SQRTa = k / (r*sqrt(a))
        const vx0 = SQRTa * (Bx*cosE - Ax*sinE)
        const vy0 = SQRTa * (By*cosE - Ay*sinE)
        const vz0 = SQRTa * (Bz*cosE - Az*sinE)

        let state = [x0, y0, z0, vx0, vy0, vz0]

        let t = JD0
        let tEnd = JD//2430000.5 + 365*12
        // let h = 10

        let results = [];
        let directionOfIntegration = 1
        if(t > tEnd) directionOfIntegration = -1
        while (t * directionOfIntegration < tEnd * directionOfIntegration) {
            results.push({ t: t, x: state[0], y: state[1], z: state[2] });
            state = rungeKutta(t, state, h);
            t += h * directionOfIntegration;
            log += `t: ${t}, x: ${state[0].toFixed(4)}, y: ${state[1].toFixed(4)}, z: ${state[2].toFixed(4)}, vx: ${state[3].toFixed(4)}, vx: ${state[4].toFixed(4)}, vx: ${state[5].toFixed(4)}\n`
        }
        results.forEach(result => {
            // console.log(result.x)
        })
        // console.log(results[results.length-1].x)
        function gravitationalAcceleration([x, y, z], T) {
            const r = sqrt(x * x + y * y + z * z);
            
            let X = 0, Y = 0, Z = 0
            for (let plnIndex in plnMk2_25){
                // break;
                const [xi, yi, zi] = RECTPLANETCALC(T, VSOP[plnIndex], eps(T))
                const rhoi = sqrt((xi-x)**2 + (yi-y)**2 + (zi-z)**2)
                const m = plnMk2_25[plnIndex] / 10**7 / 25
                X += m * ( (xi - x) / (rhoi**3) - xi/r**3 )
                Y += m * ( (yi - y) / (rhoi**3) - yi/r**3 )
                Z += m * ( (zi - z) / (rhoi**3) - zi/r**3 )
            }  
            const ax = - x * k*k / r**3 + X
            const ay = - y * k*k / r**3 + Y
            const az = - z * k*k / r**3 + Z
            return [ax, ay, az]
        }

        function equations(T, state) {
            let x = state[0]
            let y = state[1]
            let z = state[2]
            let vx = state[3]
            let vy = state[4]
            let vz = state[5]

            let r = sqrt(x*x + y*y + z*z);
            // console.log(r)
            // const f = gravitationalAcceleration(r, T)
            const [ax, ay, az] = gravitationalAcceleration(state, T)

            return [vx, vy, vz, ax, ay, az];
        }

        function rungeKutta(t, state, h) {
            let k1 = equations(t, state);
            let k2 = equations(t + h / 2, state.map((si, i) => si + h / 2 * k1[i]));
            let k3 = equations(t + h / 2, state.map((si, i) => si + h / 2 * k2[i]));
            let k4 = equations(t + h, state.map((si, i) => si + h * k3[i]));

            return state.map((si, i) => si + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
        }
    }
    // calc(M0, mu, OMEGA, omega, i, phi, JD0, JD, h)

    function CALC(){
        log = ''
        calc(M0, mu, OMEGA, omega, i, phi, JD0, JD, h)

    }
    let e = 0
    let a = 1
    let phi = sin(e)
    let M0 = 0
    let mu = k / sqrt(a)
    let OMEGA = 0 
    let omega = 0
    let i = 0
    let JD0 = dateToJulianNumber(2000, 1, 1)
    let JD = dateToJulianNumber(2000, 1, 2)
    let h = 10
</script>

<div class="container">
    <div class="inputs">
        <span>a:</span>
        <input required type="number" bind:value={a}>
        <span>e:</span>
        <input required type="number" bind:value={e}>
        <span>Ω:</span>
        <input required type="number" bind:value={OMEGA}>
        <span>ω:</span>
        <input required type="number" bind:value={omega}>
        <span>M0:</span>
        <input required type="number" bind:value={M0}>
        <span>i:</span>
        <input required type="number" bind:value={i}>
        <br>
        <span>JD0:</span>
        <input required type="number" bind:value={JD0}>
        <span>JD:</span>
        <input required type="number" bind:value={JD}>
        <span>h:</span>
        <input required type="number" bind:value={h}>
    </div>
    <div class="output">
        <textarea width="" name="" id="">{log}</textarea>
    </div>
    <button on:click={CALC}>CALCULATE</button>
</div>

<style>
    textarea {
        color: white;
        height: 35vh;
        margin-top: 10px;
        width: 45vw;
        overflow-y: auto;
        background-color: var(--input-color);
        border-radius: 5px;
        padding: 5px;
    }
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
        width: 50%;
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
</style>
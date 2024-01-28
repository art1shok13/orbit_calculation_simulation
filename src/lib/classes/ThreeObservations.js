import {RAD2DEG, DEG2RAD, alphaToRad, deltaToRad, dateToJulianNumber, determinant_3x3, emptyArray, angleFromSinCos} from '$lib/classes/utils.js'
const { atan, sin, cos, PI, sqrt, tan, sinh, cosh, abs, asin, acos } = Math

const X = [ -0.99558786, -0.91681386, -0.73632421 ]
const Y = [ -0.10133704, -0.35890992, -0.60944062 ]
const Z = [ -0.04393054, -0.155592, -0.26419895 ]

let alpha = [
    {h: 14, m: 7, s: 12.74},
    {h: 14, m: 41, s: 18.42},
    {h: 15, m: 20, s: 23.68},
]
let delta = [
    {d: -5, m: 47, s: 32.6},
    {d: -9, m: 9, s: 21.8},
    {d: -12, m: 28, s: 51.2}
]

const t = [
        '2011-09-30 00:00:00',
        '2011-10-17 00:00:00',
        '2011-11-05 00:00:00'
]
class OrbitCalculator {
    LOG = []
    constructor(
            X = [0, 0, 0],
            Y = [0, 0, 0],
            Z = [0, 0, 0],
            alpha = [{h: 0, m: 0, s: 0}, {h: 0, m: 0, s: 0}, {h: 0, m: 0, s: 0}],
            delta = [{d: 0, m: 0, s: 0}, {d: 0, m: 0, s: 0}, {d: 0, m: 0, s: 0}],
            t = ['2011-09-30 00:00:00', '2011-09-30 00:00:00', '2011-09-30 00:00:00']
        ){
        this.X = X
        this.Y = Y
        this.Z = Z
        this.alpha = alpha
        this.delta = delta
        this.t = t
        
    }
    calculate_orbit(){
        let X = this.X, Y = this.Y, Z = this.Z, alpha = this.alpha, delta = this.delta, t = this.t
        
        const r_rho_iteration_count = 5
        const aproximation_count = 1
        const y_iteration_count = 1

        const k = 0.017202098950 
        const A = 0.0057755
        
        //STEP: 1; converting alpha, delta angles to radians
        alpha = alpha.map((a) => alphaToRad(a) )
        delta = delta.map((d) => deltaToRad(d) )
        
        //converting dates to Julian number
        console.log(t)
        t = t.map((t) => dateToJulianNumber(new Date(t + ':00 GMT+0000')) )
        console.log(t)

        //STEP: 2; calculating directed cosines
        const lambda = emptyArray(3).map((lambda, index) => cos(delta[index]) * cos(alpha[index]))
        const mu = emptyArray(3).map((mu, index) => cos(delta[index]) * sin(alpha[index]))
        const nu = emptyArray(3).map((nu, index) => sin(delta[index]))
        this.log({lambda, mu, nu})

        //STEP 3; calculation determinants
        const D = determinant_3x3([
            [lambda[0], lambda[1], lambda[2]],
            [    mu[0],     mu[1],     mu[2]],
            [    nu[0],     nu[1],     nu[2]]
        ])
        const d = emptyArray(3).map((d, i) => {
            return determinant_3x3([
                [lambda[0], X[i], lambda[2]],
                [    mu[0], Y[i],     mu[2]],
                [    nu[0], Z[i],     nu[2]]
            ])
        })
        const d_ = emptyArray(3).map((e, i) => {
            return  determinant_3x3([
                    [ X[i], lambda[1], lambda[2]],
                    [ Y[i], mu[1],     mu[2]],
                    [ Z[i], nu[1],     nu[2]],
                ])
        })
        const d__ = emptyArray(3).map((e, i) => {
            return  determinant_3x3([
                    [lambda[0], lambda[1], X[i]],
                    [mu[0],     mu[1],     Y[i]],
                    [nu[0],     nu[1],     Z[i]],
                ])
        })
        this.log({D, d, d_, d__})
        
        //STEP 4; calculating tau

        const tau = [
            k * (t[2]-t[1]),
            k * (t[2]-t[0]),
            k * (t[1]-t[0])
        ]
        this.log({tau})

        function rRhoIterator(tau){
            const n_0 = [
                tau[0] / tau[1],
                null,
                tau[2] / tau[1]
            ]
        
            const v = [
                tau[0]*tau[2] * (1 + n_0[0]) / 6,
                null,
                tau[0]*tau[2] * (1 + n_0[2]) / 6,
            ]
        
            //STEP 6; calucalting k_0 and l_0
            const k_0 = ( d[0]*n_0[0] - d[1] + d[2]*n_0[2] ) / -D
            const l_0 = ( d[0]*v[0] + d[2]*v[2] ) / -D
                    
            //STEP 7; calculation R*cosθ
            const Rcos = lambda[1]*X[1] + mu[1]*Y[1] + nu[1]*Z[1]
        
            //STEP 8; solving the eqution with two unknowns using iterator; srqd - ^2
            const R_2_sqrd = X[1]**2 + Y[1]**2 + Z[1]**2
            let p_2 = k_0
            let r_2_sqrd 
            for(let i = 0; i<=r_rho_iteration_count; i++) {
                r_2_sqrd = R_2_sqrd + p_2**2 - 2*p_2*Rcos
                p_2 = k_0 + l_0 / sqrt(r_2_sqrd)**3
            }
        
            //STEP 9; n[0] and n[2]
            const n = [
                n_0[0] + v[0] / sqrt(r_2_sqrd)**3,
                null,
                n_0[2] + v[2] / sqrt(r_2_sqrd)**3
            ]
        
            const rho = [
                ( d_[0] * n[0] - d_[1] + n[2] * d_[2] ) / D / n[0],
                ( d[0] * n[0] - d[1] + n[2] * d[2]) / -D,
                ( d__[0] * n[0] - d__[1] + n[2] * d__[2]) / D / n[2]
            ]
        
            const x = emptyArray(3).map((x, i) => lambda[i]*rho[i] - X[i])
            const y = emptyArray(3).map((y, i) => mu[i]*rho[i] - Y[i])
            const z = emptyArray(3).map((z, i) => nu[i]*rho[i] - Z[i])
        
            const r = emptyArray(3).map((r, i) => sqrt(x[i]**2 + y[i]**2 + z[i]**2) )
            return {x, y, z, r, rho, n}
        }
        
        let iteratorOutput = rRhoIterator(tau)

        //STEP 13; aberation correction
        const t_corrected = emptyArray(3).map((ttt, i) => t[i] - A*iteratorOutput.rho[i])
        const tau_corrected = [
            k * (t_corrected[2] - t_corrected[1]),
            k * (t_corrected[2] - t_corrected[0]),
            k * (t_corrected[1] - t_corrected[0])
        ]
        this.log({t_corrected, tau_corrected})

        iteratorOutput = rRhoIterator(tau_corrected)
        const {x, y, z, r} = iteratorOutput

        // this.log({x, y, z, r})

        function SecondAndNextAproximations(x, y, z, r, tau_corrected, d, d_, d__, y_iteration_count){
        
            const chi = [
                sqrt(2 * (r[1]*r[2] + x[1]*x[2] + y[1]*y[2] + z[1]*z[2])),
                sqrt(2 * (r[0]*r[2] + x[0]*x[2] + y[0]*y[2] + z[0]*z[2])),
                sqrt(2 * (r[1]*r[0] + x[1]*x[0] + y[1]*y[0] + z[1]*z[0])),
            ]
            
            const m = emptyArray(3).map((m, i) => tau_corrected[i]**2 / chi[i]**3)
            
            const l = [
                ((r[1] + r[2])/chi[0] - 1)/2,
                ((r[0] + r[2])/chi[1] - 1)/2,
                ((r[1] + r[0])/chi[2] - 1)/2,
            ]
            
            const y_vec = emptyArray(3).map((y, i) => {
                let y_vec = 1.05
            
                for(let j = 0; j<=y_iteration_count; j++) {
                    const g = 2*asin(sqrt( m[i]/y_vec**2 - l[i] ))
                    const z = 1/y_vec**2  *  m[i]*(2*g - sin(2*g)) / sin(g)**3
                    y_vec = z + 1
                }
                return y_vec
            })

            const n_new = [
                tau_corrected[0]/tau_corrected[1]  *  y_vec[1]/y_vec[0],
                null,
                tau_corrected[2]/tau_corrected[1]  *  y_vec[1]/y_vec[2]
            ]
        
            const rho_new = [
                ( d_[0] * n_new[0] - d_[1] + n_new[2] * d_[2] ) / D / n_new[0],
                ( d[0] * n_new[0] - d[1] + n_new[2] * d[2]) / -D,
                ( d__[0] * n_new[0] - d__[1] + n_new[2] * d__[2]) / D / n_new[2]
            ]
            
            const x_new = emptyArray(3).map((x, i) => lambda[i]*rho_new[i] - X[i])
            const y_new = emptyArray(3).map((y, i) => mu[i]*rho_new[i] - Y[i])
            const z_new = emptyArray(3).map((z, i) => nu[i]*rho_new[i] - Z[i])
            
            const r_new = emptyArray(3).map((r, i) => sqrt(x_new[i]**2 + y_new[i]**2 + z_new[i]**2) )
        
            return {rho_new, x_new, y_new, z_new, r_new, y_vec}
        }
        
        let x_new = x
        let y_new = y
        let z_new = z
        let r_new = r
        let y_vec = []

        for(let step=0; step!=aproximation_count; step++) {
            const {x_new: x_step, y_new: y_step, z_new: z_step, r_new: r_step, y_vec: y_vec_step} = SecondAndNextAproximations(x_new, y_new, z_new, r_new, tau_corrected, d, d_, d__, y_iteration_count)
            x_new = x_step
            y_new = y_step
            z_new = z_step
            r_new = r_step
            y_vec = y_vec_step
        }
        this.log({x_new, y_new, z_new})

        //CALCULATING ORBIT ELEMENTS
        const rrsinV2_V0 = sqrt(
            ( y_new[0]*z_new[2] - y_new[2]*z_new[0] )**2 +
            ( z_new[0]*x_new[2] - z_new[2]*x_new[0] )**2 +
            ( x_new[0]*y_new[2] - x_new[2]*y_new[0] )**2
        )
        this.log({rrsinV2_V0})

        const sinV2_V0 = rrsinV2_V0 / r_new[2] / r_new[0]
        
        const rrcosV2_V0 = x_new[0]*x_new[2] +y_new[0]*y_new[2] + z_new[0]*z_new[2]
        const cosV2_V0 = rrcosV2_V0 / r_new[2] / r_new[0]
        
        const parameter = (rrsinV2_V0 * y_vec[1] / tau_corrected[1])**2

        const e_cosV = [
            parameter / r_new[0] - 1,
            null,
            parameter / r_new[2] - 1
        ]

        const e_sinV = [
            (  e_cosV[0] * cosV2_V0  - e_cosV[2] ) / sinV2_V0,
            null,
        ]

        const eccentricity = sqrt(e_cosV[0]**2 + e_sinV[0]**2)

        const semimajor_axis = parameter / (1 - eccentricity**2)

        // calculating directed cosines of P and Q
        const V = [
            angleFromSinCos(e_sinV[0]/eccentricity, e_cosV[0]/eccentricity),
            null,
            asin(sinV2_V0) + angleFromSinCos(e_sinV[0]/eccentricity, e_cosV[0]/eccentricity)
        ]
        this.log({V})

        const P = {
            x: ( x_new[0]*r_new[2]*sin(V[2]) - x_new[2]*r_new[0]*sin(V[0]) ) / rrsinV2_V0,
            y: ( y_new[0]*r_new[2]*sin(V[2]) - y_new[2]*r_new[0]*sin(V[0]) ) / rrsinV2_V0,
            z: ( z_new[0]*r_new[2]*sin(V[2]) - z_new[2]*r_new[0]*sin(V[0]) ) / rrsinV2_V0,
        }

        const Q = {
            x: ( x_new[0]*r_new[2]*cos(V[2]) - x_new[2]*r_new[0]*cos(V[0]) ) * -1 / rrsinV2_V0,
            y: ( y_new[0]*r_new[2]*cos(V[2]) - y_new[2]*r_new[0]*cos(V[0]) ) * -1 / rrsinV2_V0,
            z: ( z_new[0]*r_new[2]*cos(V[2]) - z_new[2]*r_new[0]*cos(V[0]) ) * -1 / rrsinV2_V0,
        }
        // this.log({P, Q})

        //calculating orbit angles
        const epsilon = 23.439281*DEG2RAD
        const sinwsini = P.z*cos(epsilon) - P.y*sin(epsilon)
        const coswsini = Q.z*cos(epsilon) - Q.y*sin(epsilon)

        const sini = sqrt( sinwsini**2 + coswsini**2)

        const sinw = sinwsini / sini
        const cosw = coswsini / sini
        
        const omega = angleFromSinCos(sinw, cosw) // ω angle
        
        const cosOMEGA = (P.x*cosw - Q.x*sinw)
        const sinOMEGA = cos(epsilon)**-1 * (P.y*cosw - Q.y*sinw)

        const OMEGA = angleFromSinCos(sinOMEGA, cosOMEGA) // Ω angle

        const cosi = (P.x*sinw + Q.x*cosw) / -sinOMEGA

        const i = acos(cosi) //i angle

        this.log({omega: omega/PI*180, OMEGA: OMEGA/PI*180, i: i/PI*180})

        //calculating period
        const period = semimajor_axis**1.5 * 2 * PI / k

        const tgE = [
            sqrt( (1-eccentricity) / (1+eccentricity) ) * tan(V[0]/2),
            null,
            sqrt( (1-eccentricity) / (1+eccentricity) ) * tan(V[2]/2)
        ]
        
        const E = [
            atan(tgE[0])*2+2*PI,
            null,
            atan(tgE[2])*2+2*PI
        ]

        const M = [
            E[0] - eccentricity*sin(E[0]),
            null,
            E[2] - eccentricity*sin(E[2]),
        ]

        const T0 = (t_corrected[0] * M[2]/M[0] - t_corrected[2]) * M[0]/(M[2]-M[0])

        this.log({semimajor_axis, eccentricity, i, omega, OMEGA, T0, period, parameter})
        return {semimajor_axis, eccentricity, i, omega, OMEGA, T0, period, parameter}
    }
    log(input) {
        for(let [n, value] of Object.entries(input)) {
            const dt = new Date()
            const timestamp = `[ ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}:${dt.getMilliseconds()} ]`
            const text = n + ' = ' + value + ' '
            this.LOG = [...this.LOG, `${timestamp}   ${text}`]
        }     
    }
    getLOG(){
        return this.LOG
    }
}
// calculate_orbit(X, Y, Z, alpha, delta, t)
export { OrbitCalculator }
// const lambda = [0, 0, 0].map((lambda, index) => cos(delta[index]) * cos(alpha[index]))
// this.log('lambda:', lambda)
// const mu = [0, 0, 0].map((mu, index) => cos(delta[index]) * sin(alpha[index]))
// this.log('mu:', mu)
// const nu = [0, 0, 0].map((nu, index) => sin(delta[index]))
// this.log('nu:', nu)

// const control1 = [0, 0, 0].map((c, index) => {
//     return lambda[index]**2 + mu[index]**2 + nu[index]**2
// })
// this.log(control1)

// const C = -( lambda[0]*X[0] + mu[0]*Y[0] + nu[0]*Z[0] )
// this.log('R_2: ', R_2)
// this.log('C: ', C)

// const D = lambda[0]*mu[1]*nu[2] + lambda[1]*mu[2]*nu[0] + lambda[2]*mu[0]*nu[1] 
//         - lambda[2]*mu[1]*nu[0] - lambda[1]*mu[0]*nu[2] - lambda[0]*mu[2]*nu[1]
// const U = [0, 0, 0].map((U, index) => 
//           X[index]*mu[1]*nu[2] + lambda[1]*Y[index]*nu[0] + X[index]*mu[0]*nu[1] 
//         - lambda[2]*mu[1]*Z[index] - lambda[1]*mu[0]*Z[index] - lambda[0]*Y[index]*nu[1]
//     )
// this.log('D:', D)
// this.log('U:', U)
// const tau = [
//     abs(k * (t[2] - t[1])),
//     abs(k * (t[2] - t[0])),
//     abs(k * (t[0] - t[1])),
// ]   
// this.log('tau:', tau)
// this.log('control tau:', tau[0]+tau[2]-tau[1])

// const n_0 = [
//     null,
//     tau[1] / tau[0],
//     tau[2] / tau[0]
// ]
// this.log('n:', n_0)


// const c = [
//     null,
//     tau[1] * tau[2] * (1 + n_0[1])/6,
//     tau[1] * tau[2] * (1 + n_0[2])/6
// ] 
// this.log(c[1]+c[2] - tau[0]*tau[2]/2)

// const P = ( U[0] - n_0[1]*U[1] - n_0[2]*U[2] ) / D

// const Q = ( c[1]*U[1] + c[2]*U[2] ) / D

// const S_2 = R_2 - C**2

// let rho  = []
// let n = []

// n  = [
//     null,
//     n_0[1], + c[1]*r_0**-3,
//     n_0[1], + c[1]*r_0**-3
// ]

// rho[1]*n[1]*lambda[1] + rho[2]*n[2]*lambda[2] == rho[0]*lambda[0] + n[1]*X[1] - X[0] + n[2]*X[2]
// rho[1]*n[1]*mu[1] + rho[2]*n[2]*mu[2]         == rho[0]*mu[0] + n[1]*Y[1] - Y[0] + n[2]*Y[2]
// rho[1]*n[1]*nu[1] + rho[2]*n[2]*nu[2]         == rho[0]*nu[0] + n[1]*Z[1] - Z[0] + n[2]*Z[2]


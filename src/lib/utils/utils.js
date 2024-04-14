const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const {sin, cos, tan, sqrt, trunc, PI, asin, atan, abs, sign, atan2, round} = Math

function alphaToRad({h, m, s}){
    let deg = h + m/60 + s/3600
    deg*=15
    return deg * DEG2RAD
}

function deltaToRad({d, m, s}){
    let deg = Math.abs(d) + m/60 + s/3600
    if(d<0) deg*=-1
    return deg * DEG2RAD
}

function determinant_3x3(matrix){
    const [
        [a, b, c],
        [d, e, f],
        [g, h, i]
    ] = matrix

    return a*e*i + b*f*g + c*d*h
         - c*e*g - b*d*i - a*f*h
}

function angleFromSinCos(sin_angle, cos_angle) {
    switch(true) {
    case (sin_angle>0 && cos_angle>0) :
        return Math.asin(sin_angle)
    case (sin_angle>0 && cos_angle<0) :
        return Math.acos(cos_angle)
    case (sin_angle<0 && cos_angle<0) :
        return Math.PI*2-Math.acos(cos_angle)
    case (sin_angle<0 && cos_angle>0) :
        return Math.PI*2-Math.acos(cos_angle)
    }
}

const Colors = {
    red: 0xf25346,
    white: 0xd8d0d1,
    purple: 0x8338ec,
    indigo: 0x3a86ff,
    blue: 0x68c3c0,
    orange: 0xFF9E00,
    yellow: 0xffd000
}

const emptyArray = (n) => {
    return Array(n).fill()
}

function solarRect(year = 2000, month = 1, date = 1, hour = 0, minute = 0, second = 0, vsop){
    const {L0, L1, L2, L3, L4, L5, B0, B1, B2, B3, B4, B5, R0, R1, R2, R3, R4, R5} = vsop
    
    const JD = dateToJulianNumber(year, month, date, hour, minute, second)
    // const DT = ( -15 + 32.5 * (( JD - 2378496.5) / 36525 - 0.1)**2 ) / 86400
    const DT = (102.3 + 123.5*((JD - 2451545) / 36525) + 32.5*((JD - 2451545) / 36525)**2 )/ 86400
    const JDE =  JD + DT
    const tau = (JDE - 2451545) / 365250
    
    const termValue = (acc, L) => { return acc + L.A * cos(L.B + L.C * tau) }
    const L = (180 / PI) * constrain2PI(L0.reduce(termValue, 0) + L1.reduce(termValue, 0)*tau**1 + L2.reduce(termValue, 0)*tau**2 + L3.reduce(termValue, 0)*tau**3 + L4.reduce(termValue, 0)*tau**4 + L5.reduce(termValue, 0)*tau**5)
    const B = (180 / PI) * (B0.reduce(termValue, 0) + B1.reduce(termValue, 0)*tau**1 + B2.reduce(termValue, 0)*tau**2 + B3.reduce(termValue, 0)*tau**3 + B4.reduce(termValue, 0)*tau**4 + B5.reduce(termValue, 0)*tau**5)
    const R = (R0.reduce(termValue, 0) + R1.reduce(termValue, 0)*tau**1 + R2.reduce(termValue, 0)*tau**2 + R3.reduce(termValue, 0)*tau**3 + R4.reduce(termValue, 0)*tau**4 + R5.reduce(termValue, 0)*tau**5)
    
    let T = 10*tau

    const L_ = (L + 180) - (1.397*T + 0.00031*T*T)
    const DL = (-0.09033 + 0.03916 * (cosDeg(L_) - sinDeg(L_)) * tanDeg(-B)) / 3600
    const DB =  (0.03916 * ( cosDeg(L_) - sinDeg(L_) )) / 3600
    let lambda = L + DL + 180

    const beta = -( B + DB )

    const omega = ( 125 + (2 + 40.28/60)/60 ) - ( 1934 + (8 + 10.539/60)/60 )*T + (7.455/3600)*T**2 + (0.008/3600)*T**3
    const Dpsi = -17.1996*sinDeg(omega) / 3600
    const E0 = (84381.448 - 46.815*T - 0.00059*T**2 + 0.001813*T**3) / 3600
    const DE = 9.2025*cosDeg(omega) / 3600

    const E = E0 + DE

    const T1 = T/10
    const Dlambda = (3548.193
        + 118.568 * sinDeg( 87.52874 - 359993.7286 * T1)
        + 2.476 * sinDeg( 85.0561 + 719987.4571 * T1)
        + 1.376 * sinDeg( 27.8502 + 4452671.1152 * T1)
        + 0.119 * sinDeg( 73.13754 - 450368.8564 * T1)
        + 0.114 * sinDeg(337.2264 + 329644.6718 * T1)
        + 0.086 * sinDeg(222.5400 + 659289.3436 * T1)
        + 0.078 * sinDeg(162.8136 + 9224659.7915 * T1)
        + 0.054 * sinDeg( 82.58234 - 1079981.1857 * T1)
        + 0.052 * sinDeg(171.5189 + 225184.4282 * T1)
        + 0.034 * sinDeg( 30.32144 - 4092677.3866 * T1)
        + 0.033 * sinDeg(119.8105 + 337181.4711 * T1)
        + 0.023 * sinDeg(247.5418 + 299295.6151 * T1)
        + 0.023 * sinDeg(325.1526 + 315559.5560 * T1)
        + 0.021 * sinDeg(155.1241 + 675553.2846 * T1)
        + 7.311  * sinDeg(333.4515 + 359993.7286 * T1)
        + 0.305*T1 * sinDeg(330.9814 + 719987.4571 * T1)
        + 0.010*T1 * sinDeg(328.5170 + 1079981.1857 * T1)
        + 0.309*T1**2 * sinDeg(241.4518 + 359993.7286 * T1)
        + 0.021*T1**2 * sinDeg(205.0482 + 719987.4571 * T1)
        + 0.004*T1**2 * sinDeg(297.8610 + 4452671.1152 * T1)
        + 0.010*T1**3 * sinDeg(154.7066 + 359993.7286 * T1)) / 3600
    const ABERATION = -0.005775518 * R * Dlambda

    lambda += Dpsi + ABERATION

    const [alpha, delta] = ECL2EQU(E, lambda, beta)

    
    let X = R*cosDeg(delta)*cosDeg(alpha)
    let Y = R*cosDeg(delta)*sinDeg(alpha)
    let Z = R*sinDeg(delta)
    console.log({X, Y, Z})

    return {X, Y, Z}
}

function dateToJulianNumber(year = 2000, month = 1, date = 1, hour = 0, minute = 0, second = 0){
    const floatdays = ( hour + (minute + second/ 60) / 60) / 24
    
    const y = year
    const m = month
    const d = date + floatdays
    let y_ = y
    let m_ = m
    if(m == 1 || m == 2) {
        y_ -= 1
        m_ += 12
    }

    let B = 0
    if(y>=1582) {
        function calc() {
            const A = trunc(y_/100)
            B = 2 - A + trunc(A/4)
        }
        if(y>1582) calc()
        if(y==1582) {
            if(m>10) calc()
            if(m==10 && d>=15) calc()
        }
    }
    let C = trunc(365.25 * y_)
    if(y_<0){
        C = trunc((365.25 * y_) - 0.75)
    }
    const D = trunc(30.6001 * (m_ + 1))

    return B + C + D + d + 1720994.5
}
function cosDeg(angleDegrees) {
    return Math.cos(angleDegrees*Math.PI/180)
}
function sinDeg(angleDegrees) {
    return Math.sin(angleDegrees*Math.PI/180)
}
function tanDeg(angleDegrees) {
    return sinDeg(angleDegrees) / cosDeg(angleDegrees)
}
function constrain360(a){
    a = a%360
    if(a<0) a+=360
    return a
}
function constrain2PI(a){
    a = a%(2*PI)
    if(a<0) a+=2*PI
    return a
}
function ECL2EQU(epsilon, lambda, beta){    
    let ay = sinDeg(lambda)*cosDeg(epsilon) - tanDeg(beta)*sinDeg(epsilon) 
    let ax = cosDeg(lambda)
    let a_ = atan(ay/ax) * 180/Math.PI
    const x_range = [[[0, 90], [270, 360]], [[90, 180], [180, 270]]]
    let range = x_range[abs(1-sign(ax))/2][abs(1-sign(ay))/2]
    while(true){
        if(a_ >= range[0] && a_ <= range[1]) break
        a_+=180
    }
    const alpha = a_

    const delta = asin(sinDeg(beta)*cosDeg(epsilon) + cosDeg(beta)*sinDeg(epsilon)*sinDeg(lambda)) * 180/Math.PI

    return [alpha, delta]
}
function DECIMAL2CLOCK(val, sign){
    let valText = {}
    valText.h = trunc(val)
    valText.m = trunc((val - valText.h) * 60)
    valText.s = ((((val - valText.h)*60) - valText.m) * 60).toFixed(5)
    return `${valText.h}${sign} ${valText.m}m ${valText.s}s`
}

export { solarRect, RAD2DEG, DEG2RAD, alphaToRad, deltaToRad, dateToJulianNumber, Colors, determinant_3x3, emptyArray, angleFromSinCos}
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function dateToJulianNumber(d){
    const HperD = 86400000
    return (d / HperD) - (d.getTimezoneOffset() / 1440) + 2440587.5
}

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

export {RAD2DEG, DEG2RAD, alphaToRad, deltaToRad, dateToJulianNumber, Colors, determinant_3x3, emptyArray, angleFromSinCos}
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const {trunc} = Math

function dateToJulianNumber(date){
    const floatdays = (date.getUTCHours() + (date.getUTCMinutes() + date.getUTCSeconds() / 60) / 60) / 24
    
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate() + floatdays
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

function toColor(num) {
    return '#' + num.toString(16).padStart(6, '0')
}

export {toColor, RAD2DEG, DEG2RAD, alphaToRad, deltaToRad, dateToJulianNumber, Colors, determinant_3x3, emptyArray, angleFromSinCos}
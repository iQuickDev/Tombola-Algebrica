/*! tsParticles Confetti Shape v1.7.1 by Matteo Bruni */
!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e(require("tsparticles"));else if("function"==typeof define&&define.amd)define(["tsparticles"],e);else{var o="object"==typeof exports?e(require("tsparticles")):e(t.window);for(var r in o)("object"==typeof exports?exports:t)[r]=o[r]}}(this,(function(t){return(()=>{"use strict";var e={920:e=>{e.exports=t}},o={};function r(t){var l=o[t];if(void 0!==l)return l.exports;var a=o[t]={exports:{}};return e[t](a,a.exports,r),a.exports}r.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var l={};return(()=>{r.r(l);var t=r(920);t.tsParticles.addShape("confetti",(function(e,o,r,l,a,i){var n;const s=null!==(n=o.shapeData)&&void 0!==n?n:{};void 0===s.type?s.type="square":s.type instanceof Array&&(s.type=t.Utils.itemFromArray(s.type)),void 0===o.wobble&&(o.wobble=10*Math.random()),void 0===o.tiltAngle&&(o.tiltAngle=Math.random()*Math.PI);const b=2*r;o.ovalScalar=.6,o.wobble+=.1,o.tiltAngle+=.1,o.tiltSin=Math.sin(o.tiltAngle),o.tiltCos=Math.cos(o.tiltAngle),o.random=Math.random()+5,o.wobbleX=b*Math.cos(o.wobble),o.wobbleY=b*Math.sin(o.wobble);const p=o.random*o.tiltCos,c=o.random*o.tiltSin,d=o.wobbleX+o.random*o.tiltCos,f=o.wobbleY+o.random*o.tiltSin;"circle"===s.type?e.ellipse(0,0,Math.abs(d-p)*o.ovalScalar,Math.abs(f-c)*o.ovalScalar,Math.PI/10*o.wobble,0,2*Math.PI):(e.moveTo(0,0),e.lineTo(o.wobbleX,c),e.lineTo(d,f),e.lineTo(p,o.wobbleY))}))})(),l})()}));
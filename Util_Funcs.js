'use strict';
// DOM Functions
function crtElem(pe, ne, {cont = undefined, props = undefined, evnts = undefined} = undefined) {
	const elem = document.createElement(ne);
	pe.appendChild(elem);
	if (cont) {elem.appendChild(document.createTextNode(cont));}
	if (props) {
		for (let {prop, subprop = undefined, val} of props) {
	    if (prop === 'style') {elem[prop][subprop] = val;}
	    else {elem[prop] = val;}
	  }
	}
	if (evnts) {for (let {type, func, argLst = undefined} of evnts) {
		elem.addEventListener(type, () => {func(argLst);});
	}}
  return elem;
}
// Drawing Functions
function drawEllipse(cnvs2d, x, y, radX, radY, color, type = 'fill', lnWid = 1, shdw = undefined) {
	cnvs2d[type + 'Style'] = color;
	if (type === 'stroke') {cnvs2d.lineWidth = lnWid;}
	if (shdw) {
		cnvs2d.shadowColor = shdw.color, cnvs2d.shadowBlur = shdw.blur;
		cnvs2d.shadowOffsetX = shdw.x, cnvs2d.shadowOffsetY = shdw.y;
	} else {
		cnvs2d.shadowColor = '#0000', cnvs2d.shadowBlur = 0;
		cnvs2d.shadowOffsetX = 0, cnvs2d.shadowOffsetY = 0;
	}
	cnvs2d.beginPath();
	cnvs2d.ellipse(x, y, radX, radY, 0, 0, Math.PI*2);
	cnvs2d[type]();
}
function drawText(cnvs2d, x, y, color, fntSz, i, cntnt) {
	cnvs2d.fillStyle = color;
	cnvs2d.textAlign = 'center';
	cnvs2d.textBaseline = 'middle';
	cnvs2d.font = fntSz + 'px serif';
  cnvs2d.fillText(cntnt, x, y);
}

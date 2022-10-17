class MenuBar {
  #prnt;  #wrap;  #mnbrP;  #fllMn;  #grdMn;  #hdMn;  #clsMn;
  constructor(tble, pe) {
    const sf = this;
    sf.#prnt = pe;
    sf.#wrap = crtElem(sf.#prnt, 'div', {props: [{prop: 'className', val: 'menuWrap'}]});
    sf.#mnbrP = crtElem(sf.wp, 'p',{cont: String(tbleArr.length+1), props: [{prop: 'className', val: 'mnbrP'}]});
    const elemObj =
      [{s: sf.#fllMn, p: sf.wp, t: 'button', c: 'menuFull', f: sf.sizeTble,
        a: [tble, '#0f0', '#f0f', 'absolute', (a)=>{return a;}, 'grid', 1]},
      {s: sf.#grdMn, p: sf.wp, t: 'button', c: 'menuGrid', f: sf.sizeTble,
        a: [tble, '#00f', '#ff0', 'static', (a)=>{return a;}, 'grid', 1]},
      {s: sf.#hdMn, p: sf.wp, t: 'button', c: 'menuHide', f: sf.sizeTble,
        a: [tble, '#ff0', '#00f', 'static', (a)=>{return !a;}, 'none', -1]},
      {s: sf.#clsMn, p: sf.wp, t: 'button', c: 'menuClose', f: sf.sizeClose, a: [tble]}];
    for (let {s, p, t, c=undefined, x=null, f=undefined, a=undefined} of elemObj) {
      s = crtElem(p, t, {cont:x, props:[{prop:'className', val:c}], evnts:[{type:'click', func:f, argLst:a}]});
    }
  }
  // Accessors
  get wp() {return this.#wrap;}

  sizeTble([tble, bgc, clr, pos, tdp, sdp, inc]) {
    tble.mb.wp.style.backgroundColor = bgc;
    tble.mb.wp.style.color = clr;
    tble.wp.style.position = pos;
    if (tdp(tble.wp.style.display === 'none')) {
      tble.wp.style.display = sdp;
      vsblTbls += inc;
    }
    for (let tbl of tbleArr) {tbl.resizeCanvas();}
  }
  sizeClose([tble]) {
    tble.wp.style.position = 'static';
    if (tble.wp.style.display !== 'none') {vsblTbls--;}
    cnvsMenu.removeChild(tble.mb.wp);
    tble.wp.parentNode.removeChild(tble.wp);
    for (let tbl = tbleArr.length-1; tbl >= 0; tbl--) {if (tbleArr[tbl] === tble) {
      tbleArr.splice(tbl, 1);
      break;
    }}
    for (let tbl of tbleArr) {tbl.resizeCanvas();}
  }
}

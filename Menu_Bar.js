class MenuBar {
  #prnt;  #wrap;  #mnbrP;  #menuBttns;
  constructor(tble, pe) {
    this.#prnt = pe;
    this.#wrap = crtElem(this.#prnt, 'div', {props: [{prop: 'className', val: 'menuWrap'}]});
    this.#mnbrP = crtElem(this.wp, 'p',{cont: String(tbleArr.length+1), props: [{prop: 'className', val: 'mnbrP'}]});
    this.#menuBttns = {};
    const elemObj =
      [{s: this.#menuBttns.full, p: this.wp, t: 'button', c: 'menuFull', f: this.sizeTble,
        a: [tble, '#0f0', '#f0f', 'absolute', (a)=>{return a;}, 'grid', 1]},
      {s: this.#menuBttns.grid, p: this.wp, t: 'button', c: 'menuGrid', f: this.sizeTble,
        a: [tble, '#00f', '#ff0', 'static', (a)=>{return a;}, 'grid', 1]},
      {s: this.#menuBttns.hide, p: this.wp, t: 'button', c: 'menuHide', f: this.sizeTble,
        a: [tble, '#ff0', '#00f', 'static', (a)=>{return !a;}, 'none', -1]},
      {s: this.#menuBttns.close, p: this.wp, t: 'button', c: 'menuClose', f: this.sizeClose, a: [tble]}];
    for (let {s, p, t, c=undefined, x=null, f=undefined, a=undefined} of elemObj) {
      s = crtElem(p, t, {cont:x, props:[{prop:'className', val:c}], evnts:[{type:'click', func:f, argLst:a}]});
    }
  }
  // Accessors
  get wp() {return this.#wrap;}
  // Button Functions
  sizeTble([tble, bgc, clr, pos, tdp, sdp, inc]) {
    tble.mb.wp.style.backgroundColor = bgc;
    tble.mb.wp.style.color = clr;
    tble.wp.style.position = pos;
    if (tdp(tble.wp.style.display === 'none')) {
      tble.wp.style.display = sdp;
      vsblTbls += inc;
    }
    for (let tbl of tbleArr) {tbl.resizeAndDrawCanvas();}
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
    for (let tbl of tbleArr) {tbl.resizeAndDrawCanvas();}
  }
}

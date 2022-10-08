class Table {
  #wp;  #tblBar;  #mnBar;  #cnvs;  #cnvs2d;
  #fllTbl;  #grdTbl;  #hdTbl;  #clsTbl;  #fllMn;  #grdMn;  #hdMn;  #clsMn;
  #plyrCnt;  #plyrArr;  #plyrTurn;  #chpCnt;

  //
  #wagerFormat;  #bettingStructure;  #royaltyStructure;
  #minBet;  #pot;  #currBet;  #minRaise;
  #cardFormat;
  // //

  #shwChps;  #plyrTxtIntrvl;
  constructor(pc = 9, cc = 10000, wf = 'bets', mnbt = 2, cf = 'poker') {
    this.#plyrCnt = pc;  this.#plyrArr = [];  this.#plyrTurn = 0;  this.#chpCnt = cc;

    //
  	this.#wagerFormat = wf;  this.#bettingStructure = null;  this.#royaltyStructure = null;
    this.#minBet = mnbt;  this.#pot = 0;  this.#currBet = 0;  this.#minRaise = this.#minBet;
    this.#cardFormat = cf;
    // //

    this.#shwChps = false;
    this.#wp = crtElem(cnvsTrgt, 'div', {props: [{prop: 'className', val: 'cnvsWrap'}]});
    this.#wp.style.position = 'static';
    this.#cnvs = crtElem(this.#wp, 'canvas', {props: [{prop: 'className', val: 'cnvs'}]});
    this.#cnvs2d = this.#cnvs.getContext('2d');
    this.#tblBar = new MenuBar(this, this.#wp);
    this.#mnBar = new MenuBar(this, cnvsMenu);
    this.#plyrTxtIntrvl = setInterval(() => {
  		this.#shwChps = !this.#shwChps;
  		this.drawPlayers(this, this.#plyrArr, 'red', 'white', this.#shwChps);
  	}, 2000);
    vsblTbls++;
    window.addEventListener('resize', () => {this.resizeCanvas();});
  	newTblBttn.addEventListener('click', () => {this.resizeCanvas();});
    requestAnimationFrame(() => {
      this.resizeCanvas();
      this.setTurn();
    });
  }
  // Common Value Shortcuts
  get mb() {return this.#mnBar;}
  get wp() {return this.#wp;}
  get cvw() {return this.#cnvs.width/2;}
  get cvh() {return this.#cnvs.height/2;}
  get bw() {return Math.min(this.#cnvs.width/2, this.#cnvs.height/2)/9;}

  // Players Turn
  clearAllTurns() {for (let pa of this.#plyrArr) {pa.notTurn();}}
  clearTurn() {this.#plyrArr[this.#plyrTurn].notTurn();}
  nextTurn() {this.#plyrTurn++;}
  jumpToTurn(trn) {this.#plyrTurn = trn;}
  setTurn() {this.#plyrArr[this.#plyrTurn].isTurn();}

  nextPlayer() {
    this.clearTurn();
    this.nextTurn();
    this.setTurn();
  }
  // // Players Turn

  // Tables Main Focal Point Function
  resizeCanvas() {
    if (this.#wp.style.display !== 'none') {
      if (this.#wp.style.position === 'static' && vsblTbls > 0) {this.fitCanvas(Math.ceil(Math.sqrt(vsblTbls)));}
      else if (this.#wp.style.position === 'absolute' && vsblTbls > 0) {this.fitCanvas(1);}
      let plyrPosArr = this.calcPlayerPos();
    	for (let i = 0; i < this.#plyrCnt; i++) {
    		if (!this.#plyrArr[i]) {this.#plyrArr[i] = new Player(this, 0, 0, this.#chpCnt);}
    		this.#plyrArr[i].x = plyrPosArr[i].x;
    		this.#plyrArr[i].y = plyrPosArr[i].y;
    	}
    	this.drawScene();
    }
  }
  // Setup Canvas Size
  fitCanvas(tempVal) {
    let tmpVl = tempVal;
    if (tempVal**2 >= vsblTbls + tempVal) {tmpVl = tempVal-1;}
    const bpl = Math.floor(window.innerWidth * 4/window.innerHeight);
    const mnwc = 95 - (Math.ceil(tbleArr.length / bpl) || 1) * 5;
    this.fitToGrid(tempVal, tmpVl, mnwc);
    if (mnwc/tmpVl*window.innerHeight*4/5 > 100/tempVal*window.innerWidth) {this.fitToGrid(tmpVl, tempVal, mnwc);}
    this.#cnvs.width = this.#cnvs.clientWidth;
  	this.#cnvs.height = this.#cnvs.clientHeight;

    this.#tblBar.wp.style.fontSize = this.#cnvs.height/20 + 'px';
  }
  fitToGrid(wd, ht, mnwc) {
    this.#wp.style.width = `calc(${100/wd}vw - ${wd-1}px)`;
    this.#wp.style.height = `calc(${mnwc/ht}vh - ${ht-1}px)`;
    cnvsTrgt.style.gridTemplateColumns = `repeat(${wd}, ${this.#wp.style.width})`;
    cnvsTrgt.style.gridTemplateRows = `repeat(${ht}, ${this.#wp.style.height})`;
  }
  // Space Players Out Evenly at Table
  calcPlayerPos() {
  	let playerPosArr = [];
  	for (let i = 0; i < this.#plyrCnt; i++) {
  		let xPos = this.cvw - Math.sin(Math.PI*2/this.#plyrCnt * i) * (this.cvw - this.bw);
  		let yPos = this.cvh + Math.cos(Math.PI*2/this.#plyrCnt * i) * (this.cvh - this.bw);
  		playerPosArr.push({x: xPos, y: yPos});
  	}
  	return this.alignPlayersPos(playerPosArr);
  }
  alignPlayersPos(pa) {
  	const avgDist = this.findTotPlyrDist(pa) / pa.length, cirSlc = Math.PI*2/pa.length;
  	let {palr, pall} = this.setTopAnchors(pa, avgDist, cirSlc);
  	this.alignAllPlayers(pa, avgDist, cirSlc, palr, pall);
  	return pa;
  }
  findTotPlyrDist(pa) {
  	let totDist = 0;
  	for (let i = 0; i < pa.length; i++) {
  		let j = i + 1;
  		if (j === pa.length) {j = 0;}
  		totDist += Math.sqrt((pa[i].x - pa[j].x)**2 + (pa[i].y - pa[j].y)**2);
  	}
  	return totDist;
  }
  setTopAnchors(pa, avgDist, cirSlc) {
  	let palr, pall;
  	if (pa.length % 2 === 0) {palr = pall = pa.length/2;}
  	else {
  		palr = Math.floor(pa.length/2), pall = Math.ceil(pa.length/2);
  		const baseMid = {x: this.cvw, y: this.bw};
  		[pa[palr].x, pa[palr].y] = this.alignPlayer(baseMid, pa[palr], avgDist/2, cirSlc*palr, -1);
  		[pa[pall].x, pa[pall].y] = this.alignPlayer(baseMid, pa[pall], avgDist/2, cirSlc*pall, 1);
  	}
  	return {palr, pall};
  }
  alignAllPlayers(pa, avgDist, cirSlc, palr, pall) {
    const strctr = [{a: 0, b: 1, c: 0, d: 1/2, e: 1}, {a: 0, b: pa.length-1, c: 3/2, d: 2, e: -1},
                    {a: palr, b: palr-1, c: 1/2, d: 1, e: -1}, {a: pall, b: pall+1, c: 1, d: 3/2, e: 1}];
    for (const {a,b,c,d,e} of strctr) {
      for (let i = a, j = b; cirSlc*j > Math.PI*c && cirSlc*j < Math.PI*d; i+=e, j+=e) {
    		if (i < 0) {i = pa.length-1;}
    		[pa[j].x, pa[j].y] = this.alignPlayer(pa[i], pa[j], avgDist, cirSlc*j, e);
    	}
    }
  }
  alignPlayer(pi, pj, avgDist, currAng, mult) {
  	let thisDist = Math.sqrt((pi.x - pj.x)**2 + (pi.y - pj.y)**2);
  	let xPos = 0, yPos = 0;
  	if (thisDist > avgDist) {while (thisDist > avgDist) {
  		currAng -= Math.PI/360*mult;
  		({thisDist, xPos, yPos} = this.linSearch(currAng, pi));
  	}}
  	else if (thisDist < avgDist) {while (thisDist < avgDist) {
  		currAng += Math.PI/360*mult;
  		({thisDist, xPos, yPos} = this.linSearch(currAng, pi));
  	}}
  	return [xPos, yPos];
  }
  linSearch(currAng, pa) {
  	let xPos = this.cvw - Math.sin(currAng) * (this.cvw - this.bw);
  	let yPos = this.cvh + Math.cos(currAng) * (this.cvh - this.bw);
  	let thisDist = Math.sqrt((pa.x - xPos)**2 + (pa.y - yPos)**2);
  	return {thisDist, xPos, yPos};
  }
  // Draw Table to Canvas
  drawScene() {
  	this.drawBackground();
  	this.drawTable();
  	this.drawPlayers();
  }
  drawBackground() {
  	this.#cnvs2d.fillStyle = 'black';
  	this.#cnvs2d.fillRect(0, 0, this.cvw*2, this.cvh*2);
  }
  drawTable() {
  	let shdw = {color: '#000f', blur: this.bw/2, x: 0, y: this.bw};
  	drawEllipse(this.#cnvs2d, this.cvw, this.cvh, this.cvw, this.cvh, 'limegreen');
  	drawEllipse(this.#cnvs2d, this.cvw, this.cvh, this.cvw - this.bw, this.cvh - this.bw,
  							'#a0522d', 'stroke', this.bw*2);
  	drawEllipse(this.#cnvs2d, this.cvw, this.cvh, this.cvw - this.bw, this.cvh - this.bw,
  							'#a0522d6f', 'stroke', this.bw*2, shdw);
  }
  drawPlayers() {
  	for (let i = 0; i < this.#plyrArr.length; i++) {
      const pai = this.#plyrArr[i];
  		drawEllipse(this.#cnvs2d, pai.x, pai.y, this.bw, this.bw, 'red');
  		drawEllipse(this.#cnvs2d, pai.x, pai.y, this.bw*11/12, this.bw*11/12, 'white', 'stroke', this.bw/6);
      if (!this.#shwChps) {drawText(this.#cnvs2d, pai.x, pai.y, 'cyan', this.bw, i, i+1);}
      else {drawText(this.#cnvs2d, pai.x, pai.y, 'cyan', this.bw*3/5, i, pai.chips);}
  	}
  }
}

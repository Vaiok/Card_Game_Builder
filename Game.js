class Game extends Render {
  #tblBar;  #mnBar;
  #plyrBttn;  #plyrTurn;  #allActed;
  #apr;  #plyrTxtIntrvl;
  #bttnObj;
  constructor(pc = 9, cc = 10000, wf = 'bets', mnbt = 2, cf = 'poker') {
    super(pc, cc, wf, mnbt, cf);
    this.#tblBar = new MenuBar(this, this.wp);
    this.#mnBar = new MenuBar(this, cnvsMenu);
    this.#plyrBttn = this.pa.length-1;
    this.#plyrTurn = 0;
    this.#allActed = false;
    this.refillPlyrsInHnd();
    this.#apr = false;
    this.#plyrTxtIntrvl = setInterval(() => {
  		this.#apr = !this.#apr;
  		this.drawPlayers(this.#apr);
  	}, 500);
    vsblTbls++;
    window.addEventListener('resize', () => {this.resizeAndDrawCanvas();});
  	newTblBttn.addEventListener('click', () => {this.resizeAndDrawCanvas();});
    requestAnimationFrame(() => {
      this.resizeAndDrawCanvas();
      this.setTurn();
    });
    this.#bttnObj = {};
    const elemObj =
      [{s: 'fold', p: this.wp, t: 'button', c: 'foldBtn', x: 'Fold',
        f: this.fold, a: [this, this.ap, this.#apr, this.#plyrBttn]},
      {s: 'check', p: this.wp, t: 'button', c: 'checkBtn', x: 'Check',
        f: this.check, a: [this, this.ap, this.#apr, this.#plyrBttn]},
      {s: 'call', p: this.wp, t: 'button', c: 'callBtn', x: 'Call',
        f: this.call, a: [this, this.ap, this.#apr, this.#plyrBttn]},
      {s: 'bet', p: this.wp, t: 'button', c: 'betBtn', x: 'Bet',
        f: this.bet, a: [this, this.ap, this.#apr, this.#plyrBttn]},
      {s: 'raise', p: this.wp, t: 'button', c: 'raiseBtn', x: 'Raise',
        f: this.bet, a: [this, this.ap, this.#apr, this.#plyrBttn]}];
    let ind = 0;
    for (let {s, p, t, c=undefined, x=null, f=undefined, a=undefined} of elemObj) {
      this.#bttnObj[s] = crtElem(p, t, {cont: x, props: [{prop: 'className', val: c}],
        evnts:[{type: 'click', func: f, argLst: a}]});
    }
  }
  // Accessors
  get mb() {return this.#mnBar;}
  // Button Actions
  check([sf, plyr, apr, bttn]) {
    sf.endTurn();
    sf.drawScene(apr, bttn);
  }
  fold([sf, plyr, apr, bttn]) {
    plyr.notInHand();
    sf.check([sf, plyr, apr, bttn]);
  }
  call([sf, plyr, apr, bttn]) {
    plyr.chips -= sf.currBet - plyr.callSize;
    plyr.subPot += sf.currBet - plyr.callSize;
    plyr.callSize = sf.currBet;
    sf.check([sf, plyr, apr, bttn]);
  }
  bet([sf, plyr, apr, bttn]) {
    sf.currBet += plyr.betSize;
    sf.call([sf, plyr, apr, bttn]);
  }
  // Move Players Turn and Button
  endTurn() {
    let allPaid = true;
    for (let plyr of this.pa) {if (plyr.inHand && plyr.callSize !== this.currBet) {allPaid = false;}}
    if (!this.#allActed || !allPaid) {this.nextPlayer();}
    else {this.nextRound();}
    this.runAI();
  }
  nextPlayer() {
    this.clearTurn();
    this.nextTurn();
    this.setTurn();
  }
  nextRound() {
    this.#allActed = false;
    this.clearTurn();
    this.jumpToTurn(this.findFirstAct());
    this.setTurn();
    this.rakeSubPots(this.pa);
  }
  findFirstAct() {
    let firstAct = this.#plyrBttn + 1;
    if (firstAct >= this.pa.length) {firstAct = 0;}
    while (!this.pa[firstAct].inHand) {
      firstAct++;
      if (firstAct >= this.pa.length) {firstAct = 0;}
    }
    return firstAct;
  }
  nextHand() {
    this.#allActed = false;
    this.refillPlyrsInHnd();
    this.nextBttn();
    this.nextRound();
  }
  refillPlyrsInHnd() {for (let plyr of this.pa) {plyr.isInHand();}}
  nextBttn() {
    this.#plyrBttn++;
    if (this.#plyrBttn >= this.pa.length) {this.#plyrBttn = 0;}
    this.drawScene(this.#apr, this.#plyrBttn);
  }
  jumpToBttn(bttn) {
    if (bttn >= 0 && bttn < this.pa.length) {
      this.#plyrBttn = bttn;
      this.drawScene(this.#apr, this.#plyrBttn);
    }
  }
  clearAllTurns() {for (let plyr of this.pa) {plyr.notTurn();}}
  clearTurn() {this.pa[this.#plyrTurn].notTurn();}
  nextTurn() {
    do {
      this.#plyrTurn++;
      if (this.#plyrTurn >= this.pa.length) {this.#plyrTurn = 0;}
      if (this.#plyrTurn === this.#plyrBttn) {this.#allActed = true;}
    } while (!this.pa[this.#plyrTurn].inHand);
    if (this.#allActed === true) {
      let allPaid = true;
      for (let plyr of this.pa) {if (plyr.inHand && plyr.callSize !== this.currBet) {allPaid = false;}}
      if (allPaid) {this.nextRound();}
    }
  }
  jumpToTurn(trn) {this.#plyrTurn = trn;}
  setTurn() {this.pa[this.#plyrTurn].isTurn();}

  // Player AI
  runAI() {
    const actStr1 = ['check', 'bet'];
    const actStr2 = ['fold', 'call', 'raise'];
    const actStr3 = ['fold', 'call', 'bet'];
    if (this.pa[this.#plyrTurn] !== this.ap) {
      for (let actn of actStr1.concat(actStr2)) {this.#bttnObj[actn].style.display = 'none';}
      setTimeout(() => {
        const prmtrs = [this, this.pa[this.#plyrTurn], this.#apr, this.#plyrBttn];
        if (this.currBet > 0) {this[actStr3[Math.floor(Math.random()*3)]](prmtrs);}
        else {this[actStr1[Math.floor(Math.random()*2)]](prmtrs);}
      }, 1000);
    }
    else {
      if (this.currBet > 0) {
        for (let actn of actStr1) {this.#bttnObj[actn].style.display = 'none';}
        for (let actn of actStr2) {this.#bttnObj[actn].style.display = 'initial';}
      } else {
        for (let actn of actStr2) {this.#bttnObj[actn].style.display = 'none';}
        for (let actn of actStr1) {this.#bttnObj[actn].style.display = 'initial';}
      }
    }
  }

  // Resize and Redraw
  resizeAndDrawCanvas() {
    this.resizeCanvas(this.#tblBar);
    this.drawScene(this.#apr, this.#plyrBttn);
  }
}

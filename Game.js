class Game extends Render {
  #tblBar;  #mnBar;
  #plyrBttn;  #plyrTurn;  #allActed;
  #apr;  #plyrTxtIntrvl;
  #bttnObj;
  constructor(pc = 9, cc = 10000, wf = 'bets', mnbt = 2, cf = 'poker') {
    super(pc, cc, wf, mnbt, cf);
    this.#tblBar = new MenuBar(this, this.wp);
    this.#mnBar = new MenuBar(this, cnvsMenu);
    this.#plyrBttn = 0;
    this.#plyrTurn = this.#plyrBttn + 1;
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
      [{s: 'fold', p: this.wp, t: 'button', c: 'foldBtn', x: 'Fold', f: this.fold, a: [this, this.ap]},
      {s: 'check', p: this.wp, t: 'button', c: 'checkBtn', x: 'Check', f: this.check, a: [this, this.ap]},
      {s: 'call', p: this.wp, t: 'button', c: 'callBtn', x: 'Call', f: this.call, a: [this, this.ap]},
      {s: 'bet', p: this.wp, t: 'button', c: 'betBtn', x: 'Bet', f: this.bet, a: [this, this.ap]},
      {s: 'raise', p: this.wp, t: 'button', c: 'raiseBtn', x: 'Raise', f: this.bet, a: [this, this.ap]}];
    let ind = 0;
    for (let {s, p, t, c=undefined, x=null, f=undefined, a=undefined} of elemObj) {
      this.#bttnObj[s] = crtElem(p, t, {cont: x, props: [{prop: 'className', val: c}],
        evnts:[{type: 'click', func: f, argLst: a}]});
    }
    this.#bttnObj.fold.style.display = 'none';
    this.#bttnObj.call.style.display = 'none';
    this.#bttnObj.raise.style.display = 'none';
  }
  // Accessors
  get mb() {return this.#mnBar;}

  // Button Actions
  check([sf, plyr]) {sf.endTurn();}
  fold([sf, plyr]) {
    plyr.notInHand();
    sf.check([sf, plyr]);
  }
  call([sf, plyr]) {
    plyr.chips -= sf.currBet - plyr.callSize;
    plyr.subPot += sf.currBet - plyr.callSize;
    plyr.callSize = sf.currBet;
    sf.check([sf, plyr]);
  }
  bet([sf, plyr]) {
    sf.currBet += plyr.betSize;
    sf.call([sf, plyr]);
  }

  // Handling End of Turns, Rounds, and Hands
  endTurn() {
    let plyrsLeft = [], allPaid = true;
    for (let plyr of this.pa) {
      if (plyr.inHand) {
        plyrsLeft.push(plyr);
        if (plyr.callSize !== this.currBet) {allPaid = false;}
      }
    }
    if (plyrsLeft.length === 1) {this.nextHand(plyrsLeft[0]);}
    else if (!this.#allActed || !allPaid) {this.nextPlayer();}
    else {this.nextRound();}
    this.drawScene(this.#apr, this.#plyrBttn);
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
  nextHand(winner) {
    this.refillPlyrsInHnd();
    this.nextBttn();
    this.nextRound();
    this.payPot(winner);
  }
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

  // Players in Hand Helper Function
  refillPlyrsInHnd() {for (let plyr of this.pa) {plyr.isInHand();}}
  // Button Moving Helper Functions
  nextBttn() {
    this.#plyrBttn++;
    if (this.#plyrBttn >= this.pa.length) {this.#plyrBttn = 0;}
  }
  jumpToBttn(bttn) {if (bttn >= 0 && bttn < this.pa.length) {this.#plyrBttn = bttn;}}
  // Turn Moving Helper Functions
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
  jumpToTurn(trn) {
    if (trn >= 0 && trn < this.pa.length) {
      this.#plyrTurn = trn;
      while (!this.pa[this.#plyrTurn].inHand) {
        this.#plyrTurn++;
        if (this.#plyrTurn >= this.pa.length) {this.#plyrTurn = 0;}
      }
    }
  }
  setTurn() {this.pa[this.#plyrTurn].isTurn();}

  // Resize and Redraw
  resizeAndDrawCanvas() {
    this.resizeCanvas(this.#tblBar);
    this.drawScene(this.#apr, this.#plyrBttn);
  }
}

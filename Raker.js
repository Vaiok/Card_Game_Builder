class Raker {
  #tble;
  #wagerFormat;  #bettingStructure;  #royaltyStructure;
  #minBet;  #pot;  #currBet;  #minRaise;

  constructor(tbl, wf, mnbt) {
    this.#tble = tbl;
    this.#wagerFormat = wf;  this.#bettingStructure = null;  this.#royaltyStructure = null;
    this.#minBet = mnbt;  this.#pot = 0;  this.#currBet = 0;  this.#minRaise = this.#minBet;
  }

  get pot() {return this.#pot;}
  set pot(newPot) {this.#pot = newPot;}

  rakeSubPots(plyrArr) {
    for (let playr of plyrArr) {
      this.#pot += playr.subPot;
      playr.subPot = 0;
    }
  }
  drawPot(cv2d) {drawText(cv2d, this.#tble.cvw, this.#tble.cvh, 'magenta', this.#tble.bw*2/3, this.#pot);}
}

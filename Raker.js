class Raker {
  #wagerFormat;  #bettingStructure;  #royaltyStructure;
  #minBet;  #pot;  #currBet;  #minRaise;
  #plyrArr;

  constructor(plArr, wf, mnbt) {
    this.#plyrArr = plArr;
    this.#wagerFormat = wf;  this.#bettingStructure = null;  this.#royaltyStructure = null;
    this.#minBet = mnbt;  this.#pot = 0;  this.#currBet = 0;  this.#minRaise = this.#minBet;
  }

  get pot() {return this.#pot;}
  set pot(newPot) {this.#pot = newPot;}

  rakeSubPots() {
    for (let playr of this.#plyrArr) {
      this.#pot += playr.subPot;
      playr.subPot = 0;
    }
  }
}

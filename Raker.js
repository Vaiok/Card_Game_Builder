class Raker extends Table {
  #wagerFormat;  #bettingStructure;  #royaltyStructure;
  #minBet;  #pot;  #currBet;  #minRaise;
  constructor(pc, cc, wf, mnbt) {
    super(pc, cc);
    this.#wagerFormat = wf, this.#bettingStructure = null, this.#royaltyStructure = null;
    this.#minBet = mnbt, this.#pot = 0, this.#currBet = 0, this.#minRaise = this.#minBet;
  }
  // Accessors
  get pot() {return this.#pot;}
  set pot(newPot) {this.#pot = newPot;}
  get currBet() {return this.#currBet;}
  set currBet(newBet) {this.#currBet = newBet;}
  // Functions
  rakeSubPots() {
    for (let plyr of this.pa) {
      this.#pot += plyr.subPot;
      plyr.subPot = 0;
      plyr.callSize = 0;
    }
    this.#currBet = 0;
  }
}

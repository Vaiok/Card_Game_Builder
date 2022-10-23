class Dealer extends Raker {
  #cardFormat;
  constructor(pc, cc, wf, mnbt, cf) {
    super(pc, cc, wf, mnbt);
    this.#cardFormat = cf;
  }
}

class Player {
  #tble;
  #xPos;
  #yPos;
  #chipCnt;
  #myTurn;
  constructor(tbl, xp, yp, cc) {
    this.#tble = tbl;
    this.#xPos = xp;
    this.#yPos = yp;
    this.#chipCnt = cc;
    this.#myTurn = false;
  }

  get x() {return this.#xPos;}
  set x(newX) {this.#xPos = newX;}
  get y() {return this.#yPos;}
  set y(newY) {this.#yPos = newY;}
  get chips() {return this.#chipCnt;}
  set chips(newChips) {this.#chipCnt = newChips;}

  //
  get myTurn() {return this.#myTurn;}
  notTurn() {this.#myTurn = false;}
  isTurn() {this.#myTurn = true;}

  raise() {}
  bet() {}
  call() {}
  check() {}
  fold() {}
  // //
}

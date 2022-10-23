class Seat {
  #tble;  #posObj;
  #inHand;  #myTurn;
  #chipCnt;  #callSize;  #betSize;  #subPot;
  constructor(tbl, xp = 0, yp = 0, ap = 0, cc = 10000) {
    this.#tble = tbl;
    this.#posObj = {x: xp, y: yp, ang: ap};
    this.#inHand = true, this.#myTurn = false;
    this.#chipCnt = cc, this.#callSize = 0, this.#betSize = 10, this.#subPot = 0;
  }
  // Accessors
  get x() {return this.#posObj.x;}
  set x(newX) {this.#posObj.x = newX;}
  get y() {return this.#posObj.y;}
  set y(newY) {this.#posObj.y = newY;}
  get ang() {return this.#posObj.ang;}
  set ang(newAng) {this.#posObj.ang = newAng;}
  get chips() {return this.#chipCnt;}
  set chips(newChips) {this.#chipCnt = newChips;}
  get subPot() {return this.#subPot;}
  set subPot(newSub) {this.#subPot = newSub;}
  get callSize() {return this.#callSize;}
  set callSize(newCall) {this.#callSize = newCall;}
  get betSize() {return this.#betSize;}
  get myTurn() {return this.#myTurn;}
  notTurn() {this.#myTurn = false;}
  isTurn() {this.#myTurn = true;}
  get inHand() {return this.#inHand;}
  notInHand() {this.#inHand = false;}
  isInHand() {this.#inHand = true;}
}

class Seat {
  #tble;  #xPos;  #yPos;  #angPos;
  #inHand;  #myTurn;
  #chipCnt;  #callSize;  #betSize;  #subPot;

  constructor(tbl, xp = 0, yp = 0, ap = 0, cc = 10000) {
    this.#tble = tbl;
    this.#xPos = xp;
    this.#yPos = yp;
    this.#angPos = ap;
    this.#inHand = true;
    this.#myTurn = false;
    this.#chipCnt = cc;
    this.#callSize = 0;
    this.#betSize = 0;
    this.#subPot = 0;
  }

  get x() {return this.#xPos;}
  set x(newX) {this.#xPos = newX;}
  get y() {return this.#yPos;}
  set y(newY) {this.#yPos = newY;}
  get ang() {return this.#angPos;}
  set ang(newAng) {this.#angPos = newAng;}
  get chips() {return this.#chipCnt;}
  set chips(newChips) {this.#chipCnt = newChips;}
  get subPot() {return this.#subPot;}
  set subPot(newSub) {this.#subPot = newSub;}


  // Work On
  get myTurn() {return this.#myTurn;}
  notTurn() {this.#myTurn = false;}
  isTurn() {this.#myTurn = true;}

  get inHand() {return this.#inHand;}
  notInHand() {this.#inHand = false;}
  isInHand() {this.#inHand = true;}

  fold() {
    this.notInHand();
    this.#tble.nextPlayer();
  }
  check() {this.#tble.nextPlayer();}
  call() {
    this.#chipCnt -= this.#callSize;
    this.#subPot += this.#callSize;
    this.#tble.nextPlayer();
  }
  bet() {
    this.#chipCnt -= this.#betSize;
    this.#subPot += this.#betSize;
    this.#tble.nextPlayer();
  }
  raise() {
    this.#chipCnt -= this.#callSize + this.#betSize;
    this.#subPot += this.#callSize + this.#betSize;
    this.#tble.nextPlayer();
  }
  // // Work On
}

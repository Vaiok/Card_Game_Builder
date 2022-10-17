class Seat {
  #tble;  #xPos;  #yPos;  #angPos;
  #mySeat;  #inHand;  #myTurn;
  #chipCnt;  #callSize;  #betSize;  #subPot;

  constructor(tbl, xp = 0, yp = 0, ap = 0, cc = 10000) {
    this.#tble = tbl;
    this.#xPos = xp;
    this.#yPos = yp;
    this.#angPos = ap;
    this.#mySeat = true;
    this.#inHand = true;
    this.#myTurn = false;
    this.#chipCnt = cc;
    this.#callSize = 10;
    this.#betSize = 10;
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
    this.#tble.drawScene();
  }
  bet() {
    this.#chipCnt -= this.#betSize;
    this.#subPot += this.#betSize;
    this.#tble.nextPlayer();
    this.#tble.drawScene();
  }
  raise() {
    this.#chipCnt -= this.#callSize + this.#betSize;
    this.#subPot += this.#callSize + this.#betSize;
    this.#tble.nextPlayer();
    this.#tble.drawScene();
  }
  // // Work On

  drawPlayer(cv2d, plyrRed) {
    if (plyrRed && this.#myTurn) {
      drawEllipse(cv2d, this.x, this.y, this.#tble.bw, this.#tble.bw, 'red');
      drawText(cv2d, this.x, this.y, 'cyan', this.#tble.bw*2/3, this.chips);
    }
    else {
      drawEllipse(cv2d, this.x, this.y, this.#tble.bw, this.#tble.bw, 'blue');
      drawText(cv2d, this.x, this.y, 'yellow', this.#tble.bw*2/3, this.chips);
    }
    drawEllipse(cv2d, this.x, this.y, this.#tble.bw*11/12, this.#tble.bw*11/12, 'white', 'stroke', this.#tble.bw/6);
    const xPos = this.#tble.cvw - Math.sin(this.ang) * (this.#tble.cvw/2);
    const yPos = this.#tble.cvh + Math.cos(this.ang) * (this.#tble.cvh/2);
    drawText(cv2d, xPos, yPos, 'magenta', this.#tble.bw*2/3, this.subPot);
  }

}

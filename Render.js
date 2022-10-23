class Render extends Dealer {
  #cnvs2d;
  constructor(pc, cc, wf, mnbt, cf) {
    super(pc, cc, wf, mnbt, cf);
    this.#cnvs2d = this.cnvs.getContext('2d');
  }
  // Drawing Functions
  drawScene(apr, bttn) {
  	this.drawBackground();
  	this.drawTable();
  	this.drawPlayers(apr);
    this.drawButton(bttn);
  }
  drawBackground() {
  	this.#cnvs2d.fillStyle = 'black';
  	this.#cnvs2d.fillRect(0, 0, this.cvw*2, this.cvh*2);
  }
  drawTable() {
  	let shdw = {color: '#000f', blur: this.bw/2, x: 0, y: this.bw};
  	drawEllipse(this.#cnvs2d, this.cvw, this.cvh, this.cvw, this.cvh, 'limegreen');
    drawText(this.#cnvs2d, this.cvw, this.cvh, 'magenta', this.bw*2/3, this.pot);
  	drawEllipse(this.#cnvs2d, this.cvw, this.cvh, this.cvw - this.bw, this.cvh - this.bw,
  							'#a0522d', 'stroke', this.bw*2);
  	drawEllipse(this.#cnvs2d, this.cvw, this.cvh, this.cvw - this.bw, this.cvh - this.bw,
  							'#a0522d6f', 'stroke', this.bw*2, shdw);
  }
  drawPlayers(apr) {for (let plyr of this.pa) {
    if (apr && plyr.myTurn) {
      drawEllipse(this.#cnvs2d, plyr.x, plyr.y, this.bw, this.bw, 'red');
      drawText(this.#cnvs2d, plyr.x, plyr.y, 'cyan', this.bw*2/3, plyr.chips);
    }
    else {
      drawEllipse(this.#cnvs2d, plyr.x, plyr.y, this.bw, this.bw, 'blue');
      drawText(this.#cnvs2d, plyr.x, plyr.y, 'yellow', this.bw*2/3, plyr.chips);
    }
    drawEllipse(this.#cnvs2d, plyr.x, plyr.y, this.bw*11/12, this.bw*11/12, 'white', 'stroke', this.bw/6);
    const xPos = this.cvw - Math.sin(plyr.ang) * (this.cvw/2);
    const yPos = this.cvh + Math.cos(plyr.ang) * (this.cvh/2);
    drawText(this.#cnvs2d, xPos, yPos, 'magenta', this.bw*2/3, plyr.subPot);
  }}
  drawButton(bttn) {
    const xPos = this.cvw - Math.sin(this.pa[bttn].ang) * (this.cvw*2/3);
  	const yPos = this.cvh + Math.cos(this.pa[bttn].ang) * (this.cvh*2/3);
    drawEllipse(this.#cnvs2d, xPos, yPos, this.bw*2/3, this.bw*2/3, 'white');
    drawText(this.#cnvs2d, xPos, yPos, 'black', this.bw, 'B');
  }
}

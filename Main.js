'use strict';
const tbleArr = [];
let vsblTbls = 0;
const cnvsMenu = document.querySelector('#cnvsMenu');
const cnvsTrgt = document.querySelector('#cnvsTrgt');
const newTblBttn = document.querySelector('#mkTblBttn');
newTblBttn.addEventListener('click', () => {tbleArr.push(new Table());});

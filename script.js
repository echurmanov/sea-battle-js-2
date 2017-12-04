'use strict';

const EMPTY = 0;
const MISS = 1;
const SHIP = 2;
const SHIP_DAMAGED = 3;
const SHIP_DEAD = 4;



function Game(field1, field2){
  const shipConfig = [
    4, 3, 3, 2, 2, 2, 1, 1, 1, 1
  ];
  const data1 = [
  ];
  const data2 = [];
  const alph='ABCDEFGHIJKLMNO';

  this.size=10;


  for (let i = 0; i < this.size; i++) {
    data1.push([]);
    data2.push([]);
    for (let j = 0; j < this.size; j++) {
      data1[i].push(EMPTY);
      data2[i].push(EMPTY);
    }
  }


  this.getNearCell = function(fieldData, x, y) {
    const res = [];
    for(let dx=-1;dx<=1;dx++){
      for(let dy=-1;dy<=1;dy++){
        if(x+dx>=0 && y+dy>=0 && x+dx<this.size && y+dy<this.size
          && !(dx == 0 && dy == 0)
        ) {
          res.push(fieldData[x+dx][y+dy]);
        }
      }
    }


    return res;
  };


  this.renderField = function(field, data) {
    const table=document.createElement('table');
    field.appendChild(table);

    const headtr=document.createElement('tr');

    table.appendChild(headtr);

    for(let a=0;a<=this.size;a++){
      const td = document.createElement('td');
      headtr.appendChild(td);

      td.appendChild(document.createTextNode(a));
    }

    for(let a=0;a<this.size;a++){
      const tr=document.createElement('tr');
      table.appendChild(tr);
      for(let b=0;b<=this.size;b++){
        const td=document.createElement('td');
        tr.appendChild(td);
        if(b==0){
          td.appendChild(document.createTextNode(alph[a]));
        } else {
          td.appendChild(document.createTextNode(data[a][b-1]));
        }
      }
    }
  };


  this.render = function() {
    this.renderField(field1, data1);

    this.renderField(field2, data2);
  };


  this.checkPlaceShip = function (data, cells) {
    let canPlace = true;
    for (let i = 0; i < cells.length; i++) {
      canPlace = canPlace && this.getNearCell(data, cells[i].x, cells[i].y).indexOf(2) === -1;
    }

    return canPlace;
  };


  this.placeRandomShip = function(data, size) {
    let canPlace = true;
    let dir, x, y;

    do {
      canPlace = true;
      dir = (Math.random() > 0.5) ? 'H' : 'V';

      x = Math.floor(Math.random() * this.size);
      y = Math.floor(Math.random() * this.size);

      if (dir === 'H') {
        if (x > this.size - size) {
          canPlace = false;
        }
      } else {
        if (y > this.size - size) {
          canPlace = false;
        }
      }

      if (canPlace) {
        const cells = [];
        for (let s = 0; s < size; s++) {
          let dx = x, dy = y;
          if(dir==='H'){
            dx+=s;
          }else{
            dy+=s;
          }

          cells.push({x: dx, y: dy});
        }
        canPlace = this.checkPlaceShip(data, cells);
      }
    } while(!canPlace);

    for (let s = 0; s < size; s++) {
      let dx = x, dy = y;
      if(dir==='H'){
        dx+=s;
      }else{
        dy+=s;
      }

      data[dx][dy] = SHIP;
    }

  };

  for (let i = 0; i < shipConfig.length; i++) {
    this.placeRandomShip(data1, shipConfig[i]);
    this.placeRandomShip(data2, shipConfig[i]);
  }

}



function init() {
  console.log("Start");

  const game = new Game(
    document.getElementById('field-1'),
    document.getElementById('field-2')
  );



  game.render();

}
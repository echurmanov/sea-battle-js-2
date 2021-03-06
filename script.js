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

  this.playerTurn = true;

  this.status = 'play';
  this.winner = '';

  for (let i = 0; i < this.size; i++) {
    data1.push([]);
    data2.push([]);
    for (let j = 0; j < this.size; j++) {
      data1[i].push(EMPTY);
      data2[i].push(EMPTY);
    }
  }

  const self = this;

  field2.addEventListener('click', (e) => {
    if (e.target.tagName === 'TD' && e.target.attributes.getNamedItem("x")) {
      const x = 1 * e.target.attributes.getNamedItem("x").nodeValue;
      const y = 1 * e.target.attributes.getNamedItem("y").nodeValue;

      if (self.playerTurn) {
        const targetCoord = e.target.getBoundingClientRect();
        launchRocker(targetCoord.left, targetCoord.top, () => {
          this.shoot(data2, x, y);
          this.render();
          this.cpuTurn();
        });

      }
    }
  });

  this.shoot = function(fieldData, x, y) {
    if (fieldData[x][y] !== EMPTY && fieldData[x][y] !== SHIP) {
      return false;
    }

    if (fieldData[x][y] === EMPTY) {
      fieldData[x][y] = MISS;
      this.changePlayer();

    }

    if (fieldData[x][y] === SHIP) {
      fieldData[x][y] = SHIP_DAMAGED;
      const shipCells = [{x: x, y:y}];
      const searchDirs = [0, 1, 2, 3];

      let s = 1;
      while (searchDirs.length) {
        searchDirs.slice().forEach(function(dir) {
          let dx = x, dy = y;
          switch (dir) {
            case 0:
              dy = y - s;
              break;
            case 1:
              dx = x + s;
              break;
            case 2:
              dy = y + s;
              break;
            case 3:
              dx = x - s;
              break;
          }

          if (dx >= 0 && dx < self.size && dy >= 0 && dy < self.size
            && fieldData[dx][dy] !== MISS && fieldData[dx][dy] !== EMPTY
          ) {
            shipCells.push({x: dx, y: dy});
          } else {
            searchDirs.splice(searchDirs.indexOf(dir), 1);
          }
        });
        s++;
      }

      const isDead = shipCells.reduce(function(prev, shipCell){
        if (fieldData[shipCell.x][shipCell.y] !== SHIP_DAMAGED) {
          return false;
        }
        return prev;
      }, true);

      if (isDead) {
        shipCells.forEach(function(shipCell){
          fieldData[shipCell.x][shipCell.y] = SHIP_DEAD;
          self.getNearCell(fieldData, shipCell.x, shipCell.y).forEach(function(nc){
            if (fieldData[nc.x][nc.y] === EMPTY) {
              fieldData[nc.x][nc.y] = MISS;
            }
          });
        });
      }

      let allShipIsDead = true;

      for(let a=0;a<this.size && allShipIsDead;a++) {
        for (let b = 0; b <= this.size && allShipIsDead; b++) {
          if (fieldData[a][b] === SHIP) {
            allShipIsDead = false;
          }
        }
      }

      if (allShipIsDead) {
        this.status = 'end';
        if (fieldData === data1) {
          this.winner = 'CPU Win!';
        } else {
          this.winner = 'Player Win!';
        }

        alert(this.winner);
      }

    }
    return true;
  };

  this.changePlayer = function() {
    this.playerTurn = !this.playerTurn;
  };


  this.getNearCell = function(fieldData, x, y) {
    const res = [];
    for(let dx=-1;dx<=1;dx++){
      for(let dy=-1;dy<=1;dy++){
        if(x+dx>=0 && y+dy>=0 && x+dx<this.size && y+dy<this.size
          && !(dx == 0 && dy == 0)
        ) {
          res.push({x: x+dx, y: y+dy});
        }
      }
    }


    return res;
  };


  this.renderField = function(field, data, playerField) {

    const oldTable = field.querySelector('table');

    if (oldTable) {
      oldTable.remove();
    }

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
          const attrX = document.createAttribute('x');
          attrX.nodeValue = a;
          const attrY = document.createAttribute('y');
          attrY.nodeValue = b - 1;
          td.attributes.setNamedItem(attrX);
          td.attributes.setNamedItem(attrY);
          switch (data[a][b-1]) {
            case MISS:
              td.classList.add("miss");
              break;
            case SHIP_DAMAGED:
              td.classList.add("damaged");
              break;
            case SHIP_DEAD:
              td.classList.add("dead");
              break;
            case SHIP:
              if (playerField) {
                td.classList.add("friend");
              }
              break;
          }
        }
      }
    }
  };

  this.cpuTurn = function() {
    if (this.playerTurn || this.status === 'end') {
      return;
    }
    let i = 1000, x, y;

    do {
      x = Math.floor(Math.random() * this.size);
      y = Math.floor(Math.random() * this.size);
      i--;

    } while (!this.shoot(data1, x, y) && i > 0);

    const targetTd = field1.querySelector("[x=\""+x+"\"][y=\""+y+"\"]");

    const targetCoord = targetTd.getBoundingClientRect();

    launchRocker(targetCoord.left, targetCoord.top, function() {
      self.render();

      if (!self.playerTurn) {
        setTimeout(function(){
          self.cpuTurn();
        }, 1000);
      }
    });
  };


  this.render = function() {
    this.renderField(field1, data1, true);

    this.renderField(field2, data2);
  };


  this.checkPlaceShip = function (data, cells) {
    let canPlace = true;
    for (let i = 0; i < cells.length; i++) {
      const celLValues = this.getNearCell(data, cells[i].x, cells[i].y).map(function(el){
        return data[el.x][el.y];

      });
      canPlace = canPlace && celLValues.indexOf(2) === -1;
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


const coords = {left: 0, top: 0};

function launchRocker(x, y, callback) {
  const cannon = (document.getElementById("cannon")).getBoundingClientRect();
  const rocket = document.querySelector(".ball");

  rocket.style.display = 'block';

  coords.top = cannon.top;
  coords.left = cannon.left;

  const object = {d: 0};

  createjs.Tween.get(object)
    .to({ d: 1 }, 500)
    .call(afterRocket)
    .call(callback)
    .addEventListener('change', function (e) {
      coords.top = cannon.top + (y - cannon.top) * object.d - 100 * Math.sin(object.d * Math.PI);
      coords.left = cannon.left + (x - cannon.left) * object.d;

    });
}

function afterRocket() {
  const rocket = document.querySelector(".ball");
  rocket.style.display = 'none';
}


function test(a, b, c) {
  console.log(this, a, b, c, arguments);
}


function init() {
  console.log("Start");

  const game = new Game(
    document.getElementById('field-1'),
    document.getElementById('field-2')
  );

  const t1 = test.bind(this);

  t1("3", "4");

  game.render();

  document.addEventListener('click', function(e) {
    console.log(e);

  });

  const rocket = document.querySelector(".ball");

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", function(t) {
    //console.log("tick", t, coords);
    rocket.style.left = coords.left;
    rocket.style.top = coords.top;
  });

}

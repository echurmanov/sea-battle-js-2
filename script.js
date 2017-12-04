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
}



function init() {
  console.log("Start");

  const game = new Game(
    document.getElementById('field-1'),
    document.getElementById('field-2')
  );

  game.render();

}

let boardArray = [];
let smallBoard = document.getElementById('biginner');
let mediumBoard = document.getElementById('intermediate');
let largeBoard = document.getElementById('expert');
let boardDiv = document.getElementById('small-container');
let selectLevelDiv = document.getElementById('select-level');
let numberMap = new Map();
let openDivMap = new Map();
let bombFound = 0;
let wrongBomb = 0;
let numbersArrayFalseBomb = [];
let minesIndexArray = [];
let displayMines = document.getElementById('left-mines');
let changeFace = document.getElementById('image-of-faces');
let tempArray = [];
let intervalId;
let countingTimer = document.getElementById('timer');

function generateBoard(row, column){
  board(row, column);
  let smallBoard = document.getElementById('biginner');
  let mediumBoard = document.getElementById('intermediate');
  let largeBoard = document.getElementById('expert');
  let boardDiv = document.getElementById('small-container');
  let selectLevelDiv = document.getElementById('select-level');
  let bombsFaceTime = document.getElementById('timer-mines-face');
  let middleButton = document.getElementById('faces');

  if(smallBoard.checked){
    boardArray = [];
    boardDiv.innerHTML = '';
    bombsFaceTime.classList.remove('timer-mines-face-medium', 'timer-mines-face-large');
    bombsFaceTime.classList.add('timer-mines-face-small');
    middleButton.classList.remove('smily-face-medium', 'smily-face-large');
    middleButton.classList.add('smily-face');
    boardDiv.classList.remove('medium-container', 'large-container');
    boardDiv.classList.add('small-container' );
    selectLevelDiv.classList.remove('select-level-medium', 'select-level-large');
    selectLevelDiv.classList.add('select-level');
    board(row, column);
    displayMines.innerHTML = '010';
    generateMines(10);
  }
  if(mediumBoard.checked){
    boardArray = [];
    boardDiv.innerHTML = '';
    bombsFaceTime.classList.remove('timer-mines-face-small', 'timer-mines-face-large');
    bombsFaceTime.classList.add('timer-mines-face-medium');
    middleButton.classList.remove('smily-face', 'smily-face-large');
    middleButton.classList.add('smily-face-medium');
    boardDiv.classList.remove('small-container', 'large-container' );
    selectLevelDiv.classList.remove('select-level', 'select-level-large');
    boardDiv.classList.add('medium-container' );
    selectLevelDiv.classList.add('select-level-medium');
    board(row, column);
    displayMines.innerHTML = '040';
    generateMines(40);
  }
  if(largeBoard.checked){
    boardArray = [];
    boardDiv.innerHTML = '';
    bombsFaceTime.classList.remove('timer-mines-face-small', 'timer-mines-face-medium');
    bombsFaceTime.classList.add('timer-mines-face-large');
    boardDiv.classList.remove('medium-container', 'small-container');
    boardDiv.classList.add('large-container');
    middleButton.classList.remove('smily-face-medium', 'smily-face');
    middleButton.classList.add('smily-face-large');
    selectLevelDiv.classList.remove('select-level-medium', 'select-level');
    selectLevelDiv.classList.add('select-level-large');
    board(row, column);
    displayMines.innerHTML = '099';
    generateMines(99);
  }
  
  
}


function board(row, column){
  
  for(let i = 0; i< row; i++){
    for(let j = 0 ;j < column; j++){
      let newDiv = document.createElement('div');
      document.getElementById('small-container').appendChild(newDiv);
      newDiv.setAttribute("id", i+'_'+j);
      boardArray.push(newDiv.id);

      newDiv.onmousedown = onMouseDown;
      newDiv.onmouseup = onMouseUp;
      newDiv.oncontextmenu = onContextMenu;  
      //console.log(boardArray);   
      }
    
  }
}

function pad(num, size){
  if(num < 0){
    let num1 = Math.abs(num);
    
    
    if(num1 > 9){
      let num1 = Math.abs(num);
      let s = "-" + num1;
      return s.substring(s.length-size);
    }
    let s = "-0" + num1;
    return s.substring(s.length-size); 
  }
  else{
    let s = "00" + num;
    return s.substring(s.length-size); 
  }
  
  
}


let leftClick = false;
let rightClick = false;

function onMouseDown(e){
  if (e.button === 0 ) {
    leftClick =  true;
  }
  if (e.button === 2){
    rightClick = true;
  }
  if(leftClick && rightClick)
    {
      dbMouseClicks(e);
    }
}
function onMouseUp(e){
  if(leftClick && !rightClick)
  {
    divLeftClick(e);
  }
  if(!leftClick && rightClick)
    {
     divRightClick(e);
    }
    if(leftClick && rightClick)
      {
        dbMouseUp();
      }

  leftClick = false;
  rightClick= false;
}
 
function onContextMenu(e){
  e.preventDefault();
}

function divLeftClick(e){
  startTheTimer();
  let newDiv = e.currentTarget;
        
  if(newDiv.classList.contains('bomb')){
    if(newDiv.hasChildNodes()){
      newDiv.removeChild(newDiv.firstChild);
      newDiv.classList.remove('bomb');
      let newItem = document.createElement('img'); 
      newItem.src = "/images/red-bomb.png";
      document.getElementById(newDiv.id).appendChild(newItem);
      changeFace.src = '/images/sadface.jpg';
      stopTheTimer();
      revealBombs();
    }else{
      newDiv.classList.remove('bomb');
      let newItem = document.createElement('img'); 
      newItem.src = "/images/red-bomb.png";
      document.getElementById(newDiv.id).appendChild(newItem);
      changeFace.src = '/images/sadface.jpg';
      stopTheTimer();
      revealBombs();
    }
    
   
  }
  if(newDiv.classList.contains('numb')){
    setDivStateOpen(newDiv.id);
    newDiv.classList.remove('numb');
    if(newDiv.childNodes[0].innerText ==='1' ){
      newDiv.classList.add('one');
    }
    if(newDiv.childNodes[0].innerText ==='2'){
      newDiv.classList.add('two');
    }
    if(newDiv.childNodes[0].innerText ==='3'){
      newDiv.classList.add('three');
    }
    if(newDiv.childNodes[0].innerText ==='4'){
      newDiv.classList.add('four');
    }
    
  }
  if(newDiv.classList.contains('empty')){
    newDiv.classList.remove('empty');
    newDiv.classList.add('open-empty');
    open(newDiv);
  }
}

function divRightClick(e){
  startTheTimer();
  e.preventDefault();

  
  let currentElement = e.currentTarget;
  let result;
  
  if(!currentElement.classList.contains('flag')){
    let imgp;
    setDivStateOpen(currentElement.id);
    
    if(currentElement.classList.contains('bomb')){
      if(currentElement.hasChildNodes()){
        numbersArrayFalseBomb.push(currentElement);
        currentElement.removeChild(currentElement.firstChild);
        bombFound ++;
        result = parseInt(displayMines.innerHTML)- 1;
        displayMines.innerHTML = pad(result, 3);
        currentElement.classList.remove('bomb');
        imgp = document.createElement('img');
        imgp.src = '/images/flag.png';
        currentElement.classList.add('flag', 'bomb-flag');
        currentElement.appendChild(imgp);
      }else {
        numbersArrayFalseBomb.push(currentElement);
        bombFound ++;
        result = parseInt(displayMines.innerHTML)- 1;
        displayMines.innerHTML = pad(result, 3);
        currentElement.classList.remove('bomb');
        imgp = document.createElement('img');
        imgp.src = '/images/flag.png';
        currentElement.classList.add('flag', 'bomb-flag');
        currentElement.appendChild(imgp);
      }
      
    }
    if(currentElement.classList.contains('numb')){
      numbersArrayFalseBomb.push(currentElement);
      currentElement.removeChild(currentElement.firstChild);
      result = parseInt(displayMines.innerHTML)- 1;
      displayMines.innerHTML = pad(result, 3);
      currentElement.classList.remove('numb');
      imgp = document.createElement('img');
      imgp.src = '/images/flag.png';
      currentElement.appendChild(imgp);
      currentElement.classList.add('flag', 'numb-flag');
      wrongBomb ++;
    }
    if(currentElement.classList.contains('empty')){
      numbersArrayFalseBomb.push(currentElement);
      currentElement.removeChild(currentElement.firstChild);
      currentElement.classList.remove('empty');
      result = parseInt(displayMines.innerHTML)- 1;
      displayMines.innerHTML = pad(result, 3);
      imgp = document.createElement('img');
      imgp.src = '/images/flag.png';
      currentElement.classList.add('flag', 'empty-flag');
      currentElement.appendChild(imgp);
      wrongBomb++;
    }

    }
  else if(currentElement.classList.contains('flag')){
    openDivMap.delete(currentElement.id);
    
    if(currentElement.classList.contains('numb-flag')){
      if(numbersArrayFalseBomb.includes(currentElement)){
        result = parseInt(displayMines.innerHTML)+ 1;
        displayMines.innerHTML = pad(result, 3);
        currentElement.removeChild(currentElement.firstChild);
        let elementP = document.createElement('p');
        currentElement.appendChild(elementP);
        elementP.innerHTML = (numberMap.get(currentElement.id));
        currentElement.classList.add('numb');
        currentElement.classList.remove('flag', 'numb-flag' );
        wrongBomb--;
      }
    }
    if(currentElement.classList.contains('empty-flag')){
      if(numbersArrayFalseBomb.includes(currentElement)){
          result = parseInt(displayMines.innerHTML)+ 1;
          displayMines.innerHTML = pad(result, 3);
          currentElement.removeChild(currentElement.firstChild);
          let elementP = document.createElement('p');
          currentElement.appendChild(elementP);
          elementP.innerHTML = (numberMap.get(currentElement.id));
          elementP.innerHTML = '';
          currentElement.classList.add('empty');
          currentElement.classList.remove('flag', 'empty-flag' );
          wrongBomb--;
        }
      
    }
    if(currentElement.classList.contains('bomb-flag')){
      if(numbersArrayFalseBomb.includes(currentElement)){
        
        result = parseInt(displayMines.innerHTML)+ 1;
        displayMines.innerHTML = pad(result, 3);
        currentElement.removeChild(currentElement.firstChild);
        imgp = document.createElement('img');
        imgp.src = '/images/mine.png';
        currentElement.appendChild(imgp);
        currentElement.classList.add('bomb');
        currentElement.classList.remove('flag', 'bomb-flag');
        bombFound --;
      }
    }
    
  } 
}

function dbMouseUp(e){
  tempArray.forEach((e)=> {
    if(e === null){
      return;
    }
    
    if(numberMap.has(e.id)){
      if(openDivMap.get(e.id) === true){
        return;
      }
            
      if(numberMap.get(e.id) === 0){
        e.classList.remove('open-empty');
        e.classList.add('empty');
      }
      if(numberMap.get(e.id) !== 0){
        e.classList.remove('open-empty');
        e.classList.add('numb');
        e.childNodes[0].innerText = (numberMap.get(e.id));
      }
    }
    else{
      if(e.classList.contains('flag')){
        return;
      }
      
      e.classList.remove('open-empty');
      e.classList.add('bomb');
    }
  });
}


function dbMouseClicks(e){
  startTheTimer();
  tempArray = [];
  let currentElementNow = e.currentTarget;
  tempArray.push(currentElementNow);
  around(currentElementNow);
  checkingBombsOpen(currentElementNow);
  
  tempArray.forEach((e) => {
    if(e === null){
      return;
    }
    if(openDivMap.get(e.id) === true){
      return;
    }
    if(e.hasChildNodes()){
      e.childNodes[0].innerText = '';
      e.classList.add('open-empty');
      e.classList.remove('empty','numb');
    }else{
      let elementP = document.createElement('p');
      e.appendChild(elementP);
      e.classList.add('open-empty');
      e.classList.remove( 'bomb');
      
    }
   
  });
}

function checkingBombsOpen(e){
  let tempCountBombs = 0;
  tempArray.forEach((elem) =>{
    if(elem === null){
      return;
    }
    if(elem.classList.contains('flag')){
      tempCountBombs++;
      let convertCountBombs = tempCountBombs.toString();
      if(e.innerText === convertCountBombs){
        tempArray.forEach((element) => {
          
          if(element === null){
            return;
          }
          setDivStateOpen(element.id);
          if(element.classList.contains('numb')){
            element.classList.remove('numb');
            if(element.childNodes[0].innerText ==='1' ){
              element.classList.add('one');
            }
            if(element.childNodes[0].innerText ==='2'){
              element.classList.add('two');
            }
            if(element.childNodes[0].innerText ==='3'){
              element.classList.add('three');
            }
            if(element.childNodes[0].innerText ==='4'){
              element.classList.add('four');
            }
          }
          if(element.classList.contains('bomb')){
            if(element.classList.contains('bomb-flag')){
              return;
            }
            element.classList.remove('bomb');
            let newItem = document.createElement('img');
            newItem.src = "/images/red-bomb.png";
            document.getElementById(element.id).appendChild(newItem);
            changeFace.src = '/images/sadface.jpg';
            stopTheTimer()
            revealBombs();
          }
          if(element.classList.contains('empty')){
            element.classList.remove('empty');
            element.classList.add('open-empty');
          }
          if(element.classList.contains('flag')){
            return;
          }
          if(element.classList.contains('empty-flag')){
            element.classList.remove('empty-flag');
            
          }

        });
      }    
    }
  });

  

}





function around(elem){
  
  let kaskas = elem.id;
  let splitedElement = kaskas.split("_");
  let j = parseInt(splitedElement[0]);
  let k = parseInt(splitedElement[1]);
  let position1 = (j-1)+'_'+ (k-1);
  let position2 = (j-1)+'_'+ (k);
  let position3 = (j-1)+'_'+(k+1);
  let position4 = (j)+'_'+(k+1);
  let position5 = (j)+'_'+(k-1);
  let position6 = (j+1)+'_'+(k-1)
  let position7 = (j+1)+'_'+(k);
  let position8 = (j+1)+'_'+(k+1);

  let element1 = document.getElementById(position1);
  tempArray.push(element1);
  let element2 = document.getElementById(position2);
  tempArray.push(element2);
  let element3 = document.getElementById(position3);
  tempArray.push(element3);
  let element4 = document.getElementById(position4);
  tempArray.push(element4);
  let element5 = document.getElementById(position5);
  tempArray.push(element5);
  let element6 = document.getElementById(position6);
  tempArray.push(element6);
  let element7 = document.getElementById(position7);
  tempArray.push(element7);
  let element8 = document.getElementById(position8);
  tempArray.push(element8);
}

function setDivStateOpen(id){
  openDivMap.set(id, true);
}


function open(elem){
  around(elem);

  tempArray.forEach((e) => {
    if(e === null){
      return;
    }if(e.classList.contains('empty')){
     
      e.classList.remove('empty');
      e.classList.add('open-empty');
      setDivStateOpen(e.id);
      open(e);}
      if(e.classList.contains('numb')){
        e.classList.remove('numb');
        
        setDivStateOpen(e.id);
        if(e.childNodes[0].innerText ==='1' ){
          e.classList.add('one');
        }
        if(e.childNodes[0].innerText ==='2'){
          e.classList.add('two');
        }
        if(e.childNodes[0].innerText ==='3'){
          e.classList.add('three');
        }
        if(e.childNodes[0].innerText ==='4'){
          e.classList.add('four');
        }
        return;
        
      }
  });
}


function revealBombs(){
  minesIndexArray.forEach((element) => {
    let tempElement = document.getElementById(element);
    tempElement.classList.remove('bomb');
    if(!tempElement.hasChildNodes()){
      let newItem = document.createElement('img'); 
      newItem.src = "/images/mine.png";
      tempElement.appendChild(newItem);
    }
    
  })

}

function start(){
  if(smallBoard.checked){
    generateBoard(9,9);
    stopTheTimer();
    changeFace.src = '/images/smilyface.jpg';
  }
  if(mediumBoard.checked){
    generateBoard(16,16);
    stopTheTimer();
    changeFace.src = '/images/smilyface.jpg';
  }
  if(largeBoard.checked){
    generateBoard(16,30);
    stopTheTimer();
    changeFace.src = '/images/smilyface.jpg';
  }
  
}






function generateMines(mines){
  minesIndexArray = [];
  let randomNumbersArray = [];
  let newArray = boardArray;
  let i = 0;
    
  while(i < mines){
    const randomNumber = Math.floor(Math.random() * newArray.length);
    let index = newArray.at(randomNumber);
    
    if(!randomNumbersArray.includes(randomNumber))
    {
      minesIndexArray.push(index);
      document.getElementById(index).classList.add('bomb');
      randomNumbersArray.push(randomNumber);
      i++;
    }
  } 
  numbersAroundMines();
  randomNumbersArray = [];
  //boardArray = [];
  
}


function numbersAroundMines(){
  
  for(let i = 0; i< boardArray.length; i++){
    if(minesIndexArray.includes(boardArray[i])){
      continue;
    }
    let countMines = 0;
    let checkingMines =[];
    let tempElement = boardArray[i];
    let splitedElement = tempElement.split("_");
    let j = parseInt(splitedElement[0]);
    let k = parseInt(splitedElement[1]);
        
    let position1 = (j-1)+'_'+ (k-1);
    let position2 = (j-1)+'_'+ (k);
    let position3 = (j-1)+'_'+(k+1);
    let position4 = (j)+'_'+(k+1);
    let position5 = (j)+'_'+(k-1);
    let position6 = (j+1)+'_'+(k-1)
    let position7 = (j+1)+'_'+(k);
    let position8 = (j+1)+'_'+(k+1);
    checkingMines.push(position1, position2, position3,position4,position5, position6, position7, position8);
    let elementP = document.createElement('p');
    document.getElementById(tempElement).appendChild(elementP);

    for(let m = 0; m < checkingMines.length; m++){
      if(minesIndexArray.includes(checkingMines[m])){
        countMines ++;
    } 

    numberMap.set(tempElement, countMines);
    
    if(countMines > 0){
      elementP.innerHTML = countMines;
      document.getElementById(tempElement).classList.add('numb');
      document.getElementById(tempElement).classList.remove('empty');      
    }
    else{
      elementP.innerHTML  = '';
      document.getElementById(tempElement).classList.add('empty');
    }
  }
}
}


function startTheTimer(){
  let time  = 0;

  if(!intervalId){
    intervalId = setInterval(function(){
    time ++;
    let time1 = Math.abs(time);
    if(time <= 9){
      let ss = "00" + time1;
      countingTimer.innerHTML = ss;
    }
    if(time > 9){
      let s = "0" + time1;
      countingTimer.innerHTML = s;
    }
    if(time >= 100){
      countingTimer.innerHTML =  time1;
    }
  }, 1000);
  }


  
}

function stopTheTimer(){
  clearInterval(intervalId);
  intervalId = null;
  countingTimer.innerHTML = '000';

  console.log(boardArray);
  boardArray.forEach(e=>{
    let divElement = document.getElementById(e);
    divElement.onmousedown = null;
    divElement.onmouseup = null;
    divElement.oncontextmenu = null;  
  });
}





















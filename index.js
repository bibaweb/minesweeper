import Popup from './popup.js';
import Stopwatch from './stopwatch.js'
const popup = new Popup('.popup');
popup.setEventListeners();

const stopwatch = new Stopwatch();

const grid = document.querySelector('.game__grid');
const popupImage = document.querySelector('.popup__image');
const bombsNum = document.querySelector('.game__bombs-num');
const startButton = document.querySelector('.game__button');
let width = 10;
let bombAmount = 20;
let flags = 0;
let squares = [];
let isGameOver = false;
let clicks = 0; //при первом клике запускается таймер

// Создать игровое поле
function createBoard() {
  //Создать перетасованный массив из бомб
  const bombsArray = Array(bombAmount).fill('game__bomb'); //fill() позволяет заполнить все элементы массива одним значением
  const emptyArray = Array(width * width - bombAmount).fill('game__valid'); //Создать массив из безопасных квадратов
  const gameArray = emptyArray.concat(bombsArray); //Создать массив из всех ячеек
  //Создать итоговый массив с перемешанными между собой ячейками
  const shuffledArray = gameArray.sort(() => Math.random() - 0.5); //Метод sort() на месте сортирует элементы массива и возвращает отсортированный массив
  //Math.random returns positive number between 0 and 1 so it would not shuffle  anything. (Math.radnom - 0.5) gives you number in range  bewteen - 0.5 to 0.5, so it shuffles elements in the array, as you have both, negative and positive result roughly in equaly number of cases.

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.setAttribute('id', i);
    square.classList.add('game__square');
    square.classList.add(shuffledArray[i]);
    grid.appendChild(square);
    squares.push(square);

    //Обычный клик по квадрату
    square.addEventListener('click', function () {
      click(square);
    })
    //Поставить флажок
    square.oncontextmenu = function(e) {
      e.preventDefault();
      addFlag(square);
    };
  }
  //Добавить цифры на квадраты без бомбы
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    //Вычислить квадраты, которые граничат с краем
    const isLeftEdge = (i % width === 0); //Левый край
    const isRightEdge = (i % width === width - 1); //Правый край

    if (squares[i].classList.contains('game__valid')) {
      //исходный код
      if (i>0 && !isLeftEdge && squares[i -1].classList.contains('game__bomb')) total++  // если i > 0, не в крайнем левом столбце и соседний слева квадрат содержит бомбу
      if (i>9 && !isRightEdge && squares[i +1 -width].classList.contains('game__bomb')) total++ //не рядом с правым краем и сверху справа квадрат содержит бомбу
      if (i>9 && squares[i-width].classList.contains('game__bomb')) total++ //>=10  // квадрат с бомбой находится прямо над ним
      if (i>10 && !isLeftEdge && squares[i -1 -width].classList.contains('game__bomb')) total++ //>=11  // квадрат сверху слева содержит бомбу
      if (i<89 && !isRightEdge && squares[i +1 +width].classList.contains('game__bomb')) total++ //<=88  // квадрат снизу справа содержит бомбу
      if (i<90 && squares[i +width].classList.contains('game__bomb')) total++ //<=89 //если квадрат снизу содержит бомбу
      if (i<90 && !isLeftEdge && squares[i -1 +width].classList.contains('game__bomb')) total++ //если соседний квадрат слева снизу содержит бомбу
      if (i<99 && !isRightEdge && squares[i +1].classList.contains('game__bomb')) total++ // если соседний квадрат справа содержит бомбу

      squares[i].setAttribute('data', total);
    }
  }
}

 //Добавить цветок при клике правой кнопкой
function addFlag(square) {
  if (isGameOver) return;
  if (!square.classList.contains('game__square_checked')) {
    if (!square.classList.contains('game__flag')) {
      square.classList.add('game__flag');
      flags++;
      checkForWin();
    } else {
      square.classList.remove('game__flag');
      flags--;
    }
  }

  bombsNum.textContent = bombAmount - flags;
}

//Функция, обрабатывающая клики по квадратам
function click(square) {
  //запустить таймер
  clicks++
  if (clicks === 1) {
    stopwatch.setInterval();
  }

  let currentId = square.id;
  if (isGameOver) return;
  if (square.classList.contains('game__square_checked') || square.classList.contains('game__flag')) return;
  if (square.classList.contains('game__bomb')) {
    gameOver();
    stopwatch.stopTime();
  } else {
    let total = square.getAttribute('data');
    if (total != 0) { //вывести в квадрат цифру, если квадрат граничит с бомбой
      if (parseInt(total) === 1) {
        square.classList.add('game__square_one');
      }
      if (parseInt(total) === 2) {
        square.classList.add('game__square_two');
      }
      if (parseInt(total) === 3) {
        square.classList.add('game__square_three');
      }
      if (parseInt(total) === 4) {
        square.classList.add('game__square_four');
      }
      if (parseInt(total) === 5) {
        square.classList.add('game__square_five');
      }
      if (parseInt(total) === 6) {
        square.classList.add('game__square_six');
      }
      if (parseInt(total) === 7) {
        square.classList.add('game__square_seven');
      }
      square.classList.add('game__square_checked');
      square.textContent = total;
      return;
    } 
    checkSquare(currentId);
  }
  square.classList.add('game__square_checked'); //класс для пустых квадратов
}

//Функция проверки соседних квадратов 
function checkSquare(currentId) {
  //Вычислить квадраты, которые граничат с краем
  const isLeftEdge = (currentId % width === 0); //Левый край
  const isRightEdge = (currentId % width === width - 1); //Правый край

  //Рекурсия
  setTimeout(() => { //setTimeout позволяет вызвать функцию один раз через определённый интервал времени.
    if (currentId > 0 && !isLeftEdge) {
      const newId = parseInt(currentId) -1;  //квадрат слева
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 9 && !isRightEdge) {
      const newId = parseInt(currentId) +1 -width;//квадрат справа сверху
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId >= 10) {
      const newId = parseInt(currentId) -width; // квадрат сверху
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId >= 11 && !isLeftEdge) {
      const newId = parseInt(currentId) -1 -width; //квадрат слева сверху
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId <= 88 && !isRightEdge) {
      const newId = parseInt(currentId) +1 +width; // квадрат справа снизу      
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId <= 89) {
      const newId = parseInt(currentId) +width; // квадрат снизу      
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 90 && !isLeftEdge) {
      const newId = parseInt(currentId) -1 +width; // квадрат слева снизу      
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 99 && !isRightEdge) {
      const newId = parseInt(currentId) +1; // квадрат справа
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 10)
}

function gameOver() {
  startButton.classList.add('game__button_finished');
  isGameOver = true;

  //показать все бомбы
  squares.forEach(square => {
    if (square.classList.contains('game__bomb')) {
      square.classList.add('game__bomb_active');
    }
  })

  setTimeout(() => {
    popupImage.src = './images/cartoonboom.png';
    popupImage.alt = 'Взрыв';
    popup.open();
  }, 30)
}

function checkForWin() {
  let matches = 0;

  for (let i=0; i <squares.length; i++) {
    if (squares[i].classList.contains('game__flag') && squares[i].classList.contains('game__bomb')) {
      matches++;
    }
    if (matches ===bombAmount) {
      startButton.classList.add('game__button_win');
      popupImage.src = './images/win2.png';
      popupImage.alt = 'Победа';
      popup.open();
      isGameOver = true;
      stopwatch.stopTime();
    }
  }
}


startButton.addEventListener('mousedown', () => {
  stopwatch.resetTime();
  grid.textContent = '';
  isGameOver = false;
  squares = [];
  flags = 0;
  clicks = 0;
  bombsNum.textContent = bombAmount;
  createBoard();
  startButton.classList.remove('game__button_finished');
  startButton.classList.remove('game__button_win');
  startButton.classList.add('game__button_pressed');
})
startButton.addEventListener('mouseup', () => {
  startButton.classList.remove('game__button_pressed');
})
grid.addEventListener('mousedown', () => {
  startButton.classList.add('game__button_pressed');
})
grid.addEventListener('mouseup', () => {
  startButton.classList.remove('game__button_pressed');
})


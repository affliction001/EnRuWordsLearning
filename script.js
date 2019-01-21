'use strict';

// Сразу обратился ко всем необходимым DOM елементам.
const startWord = document.querySelector('.startWord');
const inputField = document.querySelector('.input-field');
const checkButton = document.querySelector('.check-button');
const count = document.querySelector('.count');

// Позиционировал текс по центру полей.
startWord.style.lineHeight = startWord.clientHeight + 'px';
count.style.lineHeight = count.clientHeight + 'px';
window.addEventListener('resize', e => {
  startWord.style.lineHeight = startWord.clientHeight + 'px';
  count.style.lineHeight = count.clientHeight + 'px';
});

// Загружаю данные из локального хранилища при загрузке страницы.
if (localStorage['myWords'] === undefined) { localStorage['myWords'] = JSON.stringify(startList); }

let first = [];
if (localStorage['first'] === undefined) {
  maintainCurrentWordCounts();
} else {
  first = JSON.parse(localStorage['first']);
}


let second = [];
if (localStorage['second'] !== undefined) { second = JSON.parse(localStorage['second']); }

let third = [];
if (localStorage['third'] !== undefined) { third = JSON.parse(localStorage['third']); }


// функция для сохранения актуальных данных в локальном хранилище.
function saveData() {
  localStorage['first'] = JSON.stringify(first);
  localStorage['second'] = JSON.stringify(second);
  localStorage['third'] = JSON.stringify(third);
}

function choiceWord(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function displayWord(word) {
  count.textContent = word.lvl;

  if (Math.floor(Math.random() * 2) === 0) {
    startWord.textContent = word.en;
    return word.ru;
  } else {
    startWord.textContent = word.ru;
    return word.en;
  }
}

function findWordsIndexInArray(word, array) {
  let index = undefined;
  for (let i = 0; i < array.length; i++) {
    if (array[i].en === word.en && array[i].ru === word.ru) {
      index = i;
    }
  }
  return index;
}

function moveWordToNextLevel(word, currentLevel, targetLevel) {
  targetLevel.push(currentLevel.splice(findWordsIndexInArray(word, currentLevel), 1)[0]);
}

function goToNextWord() {
  if (totalCount % 50 === 0) {
    if (third.length > 0) {
      wordToCheck = choiceWord(third);
      wordToFind = displayWord(wordToCheck);
    } else {
      alert('Third list is empty! Need to add new words.');
    }
  } else if (totalCount % 20 === 0) {
    if (second.length > 0) {
      wordToCheck = choiceWord(second);
      wordToFind = displayWord(wordToCheck);
    } else {
      alert('Second list is empty! Need to add new words.');
    }
  } else {
    if (first.length > 0) {
      wordToCheck = choiceWord(first);
      wordToFind = displayWord(wordToCheck);
    } else {
      alert('First list is empty! Need to add new words.');
    }
  }
}

function maintainCurrentWordCounts() {
  let myWords = JSON.parse(localStorage['myWords']);

  while (myWords.length && first.length <= 20) {
    first.push(myWords.splice(Math.floor(Math.random() * myWords.length), 1)[0]);
  }

  localStorage['myWords'] = JSON.stringify(myWords);
}

// Глобальный счетчик.
let totalCount = 1;
let wordToCheck = '';
let wordToFind = '';

goToNextWord();

checkButton.addEventListener('click', event => {
  if (inputField.value === wordToFind && inputField.value !== '' && inputField.value !== undefined) {
    inputField.setAttribute('id', 'true');
    inputField.value = 'True';
    wordToCheck.lvl += 1;
    totalCount++;
  } else {
    inputField.setAttribute('id', 'false');
    inputField.value = 'False';
    wordToCheck.lvl = 0;
  }

  count.textContent = wordToCheck.lvl;

  if (wordToCheck.lvl >= 15) {
    third.splice(findWordsIndexInArray(wordToCheck, third), 1);
  } else if (wordToCheck.lvl >= 10) {
    moveWordToNextLevel(wordToCheck, second, third);
  } else if (wordToCheck.lvl >= 5) {
    moveWordToNextLevel(wordToCheck, first, second);
    maintainCurrentWordCounts();
  }

  saveData();

  setTimeout(() => {
    inputField.setAttribute('id', '');
    inputField.value = '';
  }, 500);

  setTimeout(() => {
    goToNextWord();
  }, 600);
});

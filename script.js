'use strict';

// Сразу обратился ко всем необходимым DOM елементам.
const startWord = document.querySelector('.startWord');
const inputField = document.querySelector('.input-field');
const checkButton = document.querySelector('.check-button');
const count = document.querySelector('.count');
const newWordButton = document.querySelector('.new-word-button');
const newWordForm = document.querySelector('.new-word-form');
const newWordValue = document.querySelector('.new-word-field');
const newWordTranslation = document.querySelector('.new-translation-field');
const newWordAdd = document.querySelector('.new-word-add');
const lvl1 = document.querySelector('.lvl-1');
const lvl2 = document.querySelector('.lvl-2');
const lvl3 = document.querySelector('.lvl-3');

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

if (localStorage['lvl1'] === undefined) localStorage['lvl1'] = 0;
if (localStorage['lvl2'] === undefined) localStorage['lvl2'] = 0;
if (localStorage['lvl3'] === undefined) localStorage['lvl3'] = 0;

lvl1.textContent = `Level 1 - ${localStorage['lvl1']}`;
lvl2.textContent = `Level 2 - ${localStorage['lvl2']}`;
lvl3.textContent = `Level 3 - ${localStorage['lvl3']}`;

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
  if (inputField.value.toLowerCase() === wordToFind.toLowerCase() && inputField.value !== '' && inputField.value !== undefined) {
    inputField.setAttribute('id', 'true');
    wordToCheck.lvl += 1;
    totalCount++;
  } else {
    inputField.setAttribute('id', 'false');
    inputField.value = wordToFind;

    if (wordToCheck.lvl >= 8) {
      moveWordToNextLevel(wordToCheck, third, first);
      --localStorage['lvl2'];
      --localStorage['lvl1'];
    } else if (wordToCheck.lvl >= 5) {
      moveWordToNextLevel(wordToCheck, second, first);
      --localStorage['lvl1'];
    }

    wordToCheck.lvl = 0;
  }

  count.textContent = wordToCheck.lvl;

  if (wordToCheck.lvl === 10) {
    ++localStorage['lvl3'];
    third.splice(findWordsIndexInArray(wordToCheck, third), 1);
  } else if (wordToCheck.lvl === 8) {
    ++localStorage['lvl2'];
    moveWordToNextLevel(wordToCheck, second, third);
  } else if (wordToCheck.lvl === 5) {
    ++localStorage['lvl1'];
    moveWordToNextLevel(wordToCheck, first, second);
  }

  maintainCurrentWordCounts();
  saveData();

  lvl1.textContent = `Level 1 - ${localStorage['lvl1']}`;
  lvl2.textContent = `Level 2 - ${localStorage['lvl2']}`;
  lvl3.textContent = `Level 3 - ${localStorage['lvl3']}`;

  setTimeout(() => {
    inputField.setAttribute('id', '');
    inputField.value = '';
  }, 500);

  setTimeout(() => {
    goToNextWord();
  }, 600);
});

newWordButton.addEventListener('click', event => {
  newWordForm.classList.toggle('hide-element');
});

newWordAdd.addEventListener('click', e => {
  const EN = newWordValue.value;
  const RU = newWordTranslation.value;

  if ((EN !== undefined || EN !== '') && (RU !== undefined || RU !== '')) {
    const myWords = JSON.parse(localStorage['myWords']);
    myWords.push({en: EN, ru: RU, lvl: 0});
    localStorage['myWords'] = JSON.stringify(myWords);
  }

  newWordForm.classList.add('hide-element');
});

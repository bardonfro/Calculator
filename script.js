'use strict'

//Configuration
let maxDigits = 11;


//Variables and Constants

let memoryContent = 0;
let workingNum = "";
let standingNum = "";
let compResult = "";
let errorStatus = 0;


//Selectors and Event Listeners

const memIndic = document.querySelector('#memory-indicator');
const operIndic = document.querySelector('#operator-indicator');
const screen2 = document.querySelector('#disp-top .disp-num');
const screen1 = document.querySelector('#disp-bot .disp-num');

const btnClear = document.querySelector('.clear');
btnClear.addEventListener('click', doClear)
const btnsAll = document.querySelectorAll('#keypad-wrapper button');
btnsAll.forEach(function(btn) {btn.addEventListener('click', buttonClick)});

document.addEventListener('keypress', keypress)

function buttonClick(e) {
    const btn = e.target;
    if (btn.classList.contains("clear") ||
        errorStatus) {
        return;
    } else if (btn.classList.contains("digit")) {
        placeDigit(btn.textContent);
    } else if (btn.classList.contains("operator")) {
        doOperation(btn.dataset.operation);
    } else if (btn.classList.contains("function")) {
        doKeyFunction(btn.dataset.function);
    } else {
        passError("Button", e.target);
    }
}

function clearAll () {
    updWorkingNum("");
    updStandingNum("");
    operIndic.textContent = "";
    errorStatus = 0;
}

function doClear() {
    if (btnClear.textContent === "C") {
        updWorkingNum("");
        btnClear.textContent = "AC"
    } else {
        clearAll();
    }
}

function doKeyFunction(f) {
    console.log(f);
    switch (f){
        case "sqroot":
            getSqRoot();
            break;
    }
}

function doOperation(op) {
    console.log(op);
    operIndic.textContent = op;
}

function getSqRoot() {
    let ans;
    if (workingNum.length > 0) {
        ans = Math.sqrt(workingNum);
    } else {
        ans = Math.sqrt(standingNum);
    }
    putAnswer(`${ans}`);

}

function keypress(e) {
    if (errorStatus) {return;}
    const key = e.key;
    const numbers = ["0","1","2","3","4","5","6","7","8","9","."];
    const operators = ["+","-","*","/"];
    const equals = ["=","Enter","enter"]

    if (numbers.some(i => i === key)) {
        placeDigit(key);
    } else if (operators.some(i => i === key)) {
        doOperation(key);
    } else if (equals.some(i => i === key)) {
        doKeyFunction(key);
    }
}

function passError(type, obj) {
    console.log(`${type} Error:`);
    console.log(obj);
    updStandingNum("");
    updWorkingNum("");
    screen1.textContent = `Err: ${type}`
    errorStatus = 1;
    btnClear.textContent = "AC";
}

function placeDigit(num) {
    if (workingNum.length >= maxDigits) {
        passError("Size", workingNum)
        return;
    }
    updWorkingNum(workingNum.concat(num));
    btnClear.textContent = "C";
}

function putAnswer(num) {
    updStandingNum("");
    updWorkingNum("");
    compResult = num;
    screen1.textContent = num;
    operIndic.textContent = "=";
    btnClear.textContent = "AC";
}

function updStandingNum(num) {
    standingNum = num;
    screen2.textContent = standingNum;
}

function updWorkingNum(num) {
    workingNum = num;
    screen1.textContent = workingNum;
}


const add = (a,b) => a + b;
const subtract = (a,b) => a - b;
const multiply = (a,b) => a * b;
const divide = (a,b) => a / b;

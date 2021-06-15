'use strict'

//Configuration
let maxDigits = 11;


//Variables and Constants

let memoryContent = 0;
let workingNum = "";
let standingNum = "";
let errorStatus = 0;
let operator = ""


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
        doKeyOperation(btn.dataset.operation);
    } else if (btn.classList.contains("function")) {
        doKeyFunction(btn.dataset.function);
    } else {
        passError("Button", e.target);
    }
}

function clearAll () {
    updWorkingNum("0");
    updStandingNum("");
    operIndic.textContent = "";
    errorStatus = 0;
    setOperator("clear");
}

function doClear() {
    if (btnClear.textContent === "C") {
        updWorkingNum("0");
        btnClear.textContent = "AC"
    } else {
        clearAll();
    }
}

function doKeyFunction(f) {
    console.log("doKeyFunction");
    console.log(f);
    switch (f){
        case "sqroot":
            getSqRoot();
            break;
    }
}

function doKeyOperation (op) {
    const ans = mathify(op, standingNum, workingNum);
    updStandingNum(ans);
    setOperator(op);
    updWorkingNum("0");
}

function setOperator(op) {
    operIndic.textContent = getOperationSymbol(op);
    operator = op;
}

function getOperationSymbol(op) {
    switch(op){
        case "add":
            return "+";
            break;
        case "subtract":
            return "-";
            break;
        case "multiply":
            return "x";
            break;
        case "divide":
            return String.fromCharCode(247);
            break;
        
    }
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
        setOperator(key);
    } else if (equals.some(i => i === key)) {
        doKeyFunction(key);
    }
}

function mathify(op, a, b) {
    if (isNaN(a) || 
        isNaN(b) ||
        !typeof(a) === "number" ||
        !typeof(b) === "number" ||
        op === "divide" && b === 0) {
            passError("Not num", `${op} ${a} ${b}`)
            return;
    }
    if (op === "add") {return a + b;}
    if (op === "subtract") {return a - b;}
    if (op === "multiply") {return a * b;}
    if (op === "divide") {return a / b;}
}

function passError(type, obj) {
    console.log(`${type} Error:`);
    console.log(obj);
    updStandingNum("");
    updWorkingNum("0");
    screen1.textContent = `Err: ${type}`
    errorStatus = 1;
    btnClear.textContent = "AC";
}

function placeDigit(num) {
    if (workingNum.length >= maxDigits ||
        num === "." && workingNum.includes(".")) {
        return;
    }
    if (workingNum === "0") {
        workingNum = "";
    }
    updWorkingNum(workingNum.concat(num));
    btnClear.textContent = "C";
}

function putAnswer(num) {
    updStandingNum("");
    updWorkingNum("0");
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

refreshDisplay() {
    screen1.textContent = workingNum;
    screen2.textContent = standingNum;
    operIndic = getOperationSymbol(operator);
}
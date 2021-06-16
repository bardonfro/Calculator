'use strict'

//Configuration
let maxDigits = 11;


//Variables and Constants

let memoryContent = "0";
let workingNum = "0";
let standingNum = "0";
let errorStatus = false;
let operator = "clear"    // When operator is clear, weird things happen in mathify
let tape = [];


//Selectors and Event Listeners

const memIndic = document.querySelector('#memory-indicator');
const operIndic = document.querySelector('#operator-indicator');
const screen2 = document.querySelector('#disp-top .disp-num');
const screen1 = document.querySelector('#disp-bot .disp-num');

const btnClear = document.querySelector('.clear');
btnClear.addEventListener('click', clear)
const btnsAll = document.querySelectorAll('#keypad-wrapper button');
btnsAll.forEach(function(btn) {btn.addEventListener('click', buttonClick)});


document.addEventListener('keypress', keypress)

function buttonClick(e) {
    const btn = e.target;
    if (btn.classList.contains("clear")) {
        clear();
        return;
    } else if (errorStatus) {
        return;
    } else if (btn.classList.contains("digit")) {
        putDigit(btn.textContent);
    } else if (btn.classList.contains("operator")) {
        doKeyOperation(btn.dataset.operation);
    } else if (btn.classList.contains("function")) {
        doKeyFunction(btn.dataset.function);
    } else {
        passError("Button", e.target);
    }
    refreshDisplay();
}

function keypress(e) {
    if (errorStatus) {return;}
    const key = e.key;
    const numbers = ["0","1","2","3","4","5","6","7","8","9","."];
    const operators = ["+","-","*","/"];
    const equals = ["=","Enter","enter"]

    if (numbers.some(i => i === key)) {
        putDigit(key);
    } else if (operators.some(i => i === key)) {
        doKeyOperation(key);
    } else if (equals.some(i => i === key)) {
        doKeyFunction("=");
    }
    refreshDisplay();
}

function clear() {
    if (btnClear.textContent === "C") {
        btnClear.textContent = "AC"
    } else {
        workingNum = "0";
        standingNum = "0";
        errorStatus = false;
        operator ="clear";
    }
    workingNum = "0";
    refreshDisplay();
}

function doKeyFunction(f) {
    console.log("doKeyFunction");
    console.log(f);
    switch (f){
        case "=":
            doKeyOperation("=");
            putAnswer();
            break;
        case "sqroot":
            standingNum = Math.sqrt(workingNum);
            operator = "="
            putAnswer();
            break;
    }
}

function doKeyOperation (op) {
    if (operator === "clear" || operator === "=") {
        standingNum = workingNum;
    } else {    
        //validation required? -------------------------------------------------?
        standingNum = mathify(operator, standingNum, workingNum);
    }
    tape.unshift(standingNum);
    operator = op;
    workingNum = "0";
}

const getOperationFromSymbol = function(symb) {
    switch(symb) {
        case "+":
            return "add";
        case "-":
            return "subtract";
        case "*":
            return "multiply";
        case "/":
            return "divide";
    }
    passError("Symb", "getOperationFromSymbol(" + symb + ")")
}

function getOperationSymbol(op) {
    switch(op){
        case "*":
            return "x";
            break;
        case "/":
            return String.fromCharCode(247);
            break;
        case "clear":
            return "";
            break;
        case "equal":
            return "=";
            break;
        case "error":
            return "E";
            break;
        default:
            return op;
    }
}

function getSqRoot() {
    let ans;
    if (!workingNum === 0) {
        ans = Math.sqrt(workingNum);
    } else {
        ans = Math.sqrt(standingNum);
    }
    putAnswer(`${ans}`);

}

function mathify(op, a, b) {
    if(!(isNumber(Number(a)) && isNumber(Number(b)))) {
        passError("Not Num", `mathify(${op}, ${a}, ${b})`);
        return;
    }

    let ans;
    [a,b] = [Number(a),Number(b)];
    
    switch (op) {
        case "+":
            ans = a + b;
            break;
        case "-":
            ans = a - b;
            break;
        case "*":
            ans = a * b;
            break;
        case "/":
            if (b === 0) {
                passError("Div/0", "Mathify")
                return;
            }
            ans = a / b;
            break;
        }
        
        return ans.toString();
}

function passError(type, obj) {
    console.log(`${type} Error:`);
    console.log(obj);
    screen1.textContent = `Err: ${type}`
    errorStatus = true;
    btnClear.textContent = "AC";
}

const putDigit = function (num) {
    if (operator === "=") {
        clear();
    }
    if (workingNum.length >= maxDigits ||
        num === "." && workingNum.includes(".")) {
        return;
    }
    if (workingNum === "0" && !(num === ".")) {
        workingNum = "";
    }

    workingNum = workingNum.concat(num);
    btnClear.textContent = "C";
}

function putAnswer(num) {
    [standingNum, workingNum] = ["0",standingNum];
    btnClear.textContent = "AC";
}

const refreshDisplay = function() {
    screen1.textContent = workingNum.toString();
    if (standingNum === "0") {
        screen2.textContent = "";
    } else {
        screen2.textContent = standingNum.toString();
    }
    operIndic.textContent = getOperationSymbol(operator);
}

const isNumber = a => !isNaN(a) && typeof(a) === "number";

let vrbs = {
    standingNum: standingNum,
    workingNum: workingNum,
    operator: operator,
    memoryContent: memoryContent,
    errorStatus: errorStatus,
}

const v = function() {console.table(vrbs)}

Math.sqrt

function verifyString(input,inputName) {
    if (!typeof(input) === "string") {
        console.log(`inputName is ${typeof(input)}: ${input}`)
    }
}
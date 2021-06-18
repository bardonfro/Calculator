'use strict'

/* To-Do ----------------------
* - Memory recall then digit concatenates, or then backspace backspaces
* - Sqare root of a neg number doesn't return error.
* - Proper error handling
* - Dividing by blank does not return error. Typing a zero does, but that doesn't change the display
* - Dividing by 0, mathify returns undefined. This throws error at line 
*       159, because undefined.toString()
*/

//Configuration
let maxDigits = 11;


//Variables and Constants

let memoryContent = "";
let workingNum = "";
let standingNum = "";
let errorStatus = false;
let operator = "clear"    // When operator is clear, weird things happen in mathify
let tape = [];


//Selectors and Event Listeners

const display = {
    memIndic: document.querySelector('#memory-indicator'),
    operIndic: document.querySelector('#operator-indicator'),
    secondary: document.querySelector('#disp-top .disp-num'),
    primary: document.querySelector('#disp-bot .disp-num'),
    
    refresh: function () {
        if (workingNum === "") {
            display.primary.textContent = "0";
        } else {
            display.primary.textContent = sizeForScreen(workingNum.toString(),maxDigits);
        }
       
        display.secondary.textContent = sizeForScreen(standingNum.toString(), maxDigits);
       
        display.operIndic.textContent = getOperationSymbol(operator);
        if (memoryContent.length > 0) {
            display.memIndic.textContent = "M";
        }  else {
            display.memIndic.textContent = "";
    
        }
    },
}

const operation = {
    operand1: 2,
    operand2: 4,
    operator: "+",
    result: 0,
    
    clear: function () {
        operand1 = operand2 = operator = result = null;
    },
    
    consoleLog: function () {
        console.log([this.operand1, this.operand2, this.operator, this.result])
    },

    run: function (op = this.operator, a = this.operand1, b = this.operand2) {
        this.operator = op;
        this.operand1 = a;
        this.operand2 = b;

        this.result = mathify (op, a, b);
        return this.result;
    },

    isValid: function (a) {
        const res = (typeof(a) === "number" && 
                !(isNaN(a)) &&
                !(a === Infinity)
        );
        return res;
    },

    putOperand1: function (a) {
        if(!this.isValid(a)) {
            passError("Not Num","a");
        } else {
            this.operand1 = a;
        }
        this.result = null;
    },

    putOperand2: function (a) {
        if(!this.isValid(a)) {
            passError("Not Num","a");
        } else {
            this.operand2 = a;
        }
        this.result = null;
    },
}


const btnMemMulti = document.querySelector('#memory-multifunction');
btnMemMulti.setClr = function () {
    this.textContent = "Clr";
    this.dataset.function = "mem-clear"
}
btnMemMulti.setRcl = function () {
    this.textContent = "Rcl";
    this.dataset.function = "mem-recall";
}

const btnClear = document.querySelector('.clear');
const btnsAll = document.querySelectorAll('#keypad-wrapper button');
btnsAll.forEach(function(btn) {btn.addEventListener('click', buttonClick)});


document.addEventListener('keyup',  keypress)

function buttonClick(e) {
    setMemoryButton(e.target);
    const btn = e.target;
    if (btn.classList.contains("clear")) {
        clear();
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
    setMemoryButton(btnClear);
    const key = e.key;
    const numbers = ["0","1","2","3","4","5","6","7","8","9","."];
    const operators = ["+","-","*","/"];
    const equals = ["=","Enter","enter"];
    const backspace = ["Backspace", "Delete"]; 
    const escape = ["Escape", "escape", "Esc", "esc"];
    
    if (escape.some(i => i === key)) {
        clear();
    } else if (errorStatus) {
        return;
    } else if (numbers.some(i => i === key)) {
        putDigit(key);
    } else if (operators.some(i => i === key)) {
        doKeyOperation(key);
    } else if (equals.some(i => i === key)) {
        doKeyFunction("=");
    } else if (backspace.some(i => i === key)) {
        doKeyFunction("backspace");
    }
    refreshDisplay();
}

function backspace () {
    if (operator === "=") {
            clear();
        }
    if (workingNum === "0") {return;}
        
    workingNum = workingNum.slice(0, workingNum.length - 1);
}

function clear() {
    if (btnClear.textContent === "C") {
        btnClear.textContent = "AC"
    } else {
        workingNum = "";
        standingNum = "";
        errorStatus = false;
        operator ="clear";
    }
    workingNum = "";
}

function doKeyFunction(f) {
    switch (f){
        case "=":
            doKeyOperation("=");
            putAnswer();
            break;
        case "sqroot":
            getSqRoot();
            putAnswer();
            break;
        case "invert":
            workingNum = workingNum * (-1);
            break;
        case "backspace":
            backspace();
            break;
        case "mem-store":
            memoryContent = workingNum;
            break;
        case "mem-clear":
            memoryContent = "";
            break;
        case "mem-plus":
            if (memoryContent.length > 0) {
                memoryContent = mathify("+", memoryContent, workingNum).toString();
            } else {
                memoryContent = workingNum;
            }
            break;
        case "mem-recall":
            if (memoryContent.length > 0) {
                workingNum = memoryContent;
                btnMemMulti.setClr();
            }
            break;
    }
}

function doKeyOperation (op) {
    if (operator === "clear" || operator === "=") {
        standingNum = workingNum;
    } else if (!(workingNum === "")) {    
        //validation required? -------------------------------------------------?
        standingNum = mathify(operator, standingNum, workingNum).toString();
    }
    tape.unshift(standingNum);
    btnClear.textContent = "AC";
    operator = op;
    workingNum = "";
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
    if (!(workingNum === "")) {
        standingNum = Math.sqrt(workingNum).toString();
    } else if (workignNum < 0) {
        passError("Not Num",workingNum)
    } else {
        standingNum = Math.sqrt(standingNum).toString();
    }
}

const isNumber = a => !isNaN(a) && typeof(a) === "number";

function invert() {
    workingNum = workingNum * (-1);
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
            if (b === "0" || b === "") {
                passError("Div/0", "Mathify")
                return;
            }
            ans = a / b;
            break;
        }
        
        return ans;
}

function passError(type, obj) {
    console.log(`${type} Error:`);
    console.log(obj);
    operator = "error";
    errorStatus = true;
    btnClear.textContent = "AC";
    display.primary.textContent = `${type}`
    return type;
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
    [standingNum, workingNum] = ["",standingNum];
    btnClear.textContent = "AC";
    operator = "=";
}

const refreshDisplay = function() {
    if (workingNum === "") {
        display.primary.textContent = "0";
    } else {
        display.primary.textContent = sizeForScreen(workingNum.toString(),maxDigits);
    }
   
    display.secondary.textContent = sizeForScreen(standingNum.toString(), maxDigits);
   
    display.operIndic.textContent = getOperationSymbol(operator);
    if (memoryContent.length > 0) {
        display.memIndic.textContent = "M";
    }  else {
        display.memIndic.textContent = "";

    }
}

function setMemoryButton(btn) {
    if (btn.dataset.function === "mem-clear") {return;}
    if (memoryContent.length > 0) {
        btnMemMulti.setRcl();
    }

}

function sizeForScreen(strNum, len) {
    if (!typeof(strNum) === "string") {
        return strNum;
    }
    let arrNum = strNum.split(".");
    
    if (arrNum[1]) {
        len = len - 1;
        arrNum[1] = arrNum[1].slice(0,len - arrNum[0].length);
    }

    if (arrNum[0].length > len) {
        return passError("Size", strNum);
    }

    return arrNum.join(".");
}


function verifyString(input,inputName) {
    if (!typeof(input) === "string") {
        console.log(`inputName is ${typeof(input)}: ${input}`)
    }
}

clear();
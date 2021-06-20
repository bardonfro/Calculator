'use strict'

/* To-Do ----------------------
* - Sqare root of a neg number doesn't return error.
* - Proper error handling
* - Dividing by blank does not return error. Typing a zero does, but that doesn't change the display
* - Dividing by 0
* - Can't do multiple square roots in a row
* - Invert
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

const btnClear = document.querySelector('.clear');
btnClear.clear = function () {
    if (this.textContent === "C") {
        strStaged.clear();
    } else if (this.textContent === "AC") {
        strStaged.clear();
        operation.clear();
    }
    this.textContent = "AC"
    //strStaged.isActive = true;
}

const display = {
    memIndic: document.querySelector('#memory-indicator'),
    operIndic: document.querySelector('#operator-indicator'),
    primary: document.querySelector('#disp-bot .disp-num'),
    secondary: document.querySelector('#disp-top .disp-num'),
    maxDigits: 11,
    
    putMemory: function (inp) {
        let outp;
        if (inp === null) {
            outp = null;
        } else {
            outp = this.truncate(inp.toString(), 1);
        }
        this.memIndic.textContent = outp;
    },

    putOperator: function (inp) {
        let outp;
        if (inp === null) {
            outp = null;
        } else {
            outp = this.truncate(inp.toString(), 1);
        }
        this.operIndic.textContent = outp;
    },
    
    putPrimary: function (inp) {
        let outp;
        if (inp === null ||
            inp === "") {
            outp = "-";
        } else {
            outp = this.truncate(inp.toString(), this.maxDigits);
        }
        this.primary.textContent = outp;
    },

    putSecondary: function (inp) {
        let outp;
        if (inp === null) {
            outp = null;
        } else {
            outp = this.truncate(inp.toString(), this.maxDigits);
        }
        this.secondary.textContent = outp;
    },
   
    truncate: function (str, len) {
        if (!typeof(str) === "string") {
            return str;
        }
        let arr = str.split(".");
        
        if (arr[1]) {
            len = len - 1;
            arr[1] = arr[1].slice(0,len - arr[0].length);
        }
    
        if (arr[0].length > len) {
            return passError("Size", str);
        }
    
        return arr.join(".");
    },
}

const operation = {
    operand1: "",
    operand2: "",
    operator: "",
    result: "",
    
    clear: function (op1) {
        this.operand1 = this.operand2 = this.operator = this.result = "";
        if (op1) {this.operand1 = op1};
        display.putPrimary(this.operand2);
        display.putSecondary(this.operand1);
        display.putOperator(getOperationSymbol("clear"));
    },
    
    consoleTable: function () {
        console.table(this)
    },

    calculate: function (op = this.operator, a = this.operand1, b = this.operand2) {
        this.operator = op;
        this.operand1 = a;
        this.operand2 = b;

        this.result = mathify(op, a, b).toString();
        return this.result;
    },

    isValid: function (a) {
        a = Number(a);
        const res = (typeof(a) === "number" && 
                !(isNaN(a)) &&
                !(a === Infinity)
        );
        return res;
    },

    putAnswer: function () {
        const ans = this.result;
        //operation.clear();
        strStaged.clear();
        display.putPrimary(ans);
        display.putSecondary("");
        display.putOperator("=");

    },

    putOperand: function (a) {
        if(!this.isValid(a)) {
            passError("Not Num","a");
        }
        
        if (!this.operand1) {
            this.operand1 = a.toString();
            display.putSecondary(this.operand1);
        } else {
            this.operand2 = a.toString();
        }
        this.result = "";
    },

    putOperator: function (nextOperator) {
        let ans;
        if (nextOperator === "sqroot") {
            ans = this.calculate("sqroot")
        }
        if (!this.operand1 && !this.operand2) {return;}
        
        if (this.operand1 && this.operand2) {
            ans = this.calculate();
        }        
        if (this.operand2) {
            this.clear(ans);
        }
        
        this.operator = nextOperator;
        display.putOperator(getOperationSymbol(nextOperator));
    },

}

const strStaged = {
    //isActive: true,
    value: "",

    add: function (num) {
        if (/*!this.isActive ||*/
            this.value.length >= display.maxDigits ||
            num === "." && this.value.includes(".")) {
            return;
        }
        if (this.value === null && (num === ".")) {
            num = "0.";
        }
    
        this.value = this.value.concat(num);
        display.putPrimary(this.value);
        btnClear.textContent = "C";
    },
    
    backspace: function () {
        if (/*!this.isActive ||*/
            this.value === "") {
                return;}
            
        this.value = this.value.slice(0, this.value.length - 1);
        display.putPrimary(this.value);
    },

    clear: function () {
        this.value = "";
        //this.isActive = true;
        display.putPrimary("");
    },

    submit: function () {                  //--------------------- handling 0
        if (this.value.length === 0) {return;}
        operation.putOperand(this.value);
        this.value = "";
        display.putPrimary(this.value);
        //this.isActive = false;
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


const btnsAll = document.querySelectorAll('#keypad-wrapper button');
btnsAll.forEach(function(btn) {btn.addEventListener('click', buttonClick)});


document.addEventListener('keyup',  keypress)

function buttonClick(e) {
    //setMemoryButton(e.target);
    const btn = e.target;
    if (btn.classList.contains("clear")) {
        btnClear.clear();
    } else if (errorStatus) {
        return;
    } else if (btn.classList.contains("digit")) {
        strStaged.add(btn.textContent);
    } else if (btn.classList.contains("operator")) {
        strStaged.submit();
        operation.putOperator(btn.dataset.operation);
        //strStaged.isActive = true;
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
        case "sqroot":
            strStaged.submit();
            operation.calculate(f);
            operation.putAnswer();
            break;
        case "=":
            strStaged.submit();
            operation.calculate();
            operation.putAnswer();
            break;
        case "invert":
            workingNum = workingNum * (-1);
            break;
        case "backspace":
            strStaged.backspace();
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

// Accepts ["*", "/", "clear", "equal", "error"]
// Returns symbol for display
function getOperationSymbol(op) {
    switch(op){
        case "*":
            return "x";
            break;
        case "/":
            return String.fromCharCode(247);
            break;
        case "sqroot":
            return "="
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
    let athing;
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
        case "sqroot":
            let n;    
            if (strStaged.value) {
                n= strStaged.value
            } else if (operation.result) {
                n = operation.result;
            } else if (operation.operand2) {
                n = operation.operand2; //----------------------change to this.op... if this code becomes part of operation{}
            } else {
                n = operation.operand1;
                operation.operand2 = operation.operand1;
            }
            ans = Math.sqrt(a);
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
    if (true/*strStaged.isActive*/) {display.memIndic.textContent = "A"}
    else {display.memIndic.textContent = ""}
    return;
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


function test (a) {
    if (a) {
        return true;
    } else {
        return false;
    }
}
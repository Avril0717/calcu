let display = document.getElementById('display');
let currentNumber = '0';
let previousNumber = null;
let operator = null;
let waitingForNumber = false;
let lastOperand = null;

function updateDisplay() {
    display.value = currentNumber;
}

function showError() {
    display.value = 'Error';
    display.classList.add('error');
    currentNumber = '0';
    previousNumber = null;
    operator = null;
    waitingForNumber = false;
    lastOperand = null;

    setTimeout(() => {
        display.classList.remove('error');
    }, 600);
}

function inputNumber(num) {
    if (display.value === 'Error') {
        clearDisplay();
    }

    if (waitingForNumber) {
        currentNumber = num;
        waitingForNumber = false;
    } else {
        currentNumber = currentNumber === '0' ? num : currentNumber + num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (display.value === 'Error') {
        clearDisplay();
    }

    if (waitingForNumber) {
        currentNumber = '0.';
        waitingForNumber = false;
    } else if (currentNumber.indexOf('.') === -1) {
        currentNumber += '.';
    }
    updateDisplay();
}

function inputOperator(op) {
    if (display.value === 'Error') return;

    if (operator === op && !waitingForNumber && lastOperand !== null) {
        let current = parseFloat(currentNumber);
        let operand = parseFloat(lastOperand);
        let result;

        if (isNaN(current) || isNaN(operand)) {
            showError();
            return;
        }

        switch (operator) {
            case '+': result = current + operand; break;
            case '-': result = current - operand; break;
            case '*': result = current * operand; break;
            case '/':
                if (operand === 0) {
                    showError();
                    return;
                }
                result = current / operand;
                break;
            case '%':
                result = (current * operand) / 100;
                break;
            default: return;
        }

        if (!isFinite(result)) {
            showError();
            return;
        }

        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(10));
        }

        currentNumber = result.toString();
        updateDisplay();
        return;
    }

    if (operator !== null && !waitingForNumber) {
        calculate();
        if (display.value === 'Error') return;
    }

    if (!waitingForNumber) {
        lastOperand = currentNumber;
    }

    previousNumber = currentNumber;
    operator = op;
    waitingForNumber = true;
}

function calculate() {
    if (operator === null || waitingForNumber) return;

    let prev = parseFloat(previousNumber);
    let current = parseFloat(currentNumber);
    let result;

    if (isNaN(prev) || isNaN(current)) {
        showError();
        return;
    }

    lastOperand = currentNumber;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/':
            if (current === 0) {
                showError();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = (prev * current) / 100;
            break;
        default: return;
    }

    if (!isFinite(result)) {
        showError();
        return;
    }

    if (result % 1 !== 0) {
        result = parseFloat(result.toFixed(10));
    }

    currentNumber = result.toString();
    operator = null;
    previousNumber = null;
    waitingForNumber = true;
    updateDisplay();
}

function clearDisplay() {
    currentNumber = '0';
    previousNumber = null;
    operator = null;
    waitingForNumber = false;
    lastOperand = null;
    updateDisplay();
}

function clearEntry() {
    currentNumber = '0';
    updateDisplay();
}

// Soporte para teclado mejorado
document.addEventListener('keydown', function(event) {
    if (['/', 'Enter', '='].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key >= '0' && event.key <= '9') {
        inputNumber(event.key);
    } else if (event.key === '.') {
        inputDecimal();
    } else if (event.key === '+') {
        inputOperator('+');
    } else if (event.key === '-') {
        inputOperator('-');
    } else if (event.key === '*') {
        inputOperator('*');
    } else if (event.key === '/') {
        inputOperator('/');
    } else if (event.key === '%') {
        inputOperator('%');
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        clearEntry();
    }
});

// Vibración en dispositivos móviles
if ('vibrate' in navigator) {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            navigator.vibrate(10);
        });
    });
}

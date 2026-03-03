document.addEventListener("DOMContentLoaded", function() {
    const history = [];
    const maxHistory = 10;

    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const operationSelect = document.getElementById('operation');
    const resultDiv = document.getElementById('result');
    const historyList = document.getElementById('historyList');
    const calculateBtn = document.getElementById('calculateBtn');

    if (!num1Input || !num2Input || !operationSelect || !resultDiv || !historyList || !calculateBtn) {
        console.error('Не найден один из элементов калькулятора');
        return;
    }

    function checkLocalStorage() {
        try {
            localStorage.setItem('__test__', 'test');
            localStorage.removeItem('__test__');
            return true;
        } catch(e) {
            return false;
        }
    }

    function initHistory() {
        const isStorageAvailable = checkLocalStorage();

        if (isStorageAvailable) {
            try {
                const storedData = localStorage.getItem('calculatorHistory');
                if (storedData) {
                    const parsedHistory = JSON.parse(storedData);
                    history.length = 0; 
                    history.push(...parsedHistory);
                }
            } catch(e) {
                console.warn('Ошибка чтения истории из localStorage', e);
                history.length = 0;
            }
        }
        updateHistoryUI();
    }

    function calculate() {
        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);
        const operation = operationSelect.value;

        resultDiv.classList.remove('result--ok', 'result--error');

        if (isNaN(num1) || isNaN(num2)) {
            resultDiv.textContent = 'Введите корректные числа!';
            resultDiv.classList.add('result--error');
            return;
        }

        let res;
        switch (operation) {
            case '+': res = num1 + num2; break;
            case '-': res = num1 - num2; break;
            case '*': res = num1 * num2; break;
            case '/':
                if (num2 === 0) {
                    resultDiv.textContent = 'Деление на 0 невозможно!';
                    resultDiv.classList.add('result--error');
                    return;
                }
                res = num1 / num2;
                break;
            default: return;
        }

        const expression = `${num1} ${operation} ${num2} = ${res}`;
        resultDiv.textContent = expression;
        resultDiv.classList.add('result--ok');

        history.unshift(expression);
        if (history.length > maxHistory) {
            history.pop();
        }
        updateHistoryUI();
        saveHistory();
    }

    function saveHistory() {
        if (checkLocalStorage()) {
            try {
                localStorage.setItem('calculatorHistory', JSON.stringify(history));
            } catch(e) {
                console.error('Не удалось сохранить историю', e);
            }
        }
    }

    function updateHistoryUI() {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.textContent = 'История пуста';
            return;
        }

        history.forEach(item => {
            const p = document.createElement('p');
            p.className = 'history-item';
            p.textContent = item;
            historyList.appendChild(p);
        });
    }

    calculateBtn.addEventListener('click', calculate);
    initHistory();
});

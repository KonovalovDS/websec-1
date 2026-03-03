document.addEventListener("DOMContentLoaded", function() {
    const history = [];
    const maxHistory = 10;

    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const operationSelect = document.getElementById('operation');
    const historyList = document.getElementById('historyList');
    const calculateBtn = document.getElementById('calculateBtn');

    if (!num1Input || !num2Input || !operationSelect || !historyList || !calculateBtn) {
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
                    parsedHistory.forEach(item => {
                        if (typeof item === 'string') {
                            history.push({ text: item, isError: false, timestamp: Date.now() });
                        } else {
                            history.push(item);
                        }
                    });
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

        if (isNaN(num1) || isNaN(num2)) {
            addHistoryItem('Введите корректные числа!', true);
            return;
        }

        let res;
        switch (operation) {
            case '+': res = num1 + num2; break;
            case '-': res = num1 - num2; break;
            case '*': res = num1 * num2; break;
            case '/':
                if (num2 === 0) {
                    addHistoryItem('Деление на 0 невозможно!', true);
                    return;
                }
                res = num1 / num2;
                break;
            default: return;
        }

        const expression = `${num1} ${operation} ${num2} = ${res}`;
        addHistoryItem(expression, false);
        saveHistory();
    }

    function addHistoryItem(text, isError) {
        const item = { text, isError, timestamp: Date.now() };
        history.unshift(item);
        if (history.length > maxHistory) {
            history.pop();
        }
        updateHistoryUI();
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

        history.forEach((item, index) => {
            const p = document.createElement('p');
            p.className = 'history-item';
            
            if (item.isError) {
                p.classList.add('history-item--error');
            }
            
            if (index === 0 && !item.isError) {
                p.style.color = 'var(--text-color)';
                p.style.fontWeight = 'bold';
            }
            
            p.textContent = item.text;
            historyList.appendChild(p);
        });
    }

    calculateBtn.addEventListener('click', calculate);
    initHistory();
});

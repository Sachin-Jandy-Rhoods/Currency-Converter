let selects = document.querySelectorAll("select");
let btn = document.getElementById("btn");
let input = document.getElementById("input");
let loader = document.getElementById("loader");
let historyTable = document.getElementById("historyTable").getElementsByTagName('tbody')[0];

// Function to fetch and display currencies
fetch('https://api.frankfurter.app/currencies')
    .then(res => res.json())
    .then(res => populateCurrencies(res));

// Populate currency options
function populateCurrencies(res) {
    let currency = Object.entries(res);
    for (let curr of currency) {
        let opt = `<option value="${curr[0]}">${curr[0]}</option>`;
        selects[0].innerHTML += opt;
        selects[1].innerHTML += opt;
    }
}

// Convert button click event
btn.addEventListener('click', () => {
    let curr1 = selects[0].value;
    let curr2 = selects[1].value;
    let inputVal = input.value;
    if (curr1 === curr2) {
        alert("Currencies should not be the same.");
    } else {
        convert(curr1, curr2, inputVal);
    }
});

// Convert function
function convert(curr1, curr2, inputVal) {
    const host = 'api.frankfurter.app';
    loader.style.display = 'block'; // Show the loader
    fetch(`https://${host}/latest?amount=${inputVal}&from=${curr1}&to=${curr2}`)
        .then(resp => resp.json())
        .then((data) => {
            let convertedAmount = Object.values(data.rates)[0];
            document.getElementById('result').value = convertedAmount;
            addToHistory(curr1, curr2, inputVal, convertedAmount);
        }).catch(err => alert(err))
        .finally(() => {
            loader.style.display = 'none'; // Hide the loader
        });
}

// Function to add conversion record to history
function addToHistory(from, to, amount, convertedAmount) {
    let newRow = historyTable.insertRow();
    let fromCell = newRow.insertCell(0);
    let toCell = newRow.insertCell(1);
    let amountCell = newRow.insertCell(2);
    let convertedAmountCell = newRow.insertCell(3);
    let dateCell = newRow.insertCell(4);

    fromCell.textContent = from;
    toCell.textContent = to;
    amountCell.textContent = amount;
    convertedAmountCell.textContent = convertedAmount;
    dateCell.textContent = new Date().toLocaleString();
}

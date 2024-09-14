if (document.getElementById('loan-form')) {

    document.addEventListener('DOMContentLoaded', loadLoanHistory);


    const currencyRates = {
        USD: 1.10, 
        GBP: 0.85, 
        JPY: 130.20, 
        EUR: 1.00 
    };


    document.getElementById('loan-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const interest = parseFloat(document.getElementById('interest').value);
        const years = parseInt(document.getElementById('years').value);

        if (isNaN(amount) || isNaN(interest) || isNaN(years) || amount <= 0 || interest <= 0 || years <= 0) {
            alert('Por favor, introduce valores válidos');
            return;
        }

        const monthlyInterestRate = (interest / 100) / 12;
        const numberOfPayments = years * 12;
        let monthlyPayment = 0;

        if (monthlyInterestRate !== 0) {
            const x = Math.pow(1 + monthlyInterestRate, numberOfPayments);
            monthlyPayment = (amount * x * monthlyInterestRate) / (x - 1);
        } else {
            monthlyPayment = amount / numberOfPayments;
        }

        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - amount;

        document.getElementById('monthly-payment').innerText = `Pago mensual: €${monthlyPayment.toFixed(2)}`;
        document.getElementById('total-payment').innerText = `Pago total: €${totalPayment.toFixed(2)}`;
        document.getElementById('total-interest').innerText = `Interés total: €${totalInterest.toFixed(2)}`;

        saveLoanCalculation(amount, interest, years, monthlyPayment, totalPayment, totalInterest);
    });


    function saveLoanCalculation(amount, interest, years, monthlyPayment, totalPayment, totalInterest) {
        const loanHistory = JSON.parse(localStorage.getItem('loanHistory')) || [];

        const newEntry = {
            amount: amount,
            interest: interest,
            years: years,
            monthlyPayment: monthlyPayment.toFixed(2),
            totalPayment: totalPayment.toFixed(2),
            totalInterest: totalInterest.toFixed(2)
        };

        loanHistory.push(newEntry);
        localStorage.setItem('loanHistory', JSON.stringify(loanHistory));

        updateLoanHistory();
    }


    function loadLoanHistory() {
        const loanHistory = JSON.parse(localStorage.getItem('loanHistory')) || [];
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';

        loanHistory.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `Préstamo de €${entry.amount}, ${entry.interest}% a ${entry.years} años: Pago mensual: €${entry.monthlyPayment}, Pago total: €${entry.totalPayment}, Interés total: €${entry.totalInterest}`;
            historyList.appendChild(li);
        });
    }


    document.getElementById('convert-button').addEventListener('click', function() {
        const selectedCurrency = document.getElementById('currency').value;
        const totalPayment = parseFloat(document.getElementById('total-payment').innerText.split('€')[1]);

        if (isNaN(totalPayment)) {
            alert('Primero realiza un cálculo de préstamo.');
            return;
        }

        const conversionRate = currencyRates[selectedCurrency];
        const convertedValue = totalPayment * conversionRate;

        document.getElementById('converted-value').innerText = `Total en ${selectedCurrency}: ${convertedValue.toFixed(2)} ${selectedCurrency}`;
    });
}


if (document.getElementById('contact-form')) {

    document.addEventListener('DOMContentLoaded', function() {
        const savedName = localStorage.getItem('userName');
        const savedEmail = localStorage.getItem('userEmail');

        if (savedName) {
            document.getElementById('name').value = savedName;
        }

        if (savedEmail) {
            document.getElementById('email').value = savedEmail;
        }
    });

    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);

        alert('¡Gracias por contactarnos! Hemos guardado tus datos.');
    });
}

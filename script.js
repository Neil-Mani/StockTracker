let chart;

async function getStockData() {
    const apiKey = 'R70U6YUYG8A32QBA';
    const symbol = document.getElementById('stock-symbol').value;

    if (!symbol) {
        alert('Please enter a stock symbol.');
        return;
    }

    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data['Error Message']) {
            alert('Invalid stock symbol. Please try again.');
            return;
        }

        const timeSeries = data['Time Series (5min)'];
        const times = Object.keys(timeSeries).reverse();
        const prices = times.map(time => timeSeries[time]['4. close']);

        displayStockData(symbol, timeSeries[times[0]], times[0]);
        displayChart(symbol, times, prices);
    } catch (error) {
        alert('Error fetching stock data. Please try again later.');
        console.error('Error:', error);
    }
}

function displayStockData(symbol, data, time) {
    const stockInfoDiv = document.getElementById('stock-info');
    stockInfoDiv.innerHTML = `
        <h2>${symbol.toUpperCase()}</h2>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Open:</strong> $${data['1. open']}</p>
        <p><strong>High:</strong> $${data['2. high']}</p>
        <p><strong>Low:</strong> $${data['3. low']}</p>
        <p><strong>Close:</strong> $${data['4. close']}</p>
        <p><strong>Volume:</strong> ${data['5. volume']}</p>
    `;
}

function displayChart(symbol, times, prices) {
    const ctx = document.getElementById('stock-chart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: `${symbol.toUpperCase()} Stock Price`,
                data: prices,
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderColor: 'rgba(0, 123, 255, 1)',
                fill: true,
                tension: 0.1,
            }]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });
}

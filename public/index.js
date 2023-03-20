async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    let response = await fetch("https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=7197f659335a4d8297159cfd119734b3")
    let result = await response.json()

    const { GME, MSFT, DIS, BNTX } = mockData;

    const stocks = [GME, MSFT, DIS, BNTX];

    function getColor(stock){
        if(stock === "GME"){
            return 'rgba(61, 161, 61, 0.7)'
        }
        if(stock === "MSFT"){
            return 'rgba(209, 4, 25, 0.7)'
        }
        if(stock === "DIS"){
            return 'rgba(18, 4, 209, 0.7)'
        }
        if(stock === "BNTX"){
            return 'rgba(166, 43, 158, 0.7)'
        }
    }    

    stocks.forEach(stock => stock.values.reverse())

    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map( value => value.datetime),
            datasets: stocks.map(stock =>({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))

        },
    })                                                 

    function getHighest(values){
        let highest = 0
        values.forEach(value => {
            if (parseFloat(value.high) > highest){
                highest = value.high
            }
        })
        return highest
    }

    const highestNums = stocks.map(stock => getHighest(stock.values))
    const highestStockName = highestNums.map(Number)
    const maxStock = Math.max(...highestStockName)
    

    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: maxStock,
                data: highestNums,
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
            }]

        },
        options: {
            indexAxis: 'y'
        }
    }) 

    function getAverage(values) {
        let total = 0
        values.forEach(value => {
            total += parseFloat(value.high)
        })
        return total / values.length
    }

    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Average',
                data: stocks.map(stock => getAverage(stock.values)),
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
            }]
        },
    })


}

main()
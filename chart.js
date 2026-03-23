let chart;
let candleSeries;

function initChart() {
  chart = LightweightCharts.createChart(document.getElementById("chart"), {
    width: window.innerWidth,
    height: 300
  });

  candleSeries = chart.addCandlestickSeries();
}

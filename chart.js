let chart;
let candleSeries;

function initChart() {
  chart = LightweightCharts.createChart(
    document.getElementById("chart"),
    {
      width: document.getElementById("chart").clientWidth,
      height: 300
    }
  );

  candleSeries = chart.addSeries(
    LightweightCharts.CandlestickSeries
  );
}

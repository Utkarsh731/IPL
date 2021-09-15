/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */
// Themes begin
am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
// Create chart instance
var piechart = am4core.create("piechartdiv", am4charts.PieChart);
let Pietitle = piechart.titles.create();
Pietitle.text = "Toss Wins";
Pietitle.fontSize = 25;

Pietitle.marginBottom = 30;
// Add data
piechart.data = data;

// Add and configure Series
var pieSeries = piechart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "wins";
pieSeries.dataFields.category = "team";
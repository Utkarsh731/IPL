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
am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4charts.XYChart);
chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
let title = chart.titles.create();
title.text = "Team Wins";
title.fontSize = 25;

title.marginBottom = 30;
chart.data = data;
chart.padding(40, 40, 0, 0);
chart.maskBullets = false; // allow bullets to go out of plot area

var text = chart.plotContainer.createChild(am4core.Label);
text.text = "Drag column bullet to change its value";
text.y = 92;
text.x = am4core.percent(100);
text.horizontalCenter = "right";
text.zIndex = 100;
text.fillOpacity = 0.7;

// category axis
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "team";
categoryAxis.renderer.grid.template.disabled = true;
categoryAxis.renderer.minGridDistance = 50;


// value axis
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
// we set fixed min/max and strictMinMax to true, as otherwise value axis will adjust min/max while dragging and it won't look smooth
valueAxis.strictMinMax = true;
valueAxis.min = 0;
valueAxis.max = 4;
valueAxis.renderer.minWidth = 60;

// series
var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.categoryX = "team";
series.dataFields.valueY = "wins";
series.tooltip.pointerOrientation = "vertical";
series.tooltip.dy = -8;
series.sequencedInterpolation = true;
series.defaultState.interpolationDuration = 1500;
series.columns.template.strokeOpacity = 0;

// label bullet
var labelBullet = new am4charts.LabelBullet();
series.bullets.push(labelBullet);
labelBullet.label.text = "{valueY.value.formatNumber('#.')}";
labelBullet.strokeOpacity = 0;
labelBullet.stroke = am4core.color("#dadada");
labelBullet.dy = -20;


// series bullet
var bullet = series.bullets.create();
bullet.stroke = am4core.color("#ffffff");
bullet.strokeWidth = 3;
bullet.opacity = 1; // initially invisible
bullet.defaultState.properties.opacity = 1;
// resize cursor when over
bullet.cursorOverStyle = am4core.MouseCursorStyle.verticalResize;
bullet.draggable = true;

// create hover state
var hoverState = bullet.states.create("hover");
hoverState.properties.opacity = 1; // visible when hovered

// add circle sprite to bullet
var circle = bullet.createChild(am4core.Circle);
circle.radius = 8;

// while dragging
bullet.events.on("drag", event => {
  handleDrag(event);
});

bullet.events.on("dragstop", event => {
  handleDrag(event);
  var dataItem = event.target.dataItem;
  dataItem.column.isHover = false;
  event.target.isHover = false;
});

function handleDrag(event) {
  var dataItem = event.target.dataItem;
  // convert coordinate to value
  var value = valueAxis.yToValue(event.target.pixelY);
  // set new value
  dataItem.valueY = value;
  // make column hover
  dataItem.column.isHover = true;
  // hide tooltip not to interrupt
  dataItem.column.hideTooltip(0);
  // make bullet hovered (as it might hide if mouse moves away)
  event.target.isHover = true;
}

// column template
var columnTemplate = series.columns.template;
columnTemplate.column.cornerRadiusTopLeft = 8;
columnTemplate.column.cornerRadiusTopRight = 8;
columnTemplate.column.fillOpacity = 0.8;
columnTemplate.tooltipText = "drag me";
columnTemplate.tooltipY = 0; // otherwise will point to middle of the column

// hover state
var columnHoverState = columnTemplate.column.states.create("hover");
columnHoverState.properties.fillOpacity = 1;
// you can change any property on hover state and it will be animated
columnHoverState.properties.cornerRadiusTopLeft = 35;
columnHoverState.properties.cornerRadiusTopRight = 35;

// show bullet when hovered
columnTemplate.events.on("over", event => {
  var dataItem = event.target.dataItem;
  var itemBullet = dataItem.bullets.getKey(bullet.uid);
  itemBullet.isHover = true;
});

// hide bullet when mouse is out
columnTemplate.events.on("out", event => {
  var dataItem = event.target.dataItem;
  var itemBullet = dataItem.bullets.getKey(bullet.uid);
  itemBullet.isHover = false;
});

// start dragging bullet even if we hit on column not just a bullet, this will make it more friendly for touch devices
columnTemplate.events.on("down", event => {
  var dataItem = event.target.dataItem;
  var itemBullet = dataItem.bullets.getKey(bullet.uid);
  itemBullet.dragStart(event.pointer);
});

// when columns position changes, adjust minX/maxX of bullets so that we could only dragg vertically
columnTemplate.events.on("positionchanged", event => {
  var dataItem = event.target.dataItem;
  var itemBullet = dataItem.bullets.getKey(bullet.uid);

  var column = dataItem.column;
  itemBullet.minX = column.pixelX + column.pixelWidth / 2;
  itemBullet.maxX = itemBullet.minX;
  itemBullet.minY = 0;
  itemBullet.maxY = chart.seriesContainer.pixelHeight;
});

// as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
columnTemplate.adapter.add("fill", (fill, target) => {
  return chart.colors.getIndex(target.dataItem.index).saturate(0.3);
});

bullet.adapter.add("fill", (fill, target) => {
  return chart.colors.getIndex(target.dataItem.index).saturate(0.3);
});

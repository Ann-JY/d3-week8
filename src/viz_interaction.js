import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");
// const g = svg.append("g"); // group

let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
const margin = { top: 20, right: 10, bottom: 100, left: 10 };

// scale
const xScale = d3
  .scaleBand()
  .range([margin.left, width - margin.right])
  .paddingInner(0.1);

const colorScale = d3
  .scaleSequential()
  // .domain(d3.extent(data, (d) => d.avg).reverse())
  // .domain([0.8, -0.8])
  // .interpolator(d3.interpolateRdYlBu)
  .domain([-0.8, 0.8])
  .interpolator(d3.interpolatePuOr);

const xLegendScale = d3
  .scaleBand()
  .range([width / 2 - 140, width / 2 + 140])
  .paddingInner(0.1);

// svg elements
let rects, legendRects, legendLabels, unit;
let xAxis;

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
let data = [];
let legendData;

d3.csv("data/temperature-anomaly-data.csv")
  .then((raw_data) => {
    // data parsing
    data = raw_data
      .filter((d) => d.Entity === "Global")
      .map((d) => {
        const obj = {};
        obj.year = parseInt(d.Year);
        obj.avg =
          +d["Global average temperature anomaly relative to 1961-1990"];
        return obj;
      });

    legendData = d3.range(
      d3.min(data, (d) => d.avg),
      d3.max(data, (d) => d.avg),
      0.2
    );

    //  scale updated
    xScale.domain(data.map((d) => d.year));
    xLegendScale.domain(legendData.map((d, i) => i));

    xAxis = d3
      .axisBottom(xScale)
      .tickValues(xScale.domain().filter((d, i) => !(i % 10)));

    // heatmap
    rects = svg
      .selectAll("rects")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.year))
      .attr("y", margin.top)
      .attr("width", xScale.bandwidth())
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", (d) => colorScale(d.avg));

    // legend
    legendRects = svg
      .selectAll("legend-rects")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xLegendScale(i))
      .attr("y", height - margin.bottom + 50)
      .attr("width", xLegendScale.bandwidth())
      .attr("height", 20)
      .attr("fill", (d) => colorScale(d));

    legendLabels = svg
      .selectAll("legend-labels")
      .data(legendData)
      .enter()
      .append("text")
      .attr("x", (d, i) => xLegendScale(i) + xLegendScale.bandwidth() / 2)
      .attr("y", height - margin.bottom + 50 + 15)
      .text((d) => d3.format(".1f")(d))
      .style("fill", (d) => (Math.abs(d) >= 0.5 ? "#fff" : "#111"))
      .attr("class", "legend-labels");

    // unit
    unit = svg
      .append("text")
      .text("(°C)")
      .attr("x", xLegendScale(legendData.length - 1) + 60)
      .attr("y", height - margin.bottom + 50 + 15)
      .attr("class", "legend-labels");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis")
      .call(xAxis);
  })
  .catch((error) => {
    console.error("Error loading CSV data: ", error);
  });

////////////////////////////////////////////////////////////////////
////////////////////////////  Resize  //////////////////////////////
window.addEventListener("resize", () => {
  //  width, height updated
  width = parseInt(d3.select("#svg-container").style("width"));
  height = parseInt(d3.select("#svg-container").style("height"));

  //  scale updated
  xScale.range([margin.left, width - margin.right]);
  xLegendScale.range([width / 2 - 140, width / 2 + 140]);

  // heatmap
  rects
    .attr("x", (d) => xScale(d.year))
    .attr("y", margin.top)
    .attr("width", xScale.bandwidth())
    .attr("height", height - margin.top - margin.bottom);

  // legend
  legendRects
    .attr("x", (d, i) => xLegendScale(i))
    .attr("y", height - margin.bottom + 50)
    .attr("width", xLegendScale.bandwidth())
    .attr("height", 20);

  legendLabels
    .attr("x", (d, i) => xLegendScale(i) + xLegendScale.bandwidth() / 2)
    .attr("y", height - margin.bottom + 50 + 15);

  //  unit
  unit
    .attr("x", xLegendScale(legendData.length - 1) + 60)
    .attr("y", height - margin.bottom + 50 + 15);

  //  axis updated
  d3.select(".x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);
});

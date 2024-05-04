import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////

// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");

let width = parseInt(d3.select("#svg-container").style("width")); //svg컨테이너의 너비를 가지고 와라
let height = parseInt(d3.select("#svg-container").style("height"));

const margin = { top: 20, right: 10, bottom: 100, left: 10 };

// scale
const xScale = d3
  .scaleBand()
  .range([margin.left, width - margin.right])
  .paddingInner(0.1); //색 사이간격

const colorScale = d3
  .scaleSequential()
  .domain([0.8, -0.8])
  .interpolator(d3.interpolateRdBu); //그라데이션 색 설정

const xLegendScale = d3 //레전드 범위설정
  .scaleBand()
  .range([width / 2 - 140, width / 2 + 140])
  .paddingInner(0.1);

// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
// data
let data = [];
let rects;
let xAxis;
let legendRects, legendLabels;
let legendData;

d3.csv("data/temperature-anomaly-data.csv").then((raw_data) => {
  //csv파일은 이렇게 불러움
  data = raw_data //raw data에서
    .filter((d) => d.Entity === "Global") //글로벌만 필터링
    .map((d) => {
      const obj = {}; //새로운 오브젝트를 만듦
      obj.year = parseInt(d.Year); //년을 year값으로 넣고
      obj.avg = +d["Global average temperature anomaly relative to 1961-1990"]; //avg라는 키를 만들어 값을 넣어줌
      return obj; //반환을 오브젝트로 함, 괄호안에는 무조건 함수를 써야해서 반환으로 데이터 받기
    });

  /////////////////legend////////////////
  legendData = d3.range(
    //배열을 만듦
    d3.min(data, (d) => d.avg),
    d3.max(data, (d) => d.avg), //가장 작은 값과 가장 큰 값 사이의 간격이 0.2
    0.2
  );
  ////////////////////////scale/////////////////////////
  xScale.domain(data.map((d) => d.year)); //year 하나하나의 값이 도메인으로 들어감
  xLegendScale.domain(legendData.map((d, i) => i));
  //d는 데이터 i는 순서
  //도메인에 순서데이터값 넣어주기
  //앞에 설정한 레전드 데이터 넣어줌

  xAxis = d3
    .axisBottom(xScale)
    .tickValues(xScale.domain().filter((d, i) => !(i % 10)));
  //연도가 도메인으로 들어갔으니까 10으로 나눈 나머지 값이 0인 값(false)!만 반환
  // .tickValues(xScale.domain().filter((d) => d % 10));

  /////////////////////heatmap//////////////////////////////
  rects = svg
    .selectAll("rects")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", margin.top + 50)
    .attr("width", xScale.bandwidth)
    .attr("height", 100)
    .attr("fill", (d) => colorScale(d.avg));

  svg
    .append("g")
    .attr("transform", `translate(0, ${margin.top + 350 + 100 + 20})`)
    .attr("class", "x-axis")
    .call(xAxis);

  /////////////////////////////lgend//////////////////////////////
  legendRects = svg
    .selectAll("legend-labels")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xLegendScale(i))
    .attr("y", margin.top)
    .attr("width", xLegendScale.bandwidth())
    .attr("height", 20)
    .attr("fill", (d) => colorScale(d));

  legendLabels = svg
    .selectAll("legned-lables")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", (d, i) => xLegendScale(i) + xLegendScale.bandwidth() / 2)
    .attr("y", margin.top + 15)
    .text((d) => d3.format("0.1f")(d))
    .attr("class", "legend-labels")
    .style("fill", (d) => (d >= 0.5 ? "#fff" : "#111")); //d라는 값이 0.5보다 크면 fff, 아니면 111

  //   legendRects = svg.selectAll("legend-rects").data;

  // svg
  //   .append("text")
  //   .attr("text-anchor", "middle")
  //   .attr("x", width / 2 + 2)
  //   .attr("y", margin.top + 122)
  //   .text("Global")
  //   .attr("class", "heatmap-label2");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", margin.top + 120)
    .text("Global")
    .attr("class", "heatmap-label");
});

//222222222222222222222222222222222222222222222222222222222222222//
let data2 = [];
let rects2;
let xAxis2;
d3.csv("data/temperature-anomaly-data.csv").then((raw_data) => {
  data2 = raw_data
    .filter((d) => d.Entity === "Northern hemisphere")
    .map((d) => {
      const obj = {};
      obj.year = parseInt(d.Year);
      obj.avg = +d["Global average temperature anomaly relative to 1961-1990"];
      return obj;
    });

  const xScale2 = d3
    .scaleBand()
    .range([margin.left, width - margin.right])
    .paddingInner(0.1);

  xScale2.domain(data2.map((d) => d.year));

  xAxis2 = d3
    .axisBottom(xScale2)
    .tickValues(xScale2.domain().filter((d) => !(d % 10)));

  rects2 = svg
    .selectAll("rects2")
    .data(data2)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale2(d.year))
    .attr("y", margin.top + 200)
    .attr("width", xScale2.bandwidth)
    .attr("height", 100)
    .attr("fill", (d) => colorScale(d.avg));

  // svg
  //   .append("g")
  //   .attr("transform", `translate(0, ${margin.top + 100 + 200})`)
  //   .attr("class", "x-axis")
  //   .call(xAxis2);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", margin.top + 270)
    .text("Northern hemisphere")
    .attr("class", "heatmap-label");
});

//33333333333333333333333333333333333333333333333333333333333333//
let data3 = [];
let rects3;
let xAxis3;

d3.csv("data/temperature-anomaly-data.csv").then((raw_data) => {
  data3 = raw_data
    .filter((d) => d.Entity === "Southern hemisphere")
    .map((d) => {
      const obj = {};
      obj.year = parseInt(d.Year);
      obj.avg = +d["Global average temperature anomaly relative to 1961-1990"];
      return obj;
    });

  const xScale3 = d3
    .scaleBand()
    .range([margin.left, width - margin.right])
    .paddingInner(0.1);

  xScale3.domain(data3.map((d) => d.year));

  xAxis3 = d3
    .axisBottom(xScale3)
    .tickValues(xScale3.domain().filter((d) => !(d % 10)));

  rects3 = svg
    .selectAll("rects3")
    .data(data3)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale3(d.year))
    .attr("y", margin.top + 350)
    .attr("width", xScale3.bandwidth)
    .attr("height", 100)
    .attr("fill", (d) => colorScale(d.avg));

  // svg
  //   .append("g")
  //   .attr("transform", `translate(0, ${margin.top + 350 + 100 + 20})`)
  //   .attr("class", "x-axis")
  //   .call(xAxis3);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", margin.top + 420)
    .text("Southern hemisphere")
    .attr("class", "heatmap-label");
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
    .attr("y", margin.top + 50)
    .attr("width", xScale.bandwidth())
    .attr("height", 100);

  rects2
    .attr("x", (d) => xScale(d.year))
    .attr("y", margin.top + 200)
    .attr("width", xScale.bandwidth())
    .attr("height", 100);

  rects3
    .attr("x", (d) => xScale(d.year))
    .attr("y", margin.top + 350)
    .attr("width", xScale.bandwidth())
    .attr("height", 100);

  // legend
  legendRects
    .attr("x", (d, i) => xLegendScale(i))
    .attr("y", margin.top)
    .attr("width", xLegendScale.bandwidth())
    .attr("height", 20);

  legendLabels
    .attr("x", (d, i) => xLegendScale(i) + xLegendScale.bandwidth() / 2)
    .attr("y", margin.top + 15);

  // unit
  //   .attr("x", xLegendScale(legendData.length - 1) + 60)
  //   .attr("y", height - margin.bottom + 50 + 15);

  d3.select(".x-axis")
    .attr("transform", `translate(0,${margin.top + 350 + 100 + 20})`)
    .call(xAxis);

  // svg
  // .append("g")
  // .attr("transform", `translate(0, ${margin.top + 350 + 100 + 20})`)
  // .attr("class", "x-axis")
  // .call(xAxis);

  svg
    .selectAll(".heatmap-label")
    .attr("x", width / 2)
    .attr("y", (d, i) => margin.top + [120, 270, 420][i])
    .text(
      (d, i) => ["Global", "Northern hemisphere", "Southern hemisphere"][i]
    );
});

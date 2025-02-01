"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const RatingDistributionChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      setData(
        movies.map((movie) => ({
          rating: parseFloat(movie.RATING),
        }))
      );
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#f9f9f9");

    const xScale = d3.scaleLinear().domain([0, 10]).range([margin.left, width - margin.right]);
    const histogram = d3.bin().domain(xScale.domain()).thresholds(10)(data.map((d) => d.rating));
    const yScale = d3.scaleLinear().domain([0, d3.max(histogram, (d) => d.length) || 1]).range([height - margin.bottom, margin.top]);

    svg.selectAll("rect")
      .data(histogram)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.x0) + 1)
      .attr("y", (d) => yScale(d.length))
      .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
      .attr("height", (d) => yScale(0) - yScale(d.length))
      .attr("fill", "steelblue");

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default RatingDistributionChart;

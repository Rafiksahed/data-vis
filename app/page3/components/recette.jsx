"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const GrossByYearChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const yearlyGross = d3.rollup(
        movies,
        (v) => d3.sum(v, (movie) => parseFloat(movie.Gross) || 0),
        (movie) => movie.YEAR
      );

      const processedData = Array.from(yearlyGross, ([year, gross]) => ({
        year: parseInt(year),
        gross,
      })).sort((a, b) => a.year - b.year);

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 500;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 40, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.gross) || 1])
      .range([height - margin.bottom, margin.top]);
      svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("budget par année");
    
    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Line path
    const line = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.gross));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default GrossByYearChart;

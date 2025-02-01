"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const LineChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const yearCount = {};

      movies.forEach((movie) => {
        const year = movie.YEAR;
        if (year) {
          yearCount[year] = (yearCount[year] || 0) + 1;
        }
      });

      const processedData = Object.entries(yearCount)
        .map(([year, count]) => ({ year: +year, count }))
        .sort((a, b) => a.year - b.year); // Trier par année

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.count))
      .curve(d3.curveMonotoneX);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default LineChart;

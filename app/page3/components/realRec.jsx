"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const AverageGrossByDirector = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const directorGross = d3.rollup(
        movies,
        (v) => d3.mean(v, (movie) => parseFloat(movie.Gross) || 0),
        (movie) => movie.STARS.split("Director:")[1]?.split("|")[0]?.trim()
      );

      const processedData = Array.from(directorGross, ([director, gross]) => ({
        director,
        gross,
      }))
        .filter((d) => d.director && !isNaN(d.gross))
        .sort((a, b) => b.gross - a.gross)
        .slice(0, 10);

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 200 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.gross) || 1])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleBand()
      .domain(data.map((d) => d.director))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale));
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale));

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", (d) => yScale(d.director))
      .attr("width", (d) => xScale(d.gross) - margin.left)
      .attr("height", yScale.bandwidth())
      .attr("fill", "coral");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default AverageGrossByDirector;

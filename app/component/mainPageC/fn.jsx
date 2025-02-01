"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BarChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const processedData = movies
        .map(movie => ({ name: movie.MOVIES, rating: +movie.RATING }))
        .sort((a, b) => b.rating - a.rating) // Trier par note décroissante
        .slice(0, 10); // Garder le top 10

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 150 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.rating)])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => yScale(d.name))
      .attr("width", d => xScale(d.rating) - margin.left)
      .attr("height", yScale.bandwidth())
      .attr("fill", "teal");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;

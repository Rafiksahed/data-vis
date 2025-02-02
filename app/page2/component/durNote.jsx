"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const RuntimeRatingScatterPlot = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      setData(
        movies
          .filter((movie) => movie.RunTime && movie.RATING)
          .map((movie) => ({
            runtime: parseFloat(movie.RunTime),
            rating: parseFloat(movie.RATING),
            title: movie.MOVIES,
          }))
      );
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 500;
    const height = 400;
    const margin = { top: 55, right: 30, bottom: 40, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
     

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.runtime) || 1])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 10]) // Les notes vont de 0 à 10
      .range([height - margin.bottom, margin.top]);
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("Note par runtime scatter Plot");
    
    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(10).tickFormat((d) => `${d}`));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Points du scatter plot
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.runtime))
      .attr("cy", (d) => yScale(d.rating))
      .attr("r", 5)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7)
      .append("title") // Affiche le titre du film au survol
      .text((d) => `${d.title} - ${d.runtime} min`);

    // Légende des axes
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .style("text-anchor", "middle")
      .text("Durée (minutes)");

    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", 15)
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Note (Rating)");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default RuntimeRatingScatterPlot;

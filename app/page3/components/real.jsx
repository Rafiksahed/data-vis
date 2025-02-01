"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const MoviesByDirectorChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const directorCounts = d3.rollup(
        movies,
        (v) => v.length,
        (movie) => movie.STARS.split("Director:")[1]?.split("|")[0]?.trim()
      );

      const processedData = Array.from(directorCounts, ([director, count]) => ({
        director,
        count,
      })).filter((d) => d.director).slice(0, 10); // Limiter aux 10 meilleurs réalisateurs

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value((d) => d.count)(data);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll("path")
      .data(pie)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i.toString()));

    svg.selectAll("text")
      .data(pie)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .text((d) => d.data.director)
      .style("font-size", "10px");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default MoviesByDirectorChart;

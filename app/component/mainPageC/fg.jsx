"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PieChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const genreCount = {};

      movies.forEach((movie) => {
        if (movie.GENRE) {
          movie.GENRE.split(",").forEach((genre) => {
            const trimmedGenre = genre.trim();
            genreCount[trimmedGenre] = (genreCount[trimmedGenre] || 0) + 1;
          });
        }
      });

      // Trier les genres par fréquence décroissante
      const sortedGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1]);

      // Séparer les 10 premiers et regrouper les autres
      const topGenres = sortedGenres.slice(0, 9);
      const otherCount = sortedGenres.slice(10).reduce((acc, [, count]) => acc + count, 0);

      const processedData = [
        ...topGenres.map(([genre, count]) => ({ genre, count })),
        { genre: "Autre", count: otherCount }
      ];

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    // Configurer le SVG
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.genre));

    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "white")
      .text(d => d.data.genre);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;

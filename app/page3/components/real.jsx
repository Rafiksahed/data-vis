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
      }))
        .filter((d) => d.director)
        .slice(0, 10); // Limiter aux 10 meilleurs réalisateurs

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 350;
    const height = 350;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Nettoyer le contenu précédent

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value((d) => d.count);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius); // Donut effect

    const arcs = g
      .selectAll("g")
      .data(pie(data))
      .enter()
      .append("g");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.director))
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

    // Ajouter des noms complets avec des sauts de ligne automatiques
    arcs.append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "8px")
      .each(function (d) {
        const text = d3.select(this);
        const words = d.data.director.split(" ");
        let line = [];
        let tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .attr("dy", "0em");

        words.forEach((word, index) => {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > 70) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", 0)
              .attr("y", 0)
              .attr("dy", `${index === 0 ? 1.1 : 1.2}em`)
              .text(word);
          }
        });
      });

    // Titre au centre du Donut Chart
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("dy", "-0.5em")
      .text("Réalisateurs");

    // Sous-titre (facultatif)
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("dy", "1em")
      .attr("fill", "#666")
      .text("Top 10");
  }, [data]);

  return <svg ref={svgRef} width={400} height={400}></svg>;
};

export default MoviesByDirectorChart;

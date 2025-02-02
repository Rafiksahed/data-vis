"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const AvgRuntimeByGenre = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const genreRuntime = {};

      movies.forEach((movie) => {
        if (movie.GENRE && movie.RunTime) {
          const runtime = parseInt(movie.RunTime, 10);
          if (!isNaN(runtime)) {
            movie.GENRE.split(",").forEach((genre) => {
              const trimmedGenre = genre.trim();
              if (!genreRuntime[trimmedGenre]) genreRuntime[trimmedGenre] = [];
              genreRuntime[trimmedGenre].push(runtime);
            });
          }
        }
      });

      const processedData = Object.entries(genreRuntime)
        .map(([genre, runtimes]) => {
          const q1 = d3.quantile(runtimes, 0.25);
          const median = d3.quantile(runtimes, 0.5);
          const q3 = d3.quantile(runtimes, 0.75);
          const iqr = q3 - q1;
          const lowerWhisker = Math.max(d3.min(runtimes), q1 - 1.5 * iqr);
          const upperWhisker = Math.min(d3.max(runtimes), q3 + 1.5 * iqr);
          return {
            genre,
            q1,
            median,
            q3,
            lowerWhisker,
            upperWhisker,
          };
        })
        .sort((a, b) => b.median - a.median) // Trier par médiane
        .slice(0, 10); // Garder uniquement le top 10 des genres

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 500;
    const height = 350;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // Nettoyer avant de dessiner

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.genre))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.lowerWhisker), d3.max(data, d => d.upperWhisker)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "middle");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Ajouter les rectangles pour le Box Plot
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.genre))
      .attr("y", d => yScale(d.q3))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(d.q1) - yScale(d.q3))
      .attr("fill", "teal");

    // Ajouter la ligne médiane
    svg.selectAll("line.median")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.genre))
      .attr("x2", d => xScale(d.genre) + xScale.bandwidth())
      .attr("y1", d => yScale(d.median))
      .attr("y2", d => yScale(d.median))
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Ajouter les moustaches (whiskers)
    svg.selectAll("line.whisker")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.genre) + xScale.bandwidth() / 2)
      .attr("x2", d => xScale(d.genre) + xScale.bandwidth() / 2)
      .attr("y1", d => yScale(d.lowerWhisker))
      .attr("y2", d => yScale(d.upperWhisker))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

  }, [data]);

  return (
    <div>
      <h3>Top 10 genres - Durée moyenne des films (Box Plot)</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AvgRuntimeByGenre;

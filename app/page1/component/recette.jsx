"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const AvgRevenueByGenre = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const genreRevenue = {};

      movies.forEach((movie) => {
        if (movie.GENRE && movie.Gross) {
          const revenue = parseFloat(movie.Gross.replace(/[^0-9.]/g, "")); // Nettoyage des caractères non numériques
          if (!isNaN(revenue)) {
            movie.GENRE.split(",").forEach((genre) => {
              const trimmedGenre = genre.trim();
              if (!genreRevenue[trimmedGenre]) genreRevenue[trimmedGenre] = { sum: 0, count: 0 };
              genreRevenue[trimmedGenre].sum += revenue; // Utilise directement la valeur de 'GROSS'
              genreRevenue[trimmedGenre].count += 1;
            });
          }
        }
      });

      const processedData = Object.entries(genreRevenue)
        .map(([genre, { sum, count }]) => ({ genre, avgRevenue: sum / count }))
        .sort((a, b) => b.avgRevenue - a.avgRevenue)
        .slice(0, 10);

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // Nettoyer avant de dessiner

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.genre))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.avgRevenue)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "middle");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d3.format("$,.0f"))); // Format argent

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.genre))
      .attr("y", d => yScale(d.avgRevenue))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.avgRevenue))
      .attr("fill", "teal");
  }, [data]);

  return (
    <div>
      <h3>Moyenne des budget par genre (vertical)</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AvgRevenueByGenre;

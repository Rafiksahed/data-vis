"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const VotesByGenre = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const genreVotes = {};

      // Calculer la somme des votes et le nombre de films par genre
      movies.forEach((movie) => {
        if (movie.GENRE && movie.VOTES) {
          const votes = parseInt(movie.VOTES.replace(/,/g, ""), 10);
          movie.GENRE.split(",").forEach((genre) => {
            const trimmedGenre = genre.trim();
            if (!genreVotes[trimmedGenre]) {
              genreVotes[trimmedGenre] = { totalVotes: 0, count: 0 };
            }
            genreVotes[trimmedGenre].totalVotes += votes;
            genreVotes[trimmedGenre].count += 1;
          });
        }
      });

      // Calculer la moyenne des votes par genre
      const processedData = Object.entries(genreVotes)
        .map(([genre, { totalVotes, count }]) => ({
          genre,
          averageVotes: totalVotes / count,
        }))
        .sort((a, b) => b.averageVotes - a.averageVotes)
        .slice(0, 10); // Top 10 genres

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 1000;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 150 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#f9f9f9"); // Ajouter un fond pour le SVG

    // Échelles
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.averageVotes)])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.genre))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".2s")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Barres
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => yScale(d.genre))
      .attr("width", d => xScale(d.averageVotes) - margin.left)
      .attr("height", yScale.bandwidth())
      .attr("fill", "teal")
      .attr("rx", 5) // Coins arrondis
      .attr("ry", 5);

    // Ajouter des étiquettes de données
    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.averageVotes) + 5) // Position à droite des barres
      .attr("y", d => yScale(d.genre) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => d3.format(".2s")(d.averageVotes))
      .style("font-size", "12px")
      .style("fill", "#333");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default VotesByGenre;
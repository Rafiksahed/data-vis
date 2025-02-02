"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BarChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      const processedData = movies
        .map((movie) => ({
          name: movie.MOVIES,
          rating: parseFloat(movie.RATING),
        }))
        .filter((movie) => !isNaN(movie.rating)) // Filtrer les films sans note valide
        .sort((a, b) => b.rating - a.rating) // Trier par note décroissante
        .slice(0, 10); // Garder les 10 meilleurs

      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 700;
    const height = 370;
    const margin = { top: 20, right: 60, bottom: 0, left: 250 }; // Augmenté pour laisser de la place aux titres longs

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Nettoyer le contenu précédent

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.rating)])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleBand()
      .domain(data.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Dessiner les axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".1f")));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px") // Ajuster la taille de la police pour les longs titres
      .style("fill", "#333")
      .call(wrapText, 200); // Fonction de wrapping si nécessaire

    // Barres
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", margin.left)
      .attr("y", (d) => yScale(d.name))
      .attr("width", (d) => xScale(d.rating) - margin.left)
      .attr("height", yScale.bandwidth())
      .attr("fill", "teal");

    // Étiquettes des notes
    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScale(d.rating) + 5) // Juste après la barre
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em") // Centrage vertical
      .text((d) => d.rating.toFixed(1))
      .style("font-size", "12px")
      .style("fill", "#333");
  }, [data]);

  // Fonction de wrapping des textes longs sur plusieurs lignes
  function wrapText(selection, width) {
    selection.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // Hauteur de ligne
      const y = text.attr("y");
      const dy = parseFloat(text.attr("dy") || 0);
      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", -10) // Décalage pour aligner les textes longs correctement
        .attr("y", y)
        .attr("dy", `${dy}em`);

      let word;
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", -10)
            .attr("y", y)
            .attr("dy", `${++lineNumber * lineHeight + dy}em`)
            .text(word);
        }
      }
    });
  }

  return <svg ref={svgRef} width={700} height={400}></svg>;
};

export default BarChart;


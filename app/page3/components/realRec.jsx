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

    const width = 500;
    const height = 400;
    const margin = { top: 50, right: 0, bottom: 40, left: 110 }; // Marge augmentée pour les longs noms

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Nettoyer le contenu précédent

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.gross) || 1])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleBand()
      .domain(data.map((d) => d.director))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);
   svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("Budget moyen par realisateur");
    
    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".2s"))); // Notation compacte pour les recettes

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px")
      .call(wrapText, 200); // Gestion des longs textes avec wrapping

    // Barres
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", margin.left)
      .attr("y", (d) => yScale(d.director))
      .attr("width", (d) => xScale(d.gross) - margin.left)
      .attr("height", yScale.bandwidth())
      .attr("fill", "coral");

    // Étiquettes des recettes
    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScale(d.gross) + 5) // Juste après la barre
      .attr("y", (d) => yScale(d.director) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em") // Centrage vertical
      .text((d) => `${d3.format(".2s")(d.gross)}M`) // Formater les recettes en notation compacte
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
        .attr("x", -10) // Décalage horizontal pour aligner les textes
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

  return <svg ref={svgRef} width={500} height={400}></svg>;
};

export default AverageGrossByDirector;

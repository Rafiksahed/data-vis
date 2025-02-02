'use client'

import styles from "./page.module.css";
import PieChart from "./component/mainPageC/fg";
import LineChart from "./component/mainPageC/fa";
import BarChart from "./component/mainPageC/fn";
import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function Home() {
  const [topRatedMovie, setTopRatedMovie] = useState({});
  const [mostPopularMovie, setMostPopularMovie] = useState({});
  const [highestGrossingMovie, setHighestGrossingMovie] = useState({});

  useEffect(() => {
    d3.csv("/movie.csv").then((movies) => {
      // Film le mieux noté
      const bestRated = movies.reduce((prev, curr) =>
        parseFloat(curr.RATING) > parseFloat(prev.RATING) ? curr : prev
      );

      // Film le plus populaire (par nombre de votes)
      const mostVoted = movies.reduce((prev, curr) =>
        parseInt(curr.VOTES.replace(/,/g, "")) > parseInt(prev.VOTES.replace(/,/g, ""))
          ? curr
          : prev
      );

      // Film avec la meilleure recette
      const highestGrossing = movies.reduce((prev, curr) =>
        parseFloat(curr.Gross) > parseFloat(prev.Gross) ? curr : prev
      );

      setTopRatedMovie({
        title: bestRated.MOVIES,
        rating: bestRated.RATING,
      });

      setMostPopularMovie({
        title: mostVoted.MOVIES,
        votes: mostVoted.VOTES,
      });

      setHighestGrossingMovie({
        title: highestGrossing.MOVIES,
        gross: highestGrossing.Gross,
      });
    });
  }, []);

  return (
    <div className={styles.test}>
      {/* Section des informations principales */}
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3>Film le mieux noté</h3>
          <p className={styles.st}><strong>{topRatedMovie.title}</strong></p>
          <p>Note : {topRatedMovie.rating}</p>
        </div>

        <div className={styles.infoCard}>
          <h3>Film le plus populaire</h3>
          <p className={styles.st}><strong>{mostPopularMovie.title}</strong></p>
          <p>Votes : {mostPopularMovie.votes}</p>
        </div>

        <div className={styles.infoCard}>
          <h3>Film avec la meilleure recette</h3>
          <p className={styles.st}><strong>{highestGrossingMovie.title}</strong></p>
          <p>Recette : {highestGrossingMovie.gross} M$</p>
        </div>
      </div>
      
      {/* Section des graphiques */}
      <div className={styles.chart}> 
        
        <div className={styles.Pie}>
           <PieChart/>
        </div>
        <div>
          <div className={styles.Bar}>
           <BarChart /> 
          </div>  
          <div className={styles.Line}>
           <LineChart />
          </div>  
        </div>
      </div>
      
    </div>
  );
}

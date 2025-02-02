import React from 'react'
import Styles from './page.module.css'
import TopRatedMovies from './component/topNote'
import TopVotedMovies from './component/topPopu'
import RatingDistributionChart from './component/note'
import RuntimeRatingScatterPlot from './component/durNote'

function Page2() {
  return (
    <div className={Styles.test}>
      <div>
        <div className={Styles.Bar}>
         <TopRatedMovies/>
        </div>
        <RatingDistributionChart/>
      </div>
      <div>
       <RuntimeRatingScatterPlot/>
       <div className={Styles.Bar}>
        <TopVotedMovies/>
       </div>
      </div>
    </div>
  )
}

export default Page2
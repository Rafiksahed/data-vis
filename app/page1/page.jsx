import React from 'react'
import Styles from './page.module.css'
import GenreDistribution from './component/fg'
import VotesByGenre from './component/vote'
import AvgRuntimeByGenre from './component/durM'
import RevenueByGenre from './component/recette'

function Page1() {
  return (
    <div className={Styles.test}>
         <AvgRuntimeByGenre/>
         <GenreDistribution/>
         <RevenueByGenre/>
         <VotesByGenre/>
    </div>
  )
}

export default Page1
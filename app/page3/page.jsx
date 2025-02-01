import React from 'react'
import Styles from './page.module.css'
import AverageGrossByDirector from './components/realRec'
import MoviesByDirectorChart from './components/real'
import GrossByYearChart from './components/recette'
import TopGrossingMovies from './components/topRec'

function Page3() {
  return (
    <div className={Styles.test}>
       <AverageGrossByDirector/>
       <MoviesByDirectorChart/>
       <GrossByYearChart/>
       <TopGrossingMovies/>
    </div>
  )
}

export default Page3
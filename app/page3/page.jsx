import React from 'react'
import Styles from './page.module.css'
import AverageGrossByDirector from './components/realRec'
import MoviesByDirectorChart from './components/real'
import GrossByYearChart from './components/recette'
import TopGrossingMovies from './components/topRec'

function Page3() {
  return (
    <div className={Styles.test}>
      <div className={Styles.box1}>
        <div className={Styles.bar}>
         <AverageGrossByDirector/>
        </div>
        <div className={Styles.pie}>
          <MoviesByDirectorChart/>
        </div>
       
      </div>
      <div>
        <div className={Styles.ligne}>
         <GrossByYearChart/>
        </div>
       <div className={Styles.bar}>
        <TopGrossingMovies/>
       </div>
       
       
      </div>
    </div>
  )
}

export default Page3
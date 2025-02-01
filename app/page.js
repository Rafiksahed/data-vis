import styles from "./page.module.css";
import PieChart from "./component/mainPageC/fg";
import LineChart from "./component/mainPageC/fa";
import BarChart from "./component/mainPageC/fn";

export default function Home() {
  return (
    <div className={styles.test}>
      <PieChart/>
      <LineChart/>
      <BarChart />
    </div>
     
  );
}

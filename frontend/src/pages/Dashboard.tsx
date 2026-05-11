import '../style.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";
import { useState } from 'react';
import { color } from 'chart.js/helpers';


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const CatergoryGraph = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
};
const options = {
  responsive: true,
  borderWidth: 0,
  plugins: {
    legend: {
      display: true,
      position: 'right' as const,
       labels: {
        boxWidth: 12,
        boxHeight: 12,
        padding: 10,
        font: {
          size: 12,
        },
      }
    },
  },
  cutout: "70%",
  
};



const revenueOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};





export default function Dashboard() {
    const [tab, setTab] = useState("weekly");

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Weekly Revenue',
        data: [1200, 1900, 3000, 2500, 4200, 5000, 4300],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [12000, 19000, 3000, 5000, 2000, 30000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const revenueGraph =
    tab === "weekly" ? weeklyData : monthlyData;

    return (
        <>
        <div className="grid gap-6 md:grid-cols-4">
        <div className="total-card purple">
          <div className="total-icon">🎭</div>
          <div className="total-label">Total Events</div>
          <div className="total-value" style={{ color: 'var(--accent2)' }}>24</div>
          <div className="total-change up">↑ 4 this month</div>
        </div>
        <div className="total-card gold">
          <div className="total-icon">🎟️</div>
          <div className="total-label">Tickets Sold</div>
          <div className="total-value" style={{ color: 'var(--gold)' }}>1,847</div>
          <div className="total-change up">↑ 12% vs last month</div>
        </div>
        <div className="total-card rose">
          <div className="total-icon">💰</div>
          <div className="total-label">Total Revenue</div>
          <div className="total-value" style={{ color: 'var(--rose)' }}>$48.2K</div>
          <div className="total-change up">↑ 18% vs last month</div>
        </div>
        <div className="total-card emerald">
          <div className="total-icon">👥</div>
          <div className="total-label">Registered Users</div>
          <div className="total-value" style={{ color: 'var(--emerald)' }}>3,241</div>
          <div className="total-change up">↑ 89 new this week</div>
        </div>
      </div>

<div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-3">
  <div className="card chart-card md:col-span-2">
      <div className="card-header">
            <div className="card-title">Revenue Overview</div>
            <div className="tab-bar">
             <button className={`tab ${tab === "weekly" ? "active" : ""}`}
                onClick={() => setTab("weekly")}>
                Weekly
              </button>
            <button className={`tab ${tab === "monthly" ? "active" : ""}`}
                onClick={() => setTab("monthly")}>
                Monthly
              </button>  
             </div>
          </div>
          <div className="chart-wrapper">
        <Bar  data={revenueGraph} options={revenueOptions}  />
          </div>
        </div>
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Category Split</h3>
          </div>
       <div className="chart-wrapper doughnut-wrapper">
  <Doughnut
    data={CatergoryGraph}
    options={{
      ...options,
      maintainAspectRatio: false,
    }}
  />
</div>
          </div> 
      </div>    

      <div className='grid gap-4 grid-cols-2'> 
        <div className='card'>
          <div className='card-header'>
            <div className='card-title'>Upcoming Events</div>
            <button className='btn'>View All -</button>
          </div>
          <div className="mini-event" >
              <div className="mini-event-dot" style={{background:"#06b6d426"}}>💻</div>
              <div className="mini-event-info">
                <div className="mini-event-title">TechSummit 2025</div>
                <div className="mini-event-meta">Jan 15 · San Francisco · 420 attending</div>
              </div>
              <span className="badge badge-green">Live</span>
            </div>

        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Transactions</div></div>
          <table className="table">
            <thead><tr><th>Event</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>TechSummit VIP</td><td style={{color:"var(--emerald)"}}>$299</td><td><span className="badge badge-green">✓ Paid</span></td></tr>
              <tr><td>Music Fest GA</td><td style={{color:"var(--emerald)"}}>$89</td><td><span className="badge badge-green">✓ Paid</span></td></tr>
              <tr><td>Startup Night</td><td style={{color:"var(--gold)"}}>$49</td><td><span className="badge badge-gold">⏳ Pending</span></td></tr>
              <tr><td>Art Exhibition</td><td style={{color:"var(--emerald)"}}>$25</td><td><span className="badge badge-green">✓ Paid</span></td></tr>
              <tr><td>Design Workshop</td><td style={{color:"var(--rose)"}}>$75</td><td><span className="badge badge-rose">✗ Refunded</span></td></tr>
            </tbody>
          </table>
        </div>


      </div>




        </>
    );
}

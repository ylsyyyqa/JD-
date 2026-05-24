import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function RadarChart({ dimensions }) {
  const data = {
    labels: dimensions.map(d => d.label),
    datasets: [
      {
        label: '你的匹配度',
        data: dimensions.map(d => d.score),
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        borderColor: 'rgba(37, 99, 235, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
      {
        label: '岗位要求',
        data: [85, 75, 80, 70, 70],
        backgroundColor: 'rgba(234, 88, 12, 0.05)',
        borderColor: 'rgba(234, 88, 12, 0.3)',
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointBackgroundColor: '#ea580c',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 3,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          display: true,
          backdropColor: 'transparent',
          font: { size: 11 }
        },
        pointLabels: {
          font: { size: 14, weight: '600' },
          color: '#374151'
        },
        grid: {
          color: 'rgba(0,0,0,0.06)'
        },
        angleLines: {
          color: 'rgba(0,0,0,0.06)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      }
    }
  }

  return <Radar data={data} options={options} />
}

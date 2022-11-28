import styled from 'styled-components';
import { useRef, MouseEvent, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getElementAtEvent, Line } from 'react-chartjs-2';
import { chartData } from 'containers/Main';

export interface IProps {
  info: chartData[];
}

export const WorkoutChart = (props: IProps) => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  const chartRef = useRef<ChartJS<'line'>>(null);
  // eslint-disable-next-line no-unused-vars
  const [index, setIndex] = useState(0);
  const data = {
    labels: props.info!.map(data => data.date.substr(3, 5)),
    datasets: [
      {
        data: props.info!.map(data => data.calories) as number[],
        borderColor: '#9fd6cd',
        backgroundColor: 'green',
        pointBackgroundColor: props.info!.map(data => {
          return 'green';
        }),
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: false,
        font: {
          size: 18,
          family: 'IBMPlexSansThaiLooped',
        },
        text: `이번 달 칼로리 차트`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '일자',
          font: {
            size: 15,
            family: 'IBMPlexSansThaiLooped',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: '칼로리',
          font: {
            size: 15,
            family: 'IBMPlexSansThaiLooped',
          },
        },
        min: 0,
      },
    },
  };

  const getIndex = (event: MouseEvent<HTMLCanvasElement>) => {
    const { current: chart } = chartRef;
    if (!chart) {
      return;
    }
    if (getElementAtEvent(chart, event)[0]) {
      setIndex(getElementAtEvent(chart, event)[0].index);
    }
  };
  if (props.info) {
    return (
      <ChartWrapper>
        <Line options={options} onClick={getIndex} data={data} ref={chartRef} />
      </ChartWrapper>
    );
  } else {
    return (
      <ChartWrapper>
        <div>Loading...</div>
      </ChartWrapper>
    );
  }
};

const ChartWrapper = styled.div`
  width: 100%;
`;

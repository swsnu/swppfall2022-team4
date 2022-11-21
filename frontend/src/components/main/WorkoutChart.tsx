import styled from 'styled-components';
import React, { useRef, MouseEvent, useState } from 'react';
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
import { Chart, getElementAtEvent, Line } from 'react-chartjs-2';
import { chartData } from 'containers/Main';
import { AiOutlineConsoleSql } from 'react-icons/ai';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export interface IProps {
  info: chartData[];
}

export const WorkoutChart = (props: IProps) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [datasets, setDatasets] = useState(props.info);
  console.log(props.info);
  const [index, setIndex] = useState(0);
  const data = {
    labels: props.info!.map(data => data.date.substr(3,5)),
    datasets: [
      {
        data: props.info!.map(data => data.calories) as number[],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointBackgroundColor: props.info!.map(data => {
          return 'red';
        }),
        pointRadius: 4,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        font: {
          size: 24,
          family: 'IBMPlexSansThaiLooped',
        },
        text: `이번달 칼로리 차트`
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
    )
  }
};

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

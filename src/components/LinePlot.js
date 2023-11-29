import React from 'react';
import * as d3 from 'd3';

function LinePlot({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20
}) {
  // Gera dados aleatórios caso não seja fornecido nenhum
  if (!data || data.length === 0) {
    data = Array.from({ length: 10 }, () => Math.random() * 50);
  }

  const x = d3.scaleLinear().domain([0, data.length - 1]).range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear().domain([0, d3.max(data)]).range([height - marginBottom, marginTop]);
  const line = d3.line().x((d, i) => x(i)).y(y);

  return (
    <svg width={width} height={height}>
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  );
}

export default LinePlot;
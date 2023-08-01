import React from "react";
import HighCharts from "highcharts";
import HighChartsReact from "highcharts-react-official";
import { useSelector } from "react-redux";

function LineChart({ data }) {
  const { name } = useSelector((state) => state.token);

  const options = {
    chart: {
      type: 'line',
      zoomType: 'x'
    },
    title: {
      text: `${name} Price Chart`
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: 'Price (USD)'
      }
    },
    series: [
      {
        name: name,
        data: data
      }
    ]
  }

  return (
    <div>
      <HighChartsReact
        highcharts={HighCharts}
        options={options}
      />
    </div>
  )
}

export default LineChart;
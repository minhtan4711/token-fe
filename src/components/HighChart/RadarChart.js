import React from 'react';
import HighCharts from 'highcharts';
import HighChartsReact from 'highcharts-react-official';
import HC_more from 'highcharts/highcharts-more';

HC_more(HighCharts);

function RadarChart({ data }) {
  const normalizedData = data.map((value) => {
    if (value >= 10) {
      return Math.log10(value)
    }
    return value
  })

  const options = {
    chart: {
      polar: true,
      type: 'line'
    },

    title: {
      text: 'Statistics',
    },
    pane: {
      size: '90%'
    },
    xAxis: {
      categories: [
        'Number Of Transfer',
        'Trading Volume',
        'Number Of Dapp',
        'Number Of Holder',
        'Number Of Whale Wallet',
        'Average Transfer Per Day',
        'Number Of Address'
      ],
      tickmarkPlacement: 'on',
      lineWidth: 0,
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
      labels: {
        enabled: false,
      }
    },
    tooltip: {
      formatter: function () {
        const originalValue = data[this.point.index];
        return `Category: ${this.point.category}<br>Original value: ${originalValue}`;
      }
    },
    series: [{
      data: normalizedData,
      pointPlacement: 'on',
      showInLegend: false
    }]
  };

  return (
    <div>
      <HighChartsReact
        highcharts={HighCharts}
        options={options}
      />
    </div>
  )
}

export default RadarChart;
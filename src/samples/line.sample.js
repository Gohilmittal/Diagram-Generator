export const lineSample = {
  type: 'line',
  width: 800,
  height: 500,
  data: {
    series: [
      {
        name: 'Revenue',
        points: [
          { x: 1, y: 30 },
          { x: 2, y: 45 },
          { x: 3, y: 35 },
          { x: 4, y: 60 },
          { x: 5, y: 55 },
          { x: 6, y: 70 },
          { x: 7, y: 65 },
          { x: 8, y: 85 },
          { x: 9, y: 75 },
          { x: 10, y: 90 },
          { x: 11, y: 85 },
          { x: 12, y: 95 }
        ]
      }
    ]
  },
  options: {
    title: 'Revenue Trends 2024',
    xLabel: 'Month',
    yLabel: 'Revenue ($K)',
    showPoints: true,
    showLegend: false,
    curveType: 'monotone',
    fillArea: true,
    colors: ['#4299e1']
  }
};

export const lineSampleMultiple = {
  type: 'line',
  width: 800,
  height: 500,
  data: {
    series: [
      {
        name: 'Product A',
        points: [
          { x: 1, y: 20 },
          { x: 2, y: 30 },
          { x: 3, y: 25 },
          { x: 4, y: 45 },
          { x: 5, y: 40 },
          { x: 6, y: 55 },
          { x: 7, y: 50 },
          { x: 8, y: 65 }
        ]
      },
      {
        name: 'Product B',
        points: [
          { x: 1, y: 10 },
          { x: 2, y: 15 },
          { x: 3, y: 20 },
          { x: 4, y: 25 },
          { x: 5, y: 35 },
          { x: 6, y: 40 },
          { x: 7, y: 45 },
          { x: 8, y: 50 }
        ]
      },
      {
        name: 'Product C',
        points: [
          { x: 1, y: 5 },
          { x: 2, y: 10 },
          { x: 3, y: 15 },
          { x: 4, y: 20 },
          { x: 5, y: 25 },
          { x: 6, y: 30 },
          { x: 7, y: 35 },
          { x: 8, y: 40 }
        ]
      }
    ]
  },
  options: {
    title: 'Product Performance Comparison',
    xLabel: 'Month',
    yLabel: 'Units Sold',
    showPoints: true,
    showLegend: true,
    curveType: 'monotone',
    fillArea: false,
    colors: ['#4299e1', '#48bb78', '#ed8936']
  }
};

export const lineSampleStep = {
  type: 'line',
  width: 800,
  height: 500,
  data: {
    series: [
      {
        name: 'Stock Price',
        points: [
          { x: 1, y: 100 },
          { x: 2, y: 105 },
          { x: 3, y: 102 },
          { x: 4, y: 98 },
          { x: 5, y: 110 },
          { x: 6, y: 115 },
          { x: 7, y: 112 },
          { x: 8, y: 120 },
          { x: 9, y: 118 },
          { x: 10, y: 125 }
        ]
      }
    ]
  },
  options: {
    title: 'Stock Price (Step Curve)',
    xLabel: 'Day',
    yLabel: 'Price ($)',
    showPoints: true,
    showLegend: false,
    curveType: 'step',
    fillArea: false,
    colors: ['#48bb78']
  }
};
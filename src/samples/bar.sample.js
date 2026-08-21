export const barSample = {
  type: 'bar',
  width: 800,
  height: 500,
  data: [
    { label: 'January', value: 45 },
    { label: 'February', value: 52 },
    { label: 'March', value: 38 },
    { label: 'April', value: 65 },
    { label: 'May', value: 78 },
    { label: 'June', value: 55 },
    { label: 'July', value: 42 },
    { label: 'August', value: 61 },
    { label: 'September', value: 49 },
    { label: 'October', value: 73 },
    { label: 'November', value: 58 },
    { label: 'December', value: 67 }
  ],
  options: {
    title: 'Monthly Sales Data',
    xLabel: 'Month',
    yLabel: 'Sales ($)',
    showValues: true,
    horizontal: false,
    barWidth: 30,
    colors: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#FF5722', '#8BC34A']
  }
};

// Additional sample with negative values
export const barSampleWithNegative = {
  type: 'bar',
  width: 800,
  height: 500,
  data: [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: -12 },
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: -8 },
    { label: 'May', value: 78 },
    { label: 'Jun', value: -25 }
  ],
  options: {
    title: 'Profit/Loss by Month',
    xLabel: 'Month',
    yLabel: 'Profit ($)',
    showValues: true,
    horizontal: false,
    colors: ['#4CAF50', '#F44336', '#4CAF50', '#F44336', '#4CAF50', '#F44336']
  }
};

// Additional sample with horizontal bars
export const barSampleHorizontal = {
  type: 'bar',
  width: 800,
  height: 500,
  data: [
    { label: 'Product A', value: 450 },
    { label: 'Product B', value: 320 },
    { label: 'Product C', value: 580 },
    { label: 'Product D', value: 290 },
    { label: 'Product E', value: 670 },
    { label: 'Product F', value: 410 }
  ],
  options: {
    title: 'Product Performance',
    xLabel: 'Units Sold',
    showValues: true,
    horizontal: true,
    colors: ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#fc8181', '#68d391']
  }
};
import * as d3 from 'd3';
import BaseDiagram from '../BaseDiagram';

/**
 * BarDiagram - Renders bar graphs using D3.js
 * 
 * Features:
 * - Vertical or horizontal orientation
 * - Configurable colors
 * - Value labels on bars
 * - Gridlines
 * - Axis labels
 * - Title support
 */
export default class BarDiagram extends BaseDiagram {
  constructor(data, options = {}) {
    super(data, options);
    this.margin = this.options.margin || { top: 60, right: 30, bottom: 70, left: 70 };
  }

  /**
   * Validate input data
   * @throws {Error} If validation fails
   */
  validate() {
    super.validate();

    // Validate data array
    if (!this.data.data || !Array.isArray(this.data.data) || this.data.data.length === 0) {
      throw new Error('Bar diagram requires a non-empty data array');
    }

    // Validate each data point
    this.data.data.forEach((item, index) => {
      if (!item.label || typeof item.label !== 'string') {
        throw new Error(`Data point ${index} missing label (string required)`);
      }
      if (item.value === undefined || typeof item.value !== 'number') {
        throw new Error(`Data point ${index} missing value (number required)`);
      }
      if (item.color && !/^#[0-9a-fA-F]{6}$/.test(item.color)) {
        throw new Error(`Data point ${index} has invalid color format: ${item.color}`);
      }
    });

    // Validate options
    if (this.data.options) {
      if (this.data.options.barWidth && (this.data.options.barWidth < 5 || this.data.options.barWidth > 100)) {
        throw new Error('barWidth must be between 5 and 100');
      }
    }
  }

  /**
   * Render the bar graph
   * @returns {SVGElement} The rendered SVG
   */
  render() {
    const { width, height } = this.options;
    const { data, options = {} } = this.data;
    const { 
      title = '', 
      xLabel = '', 
      yLabel = '', 
      showValues = true,
      horizontal = false,
      barWidth = 30,
      colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#FF5722', '#8BC34A']
    } = options;

    // Calculate chart dimensions
    const chartWidth = width - this.margin.left - this.margin.right;
    const chartHeight = height - this.margin.top - this.margin.bottom;

    // Create SVG container
    const svg = this.createContainer();
    
    // Add background rectangle
    svg.appendChild(this.createRect({
      width: width,
      height: height,
      fill: this.options.backgroundColor || '#ffffff',
      rx: 0
    }));

    // Create main chart group
    const chart = this.createGroup({
      transform: `translate(${this.margin.left}, ${this.margin.top})`
    });
    svg.appendChild(chart);

    // Set up scales
    let xScale, yScale;
    
    if (horizontal) {
      // Horizontal bars
      xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(0, d.value)) * 1.15])
        .range([0, chartWidth])
        .nice();

      yScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, chartHeight])
        .padding(0.3);

    } else {
      // Vertical bars
      xScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, chartWidth])
        .padding(0.3);

      const maxValue = d3.max(data, d => Math.abs(d.value)) || 1;
      const minValue = d3.min(data, d => d.value) || 0;
      
      yScale = d3.scaleLinear()
        .domain([Math.min(0, minValue), Math.max(0, maxValue) * 1.15])
        .range([chartHeight, 0])
        .nice();
    }

    // Draw gridlines
    this.drawGridlines(chart, chartWidth, chartHeight, xScale, yScale, horizontal);

    // Draw axes
    this.drawAxes(chart, chartWidth, chartHeight, xScale, yScale, horizontal, xLabel, yLabel);

    // Draw bars
    this.drawBars(chart, data, chartWidth, chartHeight, xScale, yScale, horizontal, colors, barWidth, showValues);

    // Draw title
    if (title) {
      this.drawTitle(svg, title);
    }

    return svg;
  }

  /**
   * Draw gridlines
   */
  drawGridlines(chart, chartWidth, chartHeight, xScale, yScale, horizontal) {
    if (horizontal) {
      // Horizontal bars - vertical gridlines
      const gridlines = d3.axisBottom(xScale)
        .tickSize(chartHeight)
        .tickFormat('')
        .ticks(10);
      
      chart.appendChild(this.createGroup({ 
        class: 'gridlines',
        transform: `translate(0, 0)` 
      }));
      
      // Use D3 to generate gridlines
      this.appendD3Selection(chart, gridlines, 'gridlines', 'x');
    } else {
      // Vertical bars - horizontal gridlines
      const gridlines = d3.axisLeft(yScale)
        .tickSize(-chartWidth)
        .tickFormat('')
        .ticks(10);
      
      chart.appendChild(this.createGroup({ 
        class: 'gridlines',
        transform: `translate(0, 0)` 
      }));
      
      this.appendD3Selection(chart, gridlines, 'gridlines', 'y');
    }
  }

  /**
   * Draw axes
   */
  drawAxes(chart, chartWidth, chartHeight, xScale, yScale, horizontal, xLabel, yLabel) {
    if (horizontal) {
      // Horizontal bars
      // X-axis (bottom)
      const xAxis = d3.axisBottom(xScale)
        .ticks(8)
        .tickFormat(d3.format('d'));
      
      const xAxisGroup = this.createGroup({ 
        transform: `translate(0, ${chartHeight})`,
        class: 'x-axis'
      });
      chart.appendChild(xAxisGroup);
      this.appendD3Selection(xAxisGroup, xAxis);

      // Y-axis (left)
      const yAxis = d3.axisLeft(yScale);
      const yAxisGroup = this.createGroup({ class: 'y-axis' });
      chart.appendChild(yAxisGroup);
      this.appendD3Selection(yAxisGroup, yAxis);
      yAxisGroup.querySelectorAll('.tick text').forEach(text => {
        this.fitTextElement(text, Math.max(this.margin.left - 14, 36), 8);
      });

      // X-axis label
      if (xLabel) {
        const label = this.createText({
          x: chartWidth / 2,
          y: chartHeight + 45,
          'text-anchor': 'middle',
          'font-size': '14px',
          'font-weight': '600',
          maxWidth: chartWidth - 20,
          fill: '#4a5568'
        }, xLabel);
        chart.appendChild(label);
      }

    } else {
      // Vertical bars
      // X-axis (bottom)
      const xAxis = d3.axisBottom(xScale);
      const xAxisGroup = this.createGroup({ 
        transform: `translate(0, ${chartHeight})`,
        class: 'x-axis'
      });
      chart.appendChild(xAxisGroup);
      this.appendD3Selection(xAxisGroup, xAxis);
      xAxisGroup.querySelectorAll('.tick text').forEach(text => {
        this.fitTextElement(text, Math.max(xScale.bandwidth() - 6, 24), 7);
      });

      // Y-axis (left)
      const yAxis = d3.axisLeft(yScale)
        .ticks(8)
        .tickFormat(d3.format('d'));
      
      const yAxisGroup = this.createGroup({ class: 'y-axis' });
      chart.appendChild(yAxisGroup);
      this.appendD3Selection(yAxisGroup, yAxis);

      // X-axis label
      if (xLabel) {
        const label = this.createText({
          x: chartWidth / 2,
          y: chartHeight + 45,
          'text-anchor': 'middle',
          'font-size': '14px',
          'font-weight': '600',
          maxWidth: chartWidth - 20,
          fill: '#4a5568'
        }, xLabel);
        chart.appendChild(label);
      }

      // Y-axis label
      if (yLabel) {
        const label = this.createText({
          x: -45,
          y: 15,
          'text-anchor': 'middle',
          'font-size': '14px',
          'font-weight': '600',
          maxWidth: chartHeight - 20,
          fill: '#4a5568',
          transform: 'rotate(-90)'
        }, yLabel);
        chart.appendChild(label);
      }
    }
  }

  /**
   * Draw bars
   */
  drawBars(chart, data, chartWidth, chartHeight, xScale, yScale, horizontal, colors, barWidth, showValues) {
    const barGroup = this.createGroup({ class: 'bars' });
    chart.appendChild(barGroup);

    // Determine bar width based on scale bandwidth or fixed width
    const barWidthFinal = horizontal 
      ? Math.min(yScale.bandwidth() || 30, 60)
      : Math.min(xScale.bandwidth() || 30, 60);

    data.forEach((item, index) => {
      const color = item.color || colors[index % colors.length];
      const value = item.value;

      let x, y, width, height;

      if (horizontal) {
        // Horizontal bar
        const barHeight = Math.min(yScale.bandwidth(), 40) || 30;
        y = yScale(item.label) + (yScale.bandwidth() - barHeight) / 2;
        x = 0;
        width = xScale(Math.max(0, value));
        height = barHeight;

        // Draw bar
        const rect = this.createRect({
          x: x,
          y: y,
          width: width,
          height: height,
          fill: color,
          rx: 3,
          ry: 3
        });
        barGroup.appendChild(rect);

        // Show value
        if (showValues && value !== 0) {
          const textX = width + 8;
          const textY = y + height / 2;
          const text = this.createText({
            x: textX,
            y: textY,
            'dominant-baseline': 'central',
            'font-size': '12px',
            'font-weight': '500',
            fill: '#2d3748'
          }, value.toString());
          barGroup.appendChild(text);
        }

      } else {
        // Vertical bar
        const barWidth = Math.min(xScale.bandwidth(), 60) || 30;
        x = xScale(item.label) + (xScale.bandwidth() - barWidth) / 2;
        
        if (value >= 0) {
          y = yScale(value);
          height = chartHeight - yScale(value);
        } else {
          y = yScale(0);
          height = yScale(0) - yScale(value);
        }

        // Draw bar
        const rect = this.createRect({
          x: x,
          y: y,
          width: barWidth,
          height: height,
          fill: color,
          rx: 2,
          ry: 2
        });
        barGroup.appendChild(rect);

        // Show value
        if (showValues && value !== 0) {
          const textY = value >= 0 ? y - 8 : y + height + 18;
          const text = this.createText({
            x: x + barWidth / 2,
            y: textY,
            'text-anchor': 'middle',
            'dominant-baseline': value >= 0 ? 'baseline' : 'hanging',
            'font-size': '12px',
            'font-weight': '500',
            fill: '#2d3748'
          }, value.toString());
          barGroup.appendChild(text);
        }
      }
    });
  }

  /**
   * Draw title
   */
  drawTitle(svg, title) {
    const titleText = this.createText({
      x: this.options.width / 2,
      y: 30,
      'text-anchor': 'middle',
      'font-size': '18px',
      'font-weight': '700',
      maxWidth: this.options.width - 40,
      fill: '#1a202c'
    }, title);
    svg.appendChild(titleText);
  }

  /**
   * Helper to append D3-generated elements to SVG
   */
  appendD3Selection(parent, axisGenerator, className, orientation) {
    const tempDiv = document.createElement('div');
    const tempSvg = d3.select(tempDiv)
      .append('svg')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('height', '0')
      .style('width', '0');
    
    const axis = tempSvg.call(axisGenerator);
    
    // Move nodes from temp to parent
    const nodes = axis.node().childNodes;
    const fragment = document.createDocumentFragment();
    
    nodes.forEach(node => {
      const clone = node.cloneNode(true);
      // Add styling for gridlines
      if (className === 'gridlines') {
        if (orientation === 'x') {
          clone.style.stroke = '#e2e8f0';
          clone.style.strokeWidth = '1px';
        } else {
          clone.style.stroke = '#e2e8f0';
          clone.style.strokeWidth = '1px';
        }
      } else {
        // Axis styling
        clone.style.color = '#4a5568';
        clone.style.fontSize = '12px';
        clone.style.fontFamily = '-apple-system, sans-serif';
      }
      fragment.appendChild(clone);
    });
    
    parent.appendChild(fragment);
    tempDiv.remove();
  }
}

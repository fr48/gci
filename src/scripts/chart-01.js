import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#a4cd50'
  ])

d3.csv(require('../data/gci-2018.csv')).then(ready)

function ready(datapoints) {
  console.log(datapoints)

  datapoints = datapoints.sort((a, b) => {
    return a.Score - b.Score
  })

  const countries = datapoints.map(d => d.Country)
  xPositionScale.domain(countries)

  // add buttons
  d3.select('#asia-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.asia').attr('fill', '#4cc1fc')
  })

  d3.select('#africa-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.africa').attr('fill', '#4cc1fc')
  })

  d3.select('#me-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.middleeast').attr('fill', '#4cc1fc')
  })
  d3.select('#sa-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.southamerica').attr('fill', '#4cc1fc')
  })
  d3.select('#europe-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.europe').attr('fill', '#4cc1fc')
  })
  d3.select('#na-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.northamerica').attr('fill', '#4cc1fc')
  })
  d3.select('#rf-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.formerussr').attr('fill', '#4cc1fc')
  })
  d3.select('#au-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.australia').attr('fill', '#4cc1fc')
  })
  d3.select('#continent-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', d => {
      return colorScale(d.Continent)
    })
  })

  d3.select('#reset-btn').on('click', () => {
    svg.selectAll('rect').attr('fill', 'lightgrey')
  })

  // Draw rectangles
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => {
      return height - yPositionScale(d.Score)
    })
    .attr('x', d => {
      return xPositionScale(d.Country)
    })
    .attr('y', d => {
      return yPositionScale(d.Score)
    })
    .attr('fill', 'lightgrey')
    .attr('class', d => {
      return d.Continent.toLowerCase()
    })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}

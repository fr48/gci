import * as d3 from 'd3'

const margin = { top: 60, left: 50, right: 150, bottom: 30 }

const height = 600 - margin.top - margin.bottom
const width = 450 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

const xPositionScale = d3
  .scalePoint()
  .domain(['2014', '2016', '2018'])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0.2, 1])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',
    '#4cc1fc',
    '#333333'
  ])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.score)
  })
  .curve(d3.curveMonotoneX)

d3.csv(require('../data/trends.csv')).then(ready)

function ready(datapoints) {
  console.log(datapoints)

  const countries = datapoints.map(d => d.country)
  colorScale.domain(countries)

  const nested = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(datapoints)
  console.log(nested)

  // still missing: tooltip code
  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('cx', d => xPositionScale(d.year))
    .attr('cy', d => yPositionScale(d.score))
    .attr('r', 3)
    .attr('fill', d => colorScale(d.country))
    .attr('class', d => d.country)
    .on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 7)
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 3)
    })

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 1.5)
    .attr('fill', 'none')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('class', d => {
      return d.key.toLowerCase()
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('font-size', 12)
    .attr('fill', '#333333')
    .attr('x', xPositionScale('2018'))
    .attr('dx', 5)
    .attr('y', function(d) {
      return yPositionScale(d.values[0].score)
    })
    .text(function(d) {
      if (d.key == 'United States of America') {
        return d.values[0].score + 'USA'
      }
      return d.values[0].score + ' ' + d.key
    })
    .attr('dy', function(d) {
      if (d.key === 'China') {
        return 6
      }
      if (d.key == 'Russian Federation') {
        return -4
      }
      if (d.key == 'Singapore') {
        return 5
      }
      if (d.key == 'United Kingdom') {
        return -3
      }
      if (d.key == 'United States of America') {
        return 9
      }
      return 0
    })
    .attr('class', d => {
      return d.key.toLowerCase()
    })

  // set up the axes
  const xAxis = d3.axisBottom(xPositionScale)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .lower()

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickValues([0.4, 0.6, 0.8])
    .tickSize(-width)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  svg.selectAll('.y-axis path').remove()
  svg.selectAll('.y-axis text').remove()
  svg
    .selectAll('.y-axis line')
    .attr('stroke-dasharray', 2)
    .attr('stroke', 'grey')
}

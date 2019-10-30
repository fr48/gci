import * as d3 from 'd3'

// step 1: define your variables
const var_height = 400
const var_width = 700
const margin = { top: 1, bottom: 1, left: 34, right: 34 }

/* having margins give you some wiggle room in the chart so that it is spread out
                  margin top
        margin.left          margin.right
                  margin.bottom
this way you make sure that the graph isn't having stuff all on the edge. 
*/

/* 
What is 'g'?
it stands for 'group'
the translate command is saying the exact coordinate of where to start the 
top-left corner of the g (container). This way, we say that the 0,0 in the 
svg is different from the 0,0 in g, and we want to use the g's coordinates 
for all our drawing.
*/

// step 2: create your svg
const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', var_height + margin.top + margin.bottom)
  .attr('weight', var_width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

/* what does d3 stand for?
  Data Driven Documents

  to add the file, you need a require() and a ready function
  rule of thumb: put components you need to assemble (Scales, variables) 
  outside of ready, and the actual assembly instructions inside ready
  */

// step 4: let's add data
d3.csv(require('../data/trends.csv')).then(ready)

/* 
we will leave out the domain on countries for the time being 
clamp() is a useful function that basically says, if you have 
data that doesn't fit the domain, set to minimum value 
*/
// Step 5a: create your scales
const xPositionScale = d3.scaleBand().range([0, var_width])
const yPositionScale = d3
  .scaleLinear()
  .domain([45, 110])
  .range([0, var_height])
/*
what you call the data being read in is up to you for the ready function. 
datapoints is just convention

*/
function ready(datapoints) {
  // console.log(datapoints)
  // step 5b: add your domain
  const countries = d3.map(datapoints, d => d.country)
  xPositionScale.domain(countries)
  // step 5: draw a bar chart
  /*
  you need a scale, and ways to draw the rectangles, axes,
  */
  // step 5c: start drawing
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', xPositionScale(d => d.country))
    .attr('y', 0)
    .attr('width', xPositionScale.bandwidth())
    .attr('height', d => yPositionScale(+d.life_expectancy))
}

// step 3: draw in the 'g' inside the 'svg'
/* harry's code showed a circle, mine didn't */
/* commenting out in step 4
svg
  .append('circle')
  .attr('r', 20)
  .attr('cx', var_width / 2)
  .attr('cy', var_height / 2)
*/

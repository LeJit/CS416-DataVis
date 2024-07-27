function scene_three() {
    // set the dimensions and margins of the graph
    const margin = { top: 100, right: 20, bottom: 50, left: 40 };
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#viz_container")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 450 350")
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // parse the Data
    d3.csv("dataset/metadata.csv", function (d) {
        const parseTime = d3.timeParse("%Y-%m-%d")
        return {
            year: parseTime(d.date).getFullYear(),
            runNumber: d.run_number,
            finishTime: +d.time_sec
        };
    }).then(function (data) {

        // data wrangling
        const sumbyYearRunNumber = d3.rollups(data, v => d3.median(v, d => +d.finishTime), d => d.year, d => d.runNumber)
        const yearKeys = Array.from(sumbyYearRunNumber).map(d => d[0])
        const runNumberKey = Array.from(Array.from(sumbyYearRunNumber)[0][1]).map(d => d[0])
        const runNumberKey_sorted = runNumberKey.sort(d3.ascending)

        // X scale and Axis
        const xScale = d3.scaleBand()
            .domain(yearKeys)
            .range([0, width])
            .padding(.2);
        svg
            .append('g')
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickSize(0).tickPadding(8));

        // Y scale and Axis
        const formater = d3.format(".1s")
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => +d.finishTime))])
            .range([height, 0]);
        svg
            .append('g')
            .call(d3.axisLeft(yScale).ticks(5).tickSize(0).tickPadding(6).tickFormat(formater))
            .call(d => d.select(".domain").remove());

        // set subgroup sacle
        const xSubgroups = d3.scaleBand()
            .domain(runNumberKey_sorted)
            .range([0, xScale.bandwidth()])
            .padding([0.05])

        // color palette
        const color = d3.scaleOrdinal()
            .domain(runNumberKey_sorted)
            .range(['#18375F', '#0072BC', '#8EBEFF', '#47AEB4'])

        // set horizontal grid line
        const GridLine = () => d3.axisLeft().scale(yScale);
        svg
            .append("g")
            .attr("class", "grid")
            .call(GridLine()
                .tickSize(-width, 0, 0)
                .tickFormat("")
            );

        // create a tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("id", "chart")
            .attr("class", "tooltip");

        // tooltip events
        const mouseover = function (d) {
            tooltip
                .style("opacity", .8)
            d3.select(this)
                .style("opacity", .5)
        }
        const mousemove = function (event, d) {
            const formater = d3.format(",")
            tooltip
                .html(formater(d[1]))
                .style("top", event.pageY - 10 + "px")
                .style("left", event.pageX + 10 + "px");
        }
        const mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("opacity", 1)
        }

        // create bars
        bars = svg.append("g")
            .selectAll("g")
            .data(sumbyYearRunNumber)
            .join("g")
            .attr("transform", d => "translate(" + xScale(d[0]) + ", 0)")
            .selectAll("rect")
            .data(d => { return d[1] })
            .join("rect")
            .attr("x", d => xSubgroups(d[0]))
            .attr("y", d => yScale(d[1]))
            .attr("width", xSubgroups.bandwidth())
            .attr("height", d => height - yScale(d[1]))
            .attr("fill", d => color(d[0]))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        // set title
        svg
            .append("text")
            .attr("class", "chart-title")
            .attr("x", -(margin.left) * 0.6)
            .attr("y", -(margin.top) / 1.5)
            .attr("text-anchor", "start")
            .text("Median finish time by Run Number | 2018-2021")

        // set Y axis label
        svg
            .append("text")
            .attr("class", "chart-label")
            .attr("x", -(margin.left) * 0.6)
            .attr("y", -(margin.top / 15))
            .attr("text-anchor", "start")
            .text("Median finish time (seconds)")

        // set source
        svg
            .append("text")
            .attr("class", "chart-source")
            .attr("x", -(margin.left) * 0.6)
            .attr("y", height + margin.bottom * 0.7)
            .attr("text-anchor", "start")
            .text("Source: Speed Climbing Dataset")

        // set copyright
        svg
            .append("text")
            .attr("class", "copyright")
            .attr("x", -(margin.left) * 0.6)
            .attr("y", height + margin.bottom * 0.9)
            .attr("text-anchor", "start")
            .text("©Masaryk University")

        //set legend
        svg
            .append("rect")
            .attr("x", -(margin.left) * 0.6)
            .attr("y", -(margin.top / 2))
            .attr("width", 13)
            .attr("height", 13)
            .style("fill", "#18375F");
        svg
            .append("text")
            .attr("class", "legend")
            .attr("x", -(margin.left) * 0.6 + 20)
            .attr("y", -(margin.top / 2.5))
            .text("First Run")
        svg
            .append("rect")
            .attr("x", -(margin.left) * 0.6 + 80)
            .attr("y", -(margin.top / 2))
            .attr("width", 13)
            .attr("height", 13)
            .style("fill", "#0072BC")
        svg
            .append("text")
            .attr("class", "legend")
            .attr("x", -(margin.left) * 0.6 + 100)
            .attr("y", -(margin.top / 2.5))
            .text("Second Run")
        svg
            .append("rect")
            .attr("x", -(margin.left) * 0.6 + 180)
            .attr("y", -(margin.top / 2))
            .attr("width", 13)
            .attr("height", 13)
            .style("fill", "#8EBEFF")
        svg
            .append("text")
            .attr("class", "legend")
            .attr("x", -(margin.left) * 0.6 + 200)
            .attr("y", -(margin.top / 2.5))
            .text("Third Run")

        svg
            .append("rect")
            .attr("x", -(margin.left) * 0.6 + 280)
            .attr("y", -(margin.top / 2))
            .attr("width", 13)
            .attr("height", 13)
            .style("fill", "#47AEB4")
        svg
            .append("text")
            .attr("class", "legend")
            .attr("x", -(margin.left) * 0.6 + 300)
            .attr("y", -(margin.top / 2.5))
            .text("Fourth Run")
    })
}
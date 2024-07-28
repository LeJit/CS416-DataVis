function scene_two(sideType) {
    // set the dimensions and margins of the graph
    const margin = { top: 80, right: 20, bottom: 50, left: 40 };
    const width = 450 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    var typeKeys = ["by-side", "both-side"];

    if (sideType === "both-side") {
        typeKeys = ["both-side", "by-side"];
    }

    // Add dropdown button
    d3.select("#viz_container")
        .append("h4")
        .text("By-side or both sides together:")

    d3.select("#viz_container")
        .append("p")
        .text("Since climbers race side-by-side, some people have raised 'concerns' about whether one side gives an advantage")

    var dropdownButton = d3.select("#viz_container")
        .append("select")
        .attr("class", "form-select")

    dropdownButton
        .selectAll("options")
        .data(typeKeys)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

    // append the svg object to the body of the page
    const svg = d3.select("#viz_container")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 450 350")
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // parse the data
    d3.csv("dataset/metadata.csv", function (d) {
        const parseTime = d3.timeParse("%Y-%m-%d")
        return {
            year: parseTime(d.date).getFullYear(),
            climbSide: d.side,
            finishTime: +d.time_sec
        };
    }).then(function (data) {

        //pivot the data
        data = mean_by_year(data, sideType)
        var dataGrouped = d3.group(data, d => d.climbSide)

        // list of value keys
        if (sideType === "both-side") {
            typeKeys = ["both-side", "by-side"];
            dataGrouped = d3.group(data, d => "all")
        }


        // X scale and Axis
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.year)).nice()
            .range([0, width]);
        svg
            .append('g')
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).tickSize(0).tickPadding(12).tickFormat(d3.format("")));

        // Y scale and Axis
        const formatter = d3.format("~s")
        const yScale = d3.scaleLinear()
            .domain([6, d3.max(data, d => d.finishTime)])
            .range([height, 0]);
        svg
            .append('g')
            .call(d3.axisLeft(yScale).ticks(6).tickSize(0).tickPadding(6).tickFormat(formatter))
            .call(d => d.select(".domain").remove());

        // set horizontal grid line
        const GridLine = () => d3.axisLeft().scale(yScale);
        svg
            .append("g")
            .attr("class", "grid")
            .call(GridLine()
                .tickSize(-width, 0, 0)
                .tickFormat("")
                .ticks(6)
            );

        // color palette
        const color = d3.scaleOrdinal()
            .range(["#0072BC", "#00B398"])

        // create line
        const lines = svg
            .selectAll("lines")
            .data(dataGrouped)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", d => color(d[0]))
            .attr("stroke-width", 2)
            .attr("d", function (d) {
                return d3.line()
                    .curve(d3.curveCardinal)
                    .x(d => xScale(d.year))
                    .y(d => yScale(d.finishTime))
                    (d[1])
            });

        // set title
        svg
            .append("text")
            .attr("class", "chart-title")
            .attr("x", -(margin.left) * 0.7)
            .attr("y", -(margin.top) / 1.5)
            .attr("text-anchor", "start")
            .text("Mean Speed Climbing Time | 2018-2020")

        // set Y axis label
        svg
            .append("text")
            .attr("class", "chart-label")
            .attr("x", -(margin.left) * 0.7)
            .attr("y", -(margin.top / 9))
            .attr("text-anchor", "start")
            .text("Average Time (seconds)")

        // set source
        svg
            .append("text")
            .attr("class", "chart-source")
            .attr("x", -(margin.left) * 0.7)
            .attr("y", height + margin.bottom * 0.7)
            .attr("text-anchor", "start")
            .text("Source: Speed Climbing Dataset")

        // set copyright
        svg
            .append("text")
            .attr("class", "copyright")
            .attr("x", -(margin.left) * 0.7)
            .attr("y", height + margin.bottom * 0.9)
            .attr("text-anchor", "start")
            .text("©Masaryk University")

        // set legend manually
        if (sideType == "by-side") {
            svg
                .append("circle")
                .attr("cx", -(margin.left) * 0.6)
                .attr("cy", -(margin.top / 2.5))
                .attr("r", 5)
                .style("fill", "#0072BC");
            svg
                .append("text")
                .attr("class", "legend")
                .attr("x", -(margin.left) * 0.6 + 10)
                .attr("y", -(margin.top / 2.5))
                .attr("alignment-baseline", "middle")
                .text("Left Side")
            svg
                .append("circle")
                .attr("cx", 60)
                .attr("cy", -(margin.top / 2.5))
                .attr("r", 5)
                .style("fill", "#00B398")
            svg
                .append("text")
                .attr("class", "legend")
                .attr("x", 70)
                .attr("y", -(margin.top / 2.5))
                .attr("alignment-baseline", "middle")
                .text("Right Side")
        } else {
            svg
                .append("circle")
                .attr("cx", -(margin.left) * 0.6)
                .attr("cy", -(margin.top / 2.5))
                .attr("r", 5)
                .style("fill", "#0072BC");
            svg
                .append("text")
                .attr("class", "legend")
                .attr("x", -(margin.left) * 0.6 + 10)
                .attr("y", -(margin.top / 2.5))
                .attr("alignment-baseline", "middle")
                .text("Both Sides")
        }

        dropdownButton.on("change", function (d) {
            var selection = d3.select(this).property("value")
            d3.selectAll('#viz_container').selectAll("*").remove();
            scene_two(selection)
        })
    })
}
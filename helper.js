function mean_by_year(data, sideType) {
    if (sideType == "by-side") {
        var timesByYear = d3.flatRollup(data, v => d3.mean(v, d => d.finishTime), d => d.year, d => d.climbSide)
        return timesByYear.map(([year, climbSide, finishTime]) => ({ year, climbSide, finishTime }));
    } else {
        var timesByYear = d3.flatRollup(data, v => d3.mean(v, d => d.finishTime), d => d.year, d => d.climbSide.length)
        return timesByYear.map(([year, climbSide, finishTime]) => ({
            year, climbSide, finishTime
        }));
    }

}

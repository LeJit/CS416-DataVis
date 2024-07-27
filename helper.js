function mean_by_year(data) {
    var timesByYear = d3.flatRollup(data, v => d3.mean(v, d => d.popNumber), d => d.year, d => d.popType)
    return timesByYear.map(([year, popType, popNumber]) => ({ year, popType, popNumber }));
}

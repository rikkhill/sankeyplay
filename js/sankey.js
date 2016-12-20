/*
    sankey.js
    D3 sankey diagram using d3-sankey
*/

function sankey(container, graph) {


    const margin = {
            top: 1,
            right: 1,
            bottom: 6,
            left: 1
          };

    const parentDims = container.getBoundingClientRect();
    const width = parentDims.width - margin.left - margin.right;
    const height = parentDims.height - margin.top - margin.bottom;

    const formatNumber = d3.format(",.0f"),
        format = function(d) {
            return formatNumber(d);
        },
        color = d3.scaleOrdinal(d3.schemeCategory20);

    const svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([width, height]);

    const path = sankey.link();

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    const link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke", function(d) { return d.source.color })
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; })
        .attr("stroke-dasharray", function() { return this.getTotalLength() + " " + this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .append("title")
        .text(function(d) { return d.source.name + " -> " + d.target.name + ": " + format(d.value); });

    svg.selectAll(".link")
        .transition()
            .duration(1000)
            .ease(d3.easeBounceOut)
            .attr("stroke-dashoffset", 0);

    const node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { return d.color; })
        .style("stroke", function(d) { return d.color; })
        .append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });

    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    return svg.node();

}
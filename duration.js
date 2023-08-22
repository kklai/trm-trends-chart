d3.loadData("duration_range_month.csv", function(err,res){
	var data = res[0];

	data.forEach(function(d){
		d.duration_month = +d.duration_month;
		d.count = +d.count;
	})

	function drawChart() {
		var sel = d3.select(".duration-chart").html("");
		var width = sel.node().getBoundingClientRect().width;
		var height = 350;

		var svg = sel.append("svg")
			.attr("width", width)
			.attr("height", height)

		var margin = {top: 0, right: 20, bottom: 50, left: 40};

		width -= margin.left + margin.right;
		height -= margin.top + margin.bottom;

		var x = d3.scaleLinear().domain([1,d3.max(data, d => d.duration_month)]).range([0,width]);
		var xBar = d3.scaleBand().domain(data.map(d => d.duration_month)).range([0,width]).padding(0.1);
		var y = d3.scaleLinear().domain([0,d3.max(data, d => d.count)]).range([height, 0]);

		var xAxis = d3.axisBottom(xBar).tickValues([1,12,24,36,48,60,72,84]).tickFormat(function(d,i){
			return d == 1 ? "1 month" : d == 2 ? i + " year" : i + " years";
		})
		var yAxis = d3.axisLeft(y).tickValues([400,800,1200,1600]).tickSize(width);

		var line = d3.line()
			.x(d => x(d.duration_month))
			.y(d => y(d.count))

		g = svg.append("g").translate([margin.left, margin.top]);

		g.append("g.x.axis")
			.translate([0,height])
			.call(xAxis)

		sel.selectAll(".x.axis text")
			.style("transform-origin", "top left")
			.style("transform", "rotate(45deg) translate(16px,0px)")

		g.append("g.y.axis")
			.translate([width,0])
			.call(yAxis)

		g.appendMany("rect", data)
			.style("fill", "teal")
			.attr("width", xBar.bandwidth())
			.attr("height", d => height - y(d.count))
			.translate(d => [xBar(d.duration_month),y(d.count)])
	}

	drawChart();
	window.addEventListener('resize', function() {
	    drawChart();
	});
	
})
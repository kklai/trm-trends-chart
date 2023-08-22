d3.loadData("cost.csv", function(err,res){
	var data = res[0];

	data.forEach(function(d){
		d.duration_month = +d.duration_month;
		d.Total_Claims_Paid_Amount_With_Recovery = +d.Total_Claims_Paid_Amount_With_Recovery;
	})

	function drawChart() {
		var sel = d3.select(".cost-chart").html("");
		var width = sel.node().getBoundingClientRect().width;
		var height = 350;

		var svg = sel.append("svg")
			.attr("width", width)
			.attr("height", height)

		var margin = {top: 10, right: 20, bottom: 80, left: 50};

		width -= margin.left + margin.right;
		height -= margin.top + margin.bottom;

		var x = d3.scaleLinear().domain([1,d3.max(data, d => d.duration_month)]).range([0,width]);
		var xBar = d3.scaleBand().domain(data.map(d => d.duration_month)).range([0,width]).padding(0.1);
		var y = d3.scaleLinear().domain([0,d3.max(data, d => d.Total_Claims_Paid_Amount_With_Recovery)]).range([height, 0]);

		var xAxis = d3.axisBottom(x).tickValues([1,12,24,36,48,60,72,84]).tickFormat(function(d,i){
			return d == 1 ? "1 month" : d == 2 ? i + " year" : i + " years";
		})

		function numberWithCommas(x) {
		    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		var yAxis = d3.axisLeft(y).tickSize(width).tickFormat(d => "$" + numberWithCommas(d)).ticks(4)
		// .tickValues([400,800,1200,1600]);

		var line = d3.line()
			.x(d => x(d.duration_month))
			.y(d => y(d.Total_Claims_Paid_Amount_With_Recovery))

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

		sel.select(".y.axis .tick:nth-child(2)").remove();

		g.appendMany("circle", data)
			.style("stroke-width", 2)
			.style("stroke", "teal")
			.style("fill", "none")
			.attr("r", 3)
			.translate(d => [x(d.duration_month),y(d.Total_Claims_Paid_Amount_With_Recovery)])
	}

	drawChart();
	window.addEventListener('resize', function() {
	    drawChart();
	});
	
})
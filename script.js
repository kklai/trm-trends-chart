console.clear();

d3.loadData("data.json", function(err, res){

	var data = res[0];
	var grouped = d3.nest().key(d => d[2]).entries(data);

	var xextent = d3.extent(data.map(d => d[0]))
	var yextent = d3.extent(data.map(d => d[1]))

	function drawChart() {
		var sel = d3.select(".chart").html("");
		var width = sel.node().getBoundingClientRect().width;
		var height = 200;

		var margin = {top: 0, right: 125, bottom: 20, left: 40};

		var chartW = width - margin.left - margin.right;
		var chartH = height - margin.top - margin.bottom;

		var x = d3.scaleLinear().domain(xextent).range([0,chartW]);
		var y = d3.scaleLinear().domain(yextent).range([chartH,0]);

		var curve = d3.curveLinear;

		var colors = {
			'BLM': '#6AB46A',
			'HLM': '#166d16',
			'Open file': '#DA5A65',
			'Payment': '#6794FF',
			'Closing': '#83C1F2',
			'Liabilty determination': '#B48EBC',
			'Provider': '#F09D37',
			'Legal': '#FADE91'
		}

		chart1();
		chart2();

		function chart1() {
			var xAxis = d3.axisBottom(x).tickSize(chartH).tickValues([.2,.4,.6,.8]);
			var yAxis = d3.axisLeft(y).tickSize(chartW).tickValues([200,400,600,800,1000,1200]);


			sel.append("div.title").text("All");
			var svg = sel.append("svg").attr("width", width).attr("height", height);
			g = svg.append("g").translate([margin.left, margin.top]);
			g.append("rect.bg").attr("width", chartW).attr("height", chartH);

			g.append("g.x.axis").translate([0,0]).call(xAxis);
			g.append("g.y.axis").translate([chartW, 0]).call(yAxis);

			var line = d3.line()
				.curve(curve)
				.x(d => x(d[0]))
				.y(d => y(d[1]));


			g.appendMany("path.line", grouped)
				.style("stroke", d => colors[d.key])
				.attr("d", d => line(d.values))

			g.appendMany("text.label", grouped)
				.translate(function(d){
					var last = d.values[d.values.length - 1];
					return [x(last[0])+5, y(last[1])-3]
				})
				.style("fill", d => colors[d.key])
				.text(d => d.key)
		}
		
		function chart2() {

			grouped.forEach(function(group){

				var group_yextent = d3.extent(group.values.map(d => d[1]));
				var groupMargin = {top: 0, right: 20, bottom: 20, left: 40};

				var groupChartH = height - y(group_yextent[1]);
				var groupChartHSvg = groupChartH + margin.top + margin.bottom;

				var groupChartW = width - groupMargin.left - groupMargin.right;
				var groupX = d3.scaleLinear().domain([0,1]).range([0,groupChartW]);
				var groupY = d3.scaleLinear().domain(group_yextent).range([groupChartH,0]);

				sel.append("div.title").text(group.key);

				var svg = sel.append("svg").attr("width", width).attr("height", groupChartHSvg)
				g = svg.append("g").translate([groupMargin.left, groupMargin.top]);
				g.append("rect.bg").attr("width", groupChartW).attr("height", groupChartH);

				var groupXAxis = d3.axisBottom(groupX).tickSize(groupChartH).tickValues([.2,.4,.6,.8]);
				var yticks = Math.max(Math.floor(group_yextent[1]/200),2);
				var groupYAxis = d3.axisLeft(groupY).tickSize(groupChartW).ticks(yticks);

				g.append("g.x.axis").translate([0,0]).call(groupXAxis);
				g.append("g.y.axis").translate([groupChartW,0]).call(groupYAxis);

				var line = d3.line()
					.curve(curve)
					.x(d => groupX(d[0]))
					.y(d => groupY(d[1]));

				g.append("path.line")
					.style("stroke", d => colors[group.key])
					.attr("d", d => line(group.values))
			})
		}
		

	}


	drawChart();
	window.addEventListener('resize', function() {
	    drawChart();
	});


	

})
$(function () {

	var DEFAULTS = {
		tick_count : 10,
		x_tick_count : 16,

		top_circle_radius : 6,

		graph_width : 800,
		graph_height : 500
	};

	var margin = { top : 20, right : 20, bottom : 50, left : 60 },
		width = DEFAULTS.graph_width - margin.left - margin.right,
		height = DEFAULTS.graph_height - margin.top - margin.bottom;


  var x = d3.scaleLinear()
        .range([0, width]);

  var y = d3.scaleLinear()
        .range([height, 0]);


	var item = function(age, dtd) {
		this.age = age;
		this.dtd = dtd;
	};

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
  var svg = d3.select(".scatter-plot").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

  var symbol = d3.symbol();


  var DOT_SHAPE = symbol.type(function ( d ) {
          			return d3.symbolCircle;
    		});


  d3.tsv("../tcga-cases.tsv", function (error, d) {
            if (error) throw error;

      var data = _.filter(d, function (item) {
            return item.case_days_to_death !== '0' && d.case_age_at_diagnosis !== '0';
      });

      x.domain([d3.min(data, function (d) { return +d.case_days_to_death; }), d3.max(data, function (d) { return +d.case_days_to_death; })]);
      y.domain([d3.min(data, function (d) { return +d.case_age_at_diagnosis; }), d3.max(data, function(d) { return +d.case_age_at_diagnosis; })]);

  svg.selectAll(".dot")
       .data(data)
       .enter().append("path")
       .attr('class', 'dot')
       //.attr('stroke', function (d) { var index = STAGES.indexOf(d.case_pathologic_stage); return color20(index); })
       .attr('d', DOT_SHAPE)
       .attr("transform", function(d) { return "translate(" + x(d.case_days_to_death) + "," + y(d.case_age_at_diagnosis) + ")"; })


       var xAxis = d3.axisBottom(x).ticks(DEFAULTS.x_tick_count);
       var yAxis = d3.axisLeft(y).ticks(DEFAULTS.tick_count);
  });

});

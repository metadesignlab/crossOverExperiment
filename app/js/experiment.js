$(document).ready(function(){
	// let arrayTen=[2,3,4,5,6,7,8,9,10,11,12,13,14];

	let arrayTen=[]
	for(let j=1;j<21;j++){arrayTen.push(j)}
	let ingredientGroups=[
		[AdditionComp,SubtractionComp,MultiplicationComp],
		[PointComp,LineComp,TriangleComp,RectComp,PolygonComp],
		[ColorComp,ColorSVGComp,LineDivComp,LineByPointDirLengthComp,MoveGeometryComp],
		[EdgeComp,WallComp,ColumnComp]
	]
	let ingredients=[]
	for (group in ingredientGroups){
		for (ing in ingredientGroups[group]){
			ingredients.push(ingredientGroups[group][ing])
		}
	}
	d3.select("#ingredients").selectAll('input').data(ingredients).enter()
	.append('div').attr('class',"ing")
	.append('label').attr('for',function(d,i){ return 'ing'+i; }).text(function(d){return d.name})
	.append('input').attr("type","checkbox").attr('id',function(d,i){ return 'ing'+i; }).property('checked',function(d){
		let index=ings.indexOf(d);
		if(index>-1) return true
	})
	.on("click",function(d){
			let index=ings.indexOf(d);
			if(index>-1) ings.splice(index,1)
			else ings.push(d)
		});

	d3.select("#qty").selectAll('option').data(arrayTen).enter().append("option").text(function(d) { return d }).attr("selected",function(d,i){if(d===qty)return "selected"});
	d3.select("#rounds").selectAll('option').data(arrayTen).enter().append("option").text(function(d) { return d }).attr("selected",function(d,i){if(d===rounds)return "selected"});
	d3.select("#xnum").selectAll('option').data(arrayTen).enter().append("option").text(function(d) { return d }).attr("selected",function(d,i){if(d===xnum)return "selected"});
	d3.select("#ynum").selectAll('option').data(arrayTen).enter().append("option").text(function(d) { return d }).attr("selected",function(d,i){if(d===ynum)return "selected"});
	d3.select("#metric").selectAll('option').data(arrayTen).enter().append("option").text(function(d) { return d }).attr("selected",function(d,i){if(d===numMetric)return "selected"});
})

// d3.select('#xnum')
// 	.on("change",function(){
// 		console.log("x changed")
// 	});

d3.select("#run")
	.on("click", function(){
    // var model=document.getElementById('model').value;
		// runModel(model);
		reset()
		init()
		update(currChoice)
	});
d3.select("#default")
	.on("click", function(){
  	changeChoice(choices[choices.length]);
	});
d3.select("#hideModel")
	.on("click", function(){
  	$( ".modelG" ).toggle();
	});
d3.select("#hideSketch")
	.on("click", function(){
  	$( ".sketch" ).toggle();
	});
d3.select("#update")
	.on("click", function(){

  	update()
	});
// var seedWorker = new Worker('../js/es6/seedWorker.js');
// let testSeed;
// console.log(testSeed);
// seedWorker.postMessage([1,2]);
// seedWorker.onmessage=function(e){
// 	testSeed=e.data
// 	console.log(testSeed);
// }






function runModel(model){
  eval(model);

};
$( ".sketch" ).toggle();
$(window).resize(function() {
	d3.select(".modelStuff").selectAll("svg").remove();
  draw(xParam,yParam)
	// console.log(selNetwork)
	// showNetwork(selNetwork)
	drawMultiples()
});


var graphTextDiv = d3.select("body").select("#graphTextDiv").append("pre");
// console.log("here here");
/////////////////////////////////
let xnum=6
let ynum=6
let numMetric=6

let rounds=6;
let qty=6;
let split=1200;

// let ings=[PointComp,RectComp,FloorComp,LineByPointDirLengthComp,TrimLineComp,WallComp,ColumnComp,ColorComp,ColorSVGComp]
// let ings=[PointComp,LineByPointDirLengthComp,WallComp,RectComp,ColumnComp,ColorComp,ColorSVGComp]
// let ings=[PointComp,RectComp,LineByPointDirLengthComp,EdgeComp,WallComp,FloorComp]
// let ings=[TriangleComp,PointComp,RectComp,FloorComp,EdgeComp,LineByPointDirLengthComp,WallComp,ColorComp,ColorComp,ColorSVGComp,ColorSVGComp]
// let ings=[TriangleComp,PointComp,RectComp,FloorComp,EdgeComp,WallComp,ColorComp,ColorSVGComp,ColumnComp]
let ings=[PointComp,RectComp]



let initPop=[]
let nodes=[];
let links=[];
let parent,parents,parentA,parentB;
let seed;
let choices=[];
let xParam;
let yParam;
let xOptions;
let multiples;
let selNetwork;




let currChoice;
let currRound=-1;

let maxVote=5;

let voteScale;


navigate();
init();
update();

function reset(){
	 initPop=[]
	 nodes=[];
	 links=[];
	 parent,parents,parentA,parentB;
	 seed;
	//  choices=[];
	 xParam;
	 yParam;
	 xOptions;
	 multiples;


	//  currChoice;
	 currRound=-1;

	 maxVote=5;

	 voteScale;
}





function saveSVG(){
	d3.select('.zoomBox')
	.attr('stroke','none');


	let filename=currChoice.name+"_"+xParam+"_"+yParam;

	var config = {
    filename: filename,
  }
	let saveSVG=d3.select('#zoomSVG').node();
  d3_save_svg.save(saveSVG, config);
	let networkSVG=d3.select('#networkSVG').node();
  d3_save_svg.save(networkSVG, {filename:"network"+currChoice.name+"_"+xParam+"_"+yParam});

}
function init(){


	for(let j=0;j<qty;j++){
		let i=0;
		seed=new Seed(xnum,ynum,ings,numMetric);
		seed.generate()
		seed.update()
		// seed.metrics={}
		seed.name="seed"+i+j;
		seed.metrics.round=i;
		seed.metrics.serial=j
		seed.vote=0;
		initPop.push(seed)
		// console.log(seed);

	}
	xParam="serial"
	yParam="round"

	//create dropdown
	xOptions=Object.keys(initPop[0].metrics);
	let yOptions=Object.keys(initPop[0].metrics);
	let xOption=d3.select("#xOption");
	let yOption=d3.select("#yOption");


	///create multiples data
	multiples=[]
	xOptions.forEach(function(x,i){
		yOptions.forEach(function(y,j){

			multiples.push({"xVal":x,"x":i,"yVal":y,"y":j})
		})
	})




	// create dropdowns
	xOption.selectAll("option")
	.data(xOptions).enter()
	.append("option")
	.property("selected",function(d){return d===xParam})
	.attr("value",function(d){return d})
	.text(function(d){return d});

	yOption.selectAll("option")
	.data(yOptions).enter()
	.append("option")
	.property("selected",function(d){return d===yParam})
	.attr("value",function(d){return d})
	.text(function(d){return d});

}


function navigate(){
	// reference:  http://bl.ocks.org/gka/17ee676dc59aa752b4e6


	////setup data
	let columns=["Mutate","Mate","Both","Selection"]
	let selTypes=["Random","Objective","Subjective"]



	let numChoices=(columns.length-1)*selTypes.length
	// let choices=[]


	for(let i=0;i<numChoices;i++){
		let mutate=true,mate=true

		let col=i%selTypes.length
		let selType=selTypes[Math.floor(i/selTypes.length)]
		// let row=i%selTypes.length
		if(col===0) mate=false
		if(col===1) mutate=false

		let xOverType="None";

		if(mate && mutate){
			xOverType="Both"
		}else{
			if(mate) xOverType="Mate"
			else if(mutate) xOverType="Mutate"
		}

		let out={"id":i,"mutate":mutate,"mate":mate,"selType":selType, "name":selType+xOverType}
		choices.push(out)

	}
	choices.push({"id":numChoices+1,"mutate":false,"mate":false,"selType":"Random","name":"RandomNone"})
	currChoice=choices[choices.length-1];



	// create table header
	let table = d3.select('#navigation')
			.append('table')
			.attr('id','navTable');

  table.append('thead').append('tr')
      .selectAll('th')
      .data(columns).enter()
      .append('th')
      .text(function(d){return d});

	let tbody=table.append('tbody');
	for(let j=0;j<selTypes.length;j++){
		tbody.append('tr')
		.selectAll('td')
		.data(columns).enter()
		.append('td')
		.attr('id',function(d,i){
			if(i===3){
				// return "selTypes[j]"
			}else{
				return `choice${j*selTypes.length+i}`
			}
		}
	)
		.text(
			function(d,i){
				if(i===3){
					return selTypes[j]
				}
			}
		);
	}
	for(let i=0;i<choices.length;i++){
		let choice=d3.select(`#choice${i}`)
		.append("svg")
		.attr("class","choiceSVG")
		.append("circle")
		.attr("id",`circle${i}`)
		.on("click",function(){changeChoice(i)})
		.attr("class","choiceCircle");
	}
}

function changeChoice(i){
	currChoice=choices[i]
	currRound=-1;
	for(let i=0;i<initPop.length;i++){
		initPop[i].vote=0;
	}
		d3.selectAll(".selectedCircle")
		.classed("selectedCircle", false);
		d3.select(`#circle${i}`)
		.classed("selectedCircle", true);
		// update(choices[i]);
}


function getNode(id){
	let filtered=nodes.filter(function(node){
		if(node.id===id){
			return node;
		}
	})
	if(filtered.length && filtered.length>0){
		return filtered[0]
	}else{
		// console.log("node not found");
		return false

	}
	return filtered[0]
}

function addRound(i,selType,mate,mutate){

	// console.log(qty,rounds);




	///parents
	let pushParentA=true
	let pushParentB=true

	parents=nodes.filter(seed => seed.metrics.round === i-1);

	let wheel;
	///Selection
	if(selType==="Random"){
		///create wheel without any fitness
		wheel=Seed.rouletteWheel(parents);
		// console.log("done wheel");
	}else{
		if(selType==="Objective"){
			///create wheel using a metric

			wheel=Seed.rouletteWheel(parents,"efficiency");


		}else{
			if(selType==="Subjective"){
				///create wheel without votes
				// console.log("not done yet");
				wheel=Seed.rouletteWheel(parents,"vote");
			}
		}
	}



	for(let j=0;j<qty;j++){
		let seed;

		pushParentA=true
		pushParentB=true


		////roll dice on existing or new


		let startP=performance.now()

		///parent A
		if(Seed.rollDice(0.8)){

			parentA=parents[Seed.spinWheel(wheel)]

		}else{
			parentA=new Seed(xnum,ynum,ings,numMetric);
			pushParentA=false
			parentA.generate()
			parentA.update()
		}

		// parentA=parents[Seed.spinWheel(wheel)]
		// parentB=parents[Seed.spinWheel(wheel)]

		///parent B
		if(Seed.rollDice(0.8)){
			parentB=parents[Seed.spinWheel(wheel)]

		}else{
			parentB=new Seed(xnum,ynum,ings,numMetric);
			pushParentB=false
			parentB.generate()
			parentB.update()
		}


		// console.log(performance.now()-startP);




		if(mate){

			Seed.mate(parentA,pushParentA,parentB,pushParentB,"NP",1,seedUpdate)

			// seed=Seed.clone(parentA)
		}else{

			seed=Seed.clone(parentA)

			pushParentB=false;


			// seed.parents=[{id:parentA.id,genotype:parentA.genotype}];

			seedUpdate(seed,parentA,parentB)
		}







		 function seedUpdate(seed,parentA,parentB){
			if(mutate){

				let newSeed=Seed.mutate(seed,0.05);

				if(seed.parents.length>1){
					newSeed.parents=seed.parents;
				}
				seed=newSeed;
			}

					// let myFirstPromise = new Promise((resolve, reject) => {

						// let tt=performance.now()
						seed.update()
						// console.log(performance.now()-tt);

						seed.name="seed"+i+j;
						seed.vote=0;
						seed.metrics.round=i;
						seed.metrics.serial=j


						////let worker update seed
						nodes.push(seed)

						seed.parents.forEach(parent=>{
							// console.log(parent.id);
							if(getNode(parent.id)){
								links.push({"source":parent.id,"target":seed.id})
							}
						})


						let currNodes=nodes.filter(seed => seed.metrics.round === i);


							if(currNodes.length===qty){
								draw()
								if(selType!="Subjective" && i<rounds-1) {
									addRound(i+1,selType,mate,mutate)
								}else{
									// draw()
								}
							}

					// });




		}




	}


}

function update(choice={id: 0, mutate: true, mate: true, selType: "Random"}){
	// console.log("start "+performance.now());
	let pT=[]
	pT.push(performance.now())


	let selType=choice.selType;
	let mate=choice.mate;
	let mutate=choice.mutate;







	if(selType==="Subjective"){
		currRound+=1;
		if(currRound===0){
			nodes=[];
			links=[];
			nodes.push(...initPop)
		}else{
			addRound(currRound,selType,mate,mutate)
		}
		// console.log(currRound,nodes);

	}else {

		nodes=[];
		links=[];
		nodes.push(...initPop)

		addRound(1,selType,mate,mutate)

		// for(let i=1;i<rounds;i++){
		// 	pT.push(performance.now())
		// 	// console.log(`round${i} start ${performance.now()}`);
		// }
	}
	//
	// if(selType==="Random" || selType==="Objective"){
	//
	// }

	// console.log("done",choice);

		draw(xParam=xParam,yParam=yParam);
		drawMultiples()

}

function drawMultiples(){
	let multipleCanvas=createZoomCanvas("multiplesDiv","multipleSVG")
	let container=multipleCanvas.container
	let width=multipleCanvas.width
	let height=multipleCanvas.height




	////set the ranges


	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([0,height]);
	var r = d3.scale.linear().range([0,2]);


	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
			.orient("top").ticks(xOptions.length);

	var yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(xOptions.length);


			let qty_=xOptions.length;


			// svgGraphW = 100;
			// svgGraphH = 100;
			fit=qty
			if (qty<rounds){fit=rounds}
			svgGraphW = (width-(fit*5))/(fit+1);
			svgGraphH = (height-(fit*5))/(fit+1);

			// svgGraphW = (width-(qty_*5))/(qty_+1);
			// svgGraphH = (height-(qty_*5))/(qty_+1);





			var svg=container.append("g")
				.data(multiples)
				.attr("class","container")
				.attr("transform",`translate(${svgGraphW*1},${svgGraphH*1})`);
				//


			// Scale the range of the data

				// let xParam="CC";





			    x.domain([0,xOptions.length]);
			    y.domain([0,xOptions.length]);
			    r.domain([0, 1]);

					svg.selectAll("g")
								 .data(multiples)
							 .enter().append('g')
							 .attr("class","multipleG")
								.attr('id',function(d,i){return "svgMult"+i});


								for(let i=0;i<multiples.length;i++){


									// svgGraphH = svgGraphH
									/////add geometry

									let svgGeoID=`#svgMult${i}`




									var gGeo=d3.select(svgGeoID)
									.attr("width", svgGraphW)
									.attr("height", svgGraphH)
									.attr("transform", function(d){
										let xV=x(d.x)-(0.5*svgGraphW)
										let yV=y(d.y)-(0.5*svgGraphH)

										return `translate(${xV},${yV}) `
									});


									gGeo.append("rect")
									.attr("height",(svgGraphH))
									.attr("width",(svgGraphW))
									.attr("transform", function(d){


										// return `translate(${-0.5*(svgGraphH)},${-0.5*(svgGraphH)})`
									})
									.attr("class","modelBg");

									let modelG=gGeo.append("g");
									var x = d3.scale.linear().range([0, svgGraphW]);
									var y = d3.scale.linear().range([0,svgGraphH]);
									var r = d3.scale.linear().range([0,2]);
									voteScale = d3.scale.linear().range([0,30]);


									// Define the axes
									var xAxis = d3.svg.axis().scale(x)
											.orient("top").ticks(qty);

									var yAxis = d3.svg.axis().scale(y)
											.orient("left").ticks(rounds);

											let xParam=multiples[i].xVal
											let yParam=multiples[i].yVal

											x.domain([d3.min(nodes,function(d){return d.metrics[xParam]}),d3.max(nodes,function(d){return d.metrics[xParam]})]);
											y.domain([d3.min(nodes, function(d){return d.metrics[yParam]}),d3.max(nodes,function(d){return d.metrics[yParam]})]);
											r.domain([0, 1]);


											////https://bl.ocks.org/mbostock/3883245
											var line = d3.svg.line()
												.x(function(d) { return x(d.metrics[xParam]); })
												.y(function(d) { return y(d.metrics[yParam]); });


												var sortedData = d3.nest()
													.key(function(d) { return d.metrics[xParam]}).sortKeys(d3.ascending)
													.entries(nodes);

													// console.log(sortedData[0].values);

												//
												// modelG.append("path")
										    //   .datum(sortedData[0].values)
										    //   .attr("fill", "none")
										    //   .attr("stroke", "steelblue")
										    //   .attr("stroke-linejoin", "round")
										    //   .attr("stroke-linecap", "round")
										    //   .attr("stroke-width", 1.5)
										    //   .attr("d", line);




								}


}
function createZoomCanvas(div,id){
	d3.select(`#${div}`).selectAll("svg").remove();
	w=$(window).width();

	if (w>split){
		console.log("split");
		w=0.9*w*0.5;
	}else{w=0.9*w}

	h=w;


	///setup
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
		width = w - margin.left - margin.right,
		height = h - margin.top - margin.bottom;

	var zoomSVGWidth=width + margin.left + margin.right;
	var zoomSVGHeight=height + margin.top + margin.bottom;

	var zoom = d3.behavior.zoom()
	    .scaleExtent([0.5, 10])
	    .on("zoom", zoomed);

	var zoomSVG = d3.select(`#${div}`).append("svg")
			.attr("id",id)
			.attr("class","zoomSVG")
	    .attr("width", zoomSVGWidth)
	    .attr("height", zoomSVGHeight);


	var rect = zoomSVG.append("rect")
	.attr("width", width-margin.left-margin.right)
	.attr("height", height-margin.top-margin.bottom)
	// .style("fill", "none")
	.attr("class","zoomBox")
	.attr("transform", "translate(" + margin.left + "," + margin.right + ")")
	.style("pointer-events", "all");

	var zoomG=zoomSVG.append("g")
	.attr("width", width-margin.left-margin.right)
	.attr("height", height-margin.top-margin.bottom)
	.attr("class","modelStuff")
	    // .attr("transform", `translate(0,0)`)
	    .call(zoom).on("dblclick.zoom", null);


	var container = zoomG.append("g").attr("transform","translate(0,0)");
	function zoomed() {
		container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

	return({"container":container,"width":width,"height":height})


}
function draw(selX="serial",selY="round"){
	xParam=selX;
	yParam=selY;

	let zoomCanvas=createZoomCanvas("zoomDiv","zoomSVG")
	let container=zoomCanvas.container;
	let width=zoomCanvas.width;
	let height=zoomCanvas.height;





	// svgGraphW = 100
	// svgGraphH = 100
	fit=qty
	if (qty<rounds){fit=rounds}
	svgGraphW = (width-(fit*5))/(fit+1);
	svgGraphH = (height-(fit*5))/(fit+1);
	// svgGraphW = (width-(qty*5))/(qty+1);
	// svgGraphH = (height-(rounds*5))/(rounds+1);






	var margin = {top: 50, right: 20, bottom: 30, left: 50}
	//     width = (svgGraphH*qty) - margin.left - margin.right;
	// var  height = (svgGraphH*rounds) - margin.top - margin.bottom;

	////set the ranges


	var x = d3.scale.linear().range([0, width-svgGraphW*2]);
	var y = d3.scale.linear().range([0,height-svgGraphH*2]);
	var r = d3.scale.linear().range([0,2]);
	voteScale = d3.scale.linear().range([0,30]);


	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("top").ticks(qty);

	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(rounds);


	var svg=container.append("g")
		.data(nodes)
		.attr("class","container")
		.attr("transform",`translate(${svgGraphW*1},${svgGraphH*1})`);
		//


	// Scale the range of the data

		// let xParam="CC";



	    x.domain([d3.min(nodes,function(d){return d.metrics[xParam]}),d3.max(nodes,function(d){return d.metrics[xParam]})]);
	    y.domain([d3.min(nodes, function(d){return d.metrics[yParam]}),d3.max(nodes,function(d){return d.metrics[yParam]})]);
	    r.domain([0, 1]);
			voteScale.domain([0,maxVote])




			svg.selectAll("g")
			       .data(nodes)
			     .enter().append('g')
					 .attr("class","modelG")
					 .on("click",function(d,i){addVote(d,i)})
			 			.attr('id',function(d,i){return "svgGeo"+i});


	//axes
	container.append("g")
		 .attr("class", "y axis")
			.attr("transform",`translate(${(svgGraphW*0.5)-15},${svgGraphH})`)
			.call(yAxis);
	container.append("g")
		 .attr("class", "x axis")
			.attr("transform",`translate(${svgGraphW},${(svgGraphH*0.5)-15})`)
			.call(xAxis);

	// /create the links
		svg.selectAll(".link")
			    .data(links)
			    .enter().append("line")
						.attr("x1",function(d) {

							let source=getNode(d.source);

							if(source.metrics){

								return x(source.metrics[xParam])
							}
						})



						.attr("x2",function(d) {
							let target=getNode(d.target);
							return x(target.metrics[xParam]);})
						.attr("y1",function(d) {
							let source=getNode(d.source);
							if(source.metrics){
								return y(source.metrics[yParam])
							}
						})
						.attr("y2",function(d) {
							let target=getNode(d.target);
							return y(target.metrics[yParam]);

						})

			      .attr("class", "link");


	let lowest=0.5;
	svg.selectAll("circle")
	       .data(nodes)
	     .enter().append("circle")
			 .on("mouseover", function(d){
				 console.log(JSON.stringify(d.metrics));
				 selNetwork=d.phenotype;
				 return showNetwork(d.phenotype)
			 })
	       .attr("r", function(d){
					 let status=d.phenotype.status;
					 let passed=status.passed/(status.passed+status.failed)
					 return r(passed)}
				 )
				 .attr("fill", function(d){ let status=d.phenotype.status;
					let passed=status.passed/(status.passed+status.failed)
					if(passed>lowest){
						return "black"
					}else{

						return "red"
					}

				})
	       .attr("cx", function(d) { return x(d.metrics[xParam]); })
	       .attr("cy", function(d) { return y(d.metrics[yParam]); });
	// svg.selectAll("text")
	// 		.data(nodes)
	// 		.enter()
	// 		.append("text")
	// 		.attr("x", function(d) { return x(d.j)+20;})
	// 		.attr("y", function(d) { return y(d.i)-20;})
	// 		.attr("class","label")
	// 		.text( function (d) {
	// 			// console.log(d.metrics);
	// 			// return JSON.stringify(d.metrics)
	// 			// let status=d.phenotype.status;
	// 			// let passed=status.passed/(status.passed+status.failed)
	// 			// passed=Math.round(passed * 100) / 100
	// 			// let geometry=JSON.stringify(d.phenotype.geometry.summary)
	// 			// return "( " + passed +" "+geometry+" )";
	// 		});


	// svgGraphH=svgGraphH*0.75

	let modelScale=100;
	let modelH
	for(let i=0;i<nodes.length;i++){


		// svgGraphH = svgGraphH
		/////add geometry

		let svgGeoID=`#svgGeo${i}`




		var gGeo=d3.select(svgGeoID)
		.attr("width", svgGraphW)
		.attr("height", svgGraphH)
		.attr("transform", function(d){
			let xV=x(d.metrics[xParam])-(0.5*svgGraphW)
			let yV=y(d.metrics[yParam])-(0.5*svgGraphH)

			return `translate(${xV},${yV}) `
		});


		gGeo.append("rect")
		.attr("height",(svgGraphH))
		.attr("width",(svgGraphW))
		.attr("transform", function(d){


			// return `translate(${-0.5*(svgGraphH)},${-0.5*(svgGraphH)})`
		})
		.attr("class","modelBg")
		.on("mouseover", function(d){
			selNetwork=d.phenotype
			return showNetwork(d.phenotype)
		});
		// .attr("fill-opacity", 0.6);
		let modelG=gGeo.append("g")
		.attr("transform", function(d){

			// return `scale(50)`
			return `translate(${0.25*svgGraphW},${0.25*svgGraphH}), scale(${svgGraphH*0.35})`
		});
		let geometry=nodes[i].phenotype.geometry
		updateModel(modelG,geometry)

		gGeo.append("circle")
		.attr("class","voteCircle")
		.attr("id",`voteCircle${i}`)
		.attr("r",voteScale(nodes[i].vote))
		.attr("transform", function(d){
			// return `scale(50)`
			return `translate(${0.5*svgGraphW},${0.5*svgGraphH})`
		});

	}
	function showNetwork(network=selNetwork){
		// svgGraphW=w=$(window).width();
		if ($(window).width()>split){
			svgGraphW=$(window).width()*0.5*0.9
		}else{
			svgGraphW=$(window).width()*0.9
		}


		// svgGraphH = 1500;
		svgGraphH = svgGraphW*0.8;
		/////add graph
		let svgGphID="#networkSVG"
		// svgGraphW = svgGraphH*0.75;

		var svgGph=d3.select(svgGphID)
		.attr("width", svgGraphW)
		.attr("height", svgGraphH);

		svgGph.selectAll("*").remove();


			let gGph = svgGph.append("g")
				.attr("transform","translate(" +60+","+60+ ")scale(0.75,0.75)");
		updateGraph(gGph,network)

	}
}
function addVote(seed,i){

	if(seed.metrics.round===currRound){
		if(seed.vote<maxVote){
			seed.vote+=1;

			let circle=d3.select(`#voteCircle${i}`)
			.attr("r",function(){return voteScale(nodes[i].vote)});

		}
	}
}

function zoomExtent(){

	d3.select('.modelStuff').select('g').attr('transform','translate(0,0)scale(1)')

}

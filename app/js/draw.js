// function getGeometry(components){
//   var data={lines:[],points:[],polygons:[],rects:[],lengths:[]};
//   var addData=function(d){
//     if(isArray(d)){
//       for(var i=0;i<d.length;i++){
//         addData(d[i]);
//       }
//     }else{
//       if(d instanceof PointObj){
//
//         data.points.push(d);
//       }else if(d instanceof LineObj){
//         data.lines.push(d)
//       }else if(d instanceof PolygonObj){
//         data.polygons.push(d);
//       }else if(d instanceof RectObj){
//         data.rects.push(d)
//       }
//     }
//   };
//
//
//
//   components.forEach(function(component){
//     if(component.passedRun){
//       drawComps.forEach(function(comp){
//
//         if(component instanceof comp){
//
//           component.outputs.forEach(function(out){
//             addData(out);
//           })
//         };
//       })
//     }else{
//
//     }
//   });
//
//
//
//   return data;
//
// // }

function drawGeometry(svg,data,gScale=100){

  var rects=svg.selectAll("rect")
    .data(data.rects)
    var rect=rects.enter()
      .append("rect")
      .attr("class",function(d){
        if(d.fill){return "floor"}
        else{
          return "sketch"
        }
      })
      .attr("fill",function(d){
        if(d.fill){
          return d.fill

        }else{
          return "none"
        }
      })
      .attr("stroke",function(d){
        if(d.stroke){
          return d.stroke
        }else{
          return "black"
        }
      })
      .attr('stroke-width',function(d){if(d.strokeWidth){
        return d.strokeWidth
      }else{
        return 0.01
      }})

      .attr("x", function(d){return d.origin.x})
      .attr("y", function(d){return d.origin.y})
      .attr("width", function(d){return d.width})
      .attr("height", function(d){return d.height});


  var lines=svg.selectAll("line")
    // .data(data.walls);
    .data(data.lines);
    lines.exit().remove;
      var line=lines.enter()
      .append("line")
      .attr('class',function(d){
        if(d.stroke){
          return "wall"
        }else{
          return "sketch"
        }
      })
      .attr("fill","none")
      .attr("stroke",function(d){if(d.stroke){

        return d.stroke
      } else{
        // return "none"
        return "black"
      }
    })
      .attr('stroke-width',function(d){
        if(d.strokeWidth){
          return d.strokeWidth;
        }else{
          return ("0.0050")
        }
      })
      .attr('x1', function(d,i){
        if(isNaN(d.a.x)){console.log(d,i);}
        return d.a.x;
      })
      .attr('y1', function(d){return d.a.y;})
      .attr('x2', function(d){return d.b.x;})
      .attr('y2', function(d){return d.b.y;});



    var polygons=svg.selectAll("polygon")
      .data(data.polygons);
    polygons.exit().remove;
    var polygon=polygons.enter()
      .append("polygon")
      .attr('class',"polygon")
      .attr('stroke',"black")
      .attr('stroke-width',"0.01")
      .attr('fill',function(d){return ["white","grey"][Math.floor(Math.random()*2)]})
      .attr('fill-opacity',function(d){return Math.random()+0.1})
      .attr('points',function(d){

        let pts="";
        if (d.closed) {
          d.points.forEach(function(point){

            let pt=`${point.x},${point.y}`
            if(pts===""){
              pts=pt
            }else{
              pts=pts+" "+pt
            }
          })
        }
        return pts
        });

    var polylines=svg.selectAll("polyline")
      .data(data.polygons);
    polylines.exit().remove;
    var polyline=polylines.enter()
      .append("polyline")
      .attr('stroke',"black")
      .attr('stroke-width',`0.01`)
      // .attr('class',"polyline")
      .attr('points',function(d){

        let pts="";
        if (!d.closed) {
          d.points.forEach(function(point){

            let pt=`${point.x},${point.y}`
            if(pts===""){
              pts=pt
            }else{
              pts=pts+" "+pt
            }
          })
        }
        return pts
        });




    var points = svg.selectAll("circle")
            .data(data.points);
        var point = points.enter()
    	    	.append("circle")
            .attr("class", function(d){
              if(d.fill) return "column"
              else return "sketch"
            })
            .attr("fill",function(d){
              if(d.fill){
               return(d.fill);
            }else{return ("none")}
          })
          .attr("stroke",function(d){
            if(d.stroke){
              return d.stroke
            }
          })
          .attr("stroke-width",function(d){
            if(d.stroke){
              return "0.01"
            }
          })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { if(d.radius){
              return (d.radius/gScale)}
              else{
                return(0.03)
              }
              ; });

    // var labels=svg.selectAll("text")
    //   .data(data.points);
    //
    //     var label = labels.enter()
    //     .append("text")
    //     .attr("class", "label")
    //     .text(function(d) { return `(${d.x},${d.y} )`})
    //     .attr("dx", function(d) { return d.x;})
    //     .attr("dy", function(d) { return d.y;})
    //     .attr("transform",`translate(${10/gScale},-${10/gScale})`)
    //     .attr("style", `font-size:${12/gScale}px;`);





}
function updateModel(svg,geometry,gScale=100){


  let data=geometry;

  // var svgG=d3.select("#svgModel");
  data.numPoints=data.points.length;
  data.numMembers=data.lines.length;

  let maxLength=0;
  let totalLength;
  if(data.lines.length >1){
    totalLength=data.lines.reduce(function(a, b) {
      let currLength=b.length();
      if(currLength>0){
        if(currLength>maxLength) maxLength=currLength;
        data.lengths.push(currLength)
      }
      return a + currLength;
    }, 0);
  }
  data.maxLength=maxLength;
  if(totalLength>0){
    data.totalLength=totalLength
  }else{
    data.totalLength=0;
  };


  drawGeometry(svg,data,gScale)

}



function updateGraph(g,system){


  //this might want to be dynamic
  let boxWidth = 70;
  let boxHeight = 60;
  let boxRadius = 3;
  let linkSplineRatio = 0.4;


  let c = system.components;
  let l = system.links;

	let margin = 10;


  ////brought from prev code
  var minDom=0;
  var maxDom=10;
  var scaleW = d3.scale.linear().range([0,svgGraphW-2*margin]).domain([minDom,maxDom]);
  var scaleH = d3.scale.linear().range([0,svgGraphH-2*margin]).domain([minDom,maxDom]);

  let cgpXVals = c.map(function(d){return d.cgpPostion[0];}).filter(function(d){return !isNaN(d);});
  let cgpYVals = c.map(function(d){return d.cgpPostion[1];}).filter(function(d){return !isNaN(d);});
  let maxCGPX = Math.max.apply(null, cgpXVals);
  let maxCGPY = Math.max.apply(null, cgpYVals);
  scaleW.domain([0,maxCGPX]);
  scaleH.domain([0,maxCGPY]);

  //ask if we don't do this alaredy?
  function findComponent(compID){
    return c.find( function(d){
      return d.id === compID;
    })
  }

  l.forEach(function(d){
    d["ca"]= findComponent(d.a);
    d["cb"]= findComponent(d.b);
  })

  //now work out where on the curve is it...

  //basic stright links
  // let links =  g.selectAll(".links")
  //  .data(l)
  //  .enter()
  //  .append("line")
  //  .attr("class","links")
  //  .attr("x1", function(d){ return scaleW(d.ca.cgpPostion[0]);} )
  //  .attr("y1", function(d){ return scaleH(d.ca.cgpPostion[1]);} )
  //  .attr("x2", function(d){ return scaleW(d.cb.cgpPostion[0]);} )
  //  .attr("y2", function(d){ return scaleH(d.cb.cgpPostion[1]);} )
  //  .attr("stroke","grey")
  //  ;

  var halfBoxWidth = boxWidth/2.0*0.8;//add more or less to this to change spline angle
  var halfBoxHeightR = boxHeight/2.0-boxRadius*2;
  var inOutScaleH = d3.scale.linear().range([-halfBoxHeightR,halfBoxHeightR]).domain([0,1]);
  //more spline links
   let links =  g.selectAll(".links")
    .data(l)
    .enter()
    .append("path")
    .attr("class","links")
    .attr("d", function(d){
      let dx = (d.cb.cgpPostion[0]-d.ca.cgpPostion[0])*linkSplineRatio;
      let midXa = d.ca.cgpPostion[0]+dx;
      let midXb = d.cb.cgpPostion[0]-dx;

      let aOut = d.ca.outputs;
      let bIn  = d.cb.inputs;
      let outputHt = 0.0;
      if (aOut.length > 1){
        inOutScaleH.domain([0,aOut.length-1])
        outputHt = inOutScaleH( d.va );
      }
      let inputHt = 0.0;
      if (bIn.length > 1){
        inOutScaleH.domain([0,bIn.length-1])
        inputHt = inOutScaleH( d.vb );
      }

      let p = "M"
            +(scaleW(d.ca.cgpPostion[0])+halfBoxWidth)+","
            +(scaleH(d.ca.cgpPostion[1])+outputHt)
            +" C"
            +(scaleW(midXa)+halfBoxWidth) +","
            +(scaleH(d.ca.cgpPostion[1])+outputHt)
            +" "
            +(scaleW(midXb)-halfBoxWidth) +","
            +(scaleH(d.cb.cgpPostion[1])+inputHt)
            +" "
            +(scaleW(d.cb.cgpPostion[0])-halfBoxWidth) +","
            +(scaleH(d.cb.cgpPostion[1])+inputHt)
            ;
      return p;
    } )
    .attr("stroke","grey")
    .attr("stroke-width",1.5)
    .attr("fill","none")
    ;


  let comps =  g.selectAll(".components")
   .data(c)
   .enter()
   .append("g")
   .attr("class","components")
   .attr("transform",function(d){
                    return "translate("
                    + scaleW(d.cgpPostion[0]) + ","
                    + scaleH(d.cgpPostion[1]) + ")" ;
                  })

  //  comps.append("circle")
  //   .attr("class","dot")
  //   .attr("r",10)
  //   .attr("fill","grey")
  //   ;

  comps.append("rect")
   .attr("class","compBox")
   .attr("width",boxWidth)
   .attr("height",boxHeight)
   .attr("x", -boxWidth/2.0)
   .attr("y",-boxHeight/2.0)
   .attr("rx",boxRadius)
   .attr("ry",boxRadius)
   .attr("fill",function(d){

     //this chec should probely be a system level flag set during
    //  if (d.passedRun===true){
    //      //Only first object in type is checked
    //      function checkType(arr,test){
    //        if(Array.isArray(arr))
    //         return checkType(arr[0]);
    //        else{
    //         if (arr === undefined) return false;
    //         return arr.name === test;
    //       }
    //      }
    //      let allOk = d.outputs.every(function(put,i){
    //        return checkType(put,d.outputTypes[i].name);
    //      });
    //      if (allOk) return "grey";
    //    }
    //    return "#a77";
    if(d.passedRun){

      return "grey"
    }else{
      return "#a77";
    }
   });

  fontsize = Math.floor(boxHeight/3);

  comps.append("text")
  .attr("class","label")
  .attr("text-anchor","middle")
  .attr("alignment-baseline","central")
  .text(function(d){
    let cName = d.constructor.name;
    cName = cName.split("Comp")[0];
    return cName;
  })
  .attr("y","-0.55em")
  .attr("font-size", fontsize+"px")
  .attr("fill","lightgrey");

  comps.append("text")
  .attr("class","compDetail")
  .attr("text-anchor","middle")
  .attr("alignment-baseline","central")
  .text(function(d){
    let col="lightgrey"

    let cName = d.constructor.name;
    //should really check that there is only one number....
    if(cName =="NumberComp") {
      cName = d.outputs[0][0].toString();
      cName = cName.split(".");
      return cName[0]+"."+cName[1].slice(0,3);
    }

    //Only first object in type is checked
    let arrSizes = "";
    function return1stArraySizes(arr){
      if(Array.isArray(arr)){
       //val.push(arr.length)
       if (arrSizes !== "") arrSizes = arrSizes + ",";
       arrSizes += arr.length.toString();
       return1stArraySizes(arr[0])
     }else{
       if (arr === undefined) arrSizes = "UnDef"
     }

    }
    return1stArraySizes(d.outputs[0]); //assume that there is always one overall arr
    return arrSizes;
  })
  .attr("y","0.55em")
  .attr("font-size", fontsize+"px")
  .attr("fill","lightgrey");


//tool tip turning output data into json and displying.
//
let toolTip = graphTextDiv;

comps.on("mouseover", function(d) {
  toolTip.transition()
      .duration(200)
      .style("opacity", .9)
      //.style("background", "yellow" );

  let text = JSON.stringify( d.outputs, null, 2);

  toolTip.html(text);
        //    .attr("x", 10+ "px")
        //    .attr("y", 10 + "px");
        })
    .on("mouseout", function(d) {
        toolTip.transition()
            .duration(500)
            .style("opacity", 0);
    });



}

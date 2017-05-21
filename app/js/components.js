//////base component class////
class BaseComponent{
  constructor(){
    this.id=guid();
    this.inputTypes=[];
    this.outputTypes=[];
    this.inputs=[];
    this.outputs=[];
    this.rank=0;
    this.replicate=true;
    this.passedRun=false;
  }

///is this in the correct place?
  isEmpty(){
    return this.size==0;
  }

/////used to have a (runID)
  checkAndRun(){
    var checks=this.checkPointers();

    if(checks.passed){
      this.passedRun=true;
      this.update();
      //this doesn't find if there are any fails in the update...
    }else{
      checks.errors.forEach(function(error){console.error (error)})
      this.passedRun=false;
    }
  }


/////should we handle seperate error logs?
  checkPointers(){
    var self=this;
    var check=true;
    var errors=[];



    ///check there are enough inputs specified and all are valid

    // if(this.inputs.length && this.inputs.every(input=>input || input===0)){
    if(!this.inputs.length){
      check=false;
      errors.push(`No input sources specified for ${self.constructor.name}`)
    }else{
      for(let i=0;i<this.inputs.length;i++){
        let val=this.inputs[i]
        let type=this.inputTypes[i]
        if(val===undefined){
          check=false;
        }else{
          if(val || val===0){

          }else{
            check=false;
          }
          // console.log(this.inputs[i],this.inputTypes[i]);
        }

      }

      if(check===false){
        errors.push(`Not enough input sources specified for ${self.constructor.name}`)
      }
    }

    return {"passed":check,"errors":errors};
  }

  typeCheck(value,type){
    if(isArray(type) && isArray(value)){
      if(type.length){
        if(value.length){
          type=type[0]
          value=value[0]
        }else{
          console.error(`Input ${value} is not of Correct inputType for ${this.constructor.name}`)
          return false
        }
      }else{
        return true;
      }
    }

    if(value instanceof type){
      return true;
    }else{
      if(type.name){
        let typeName=type.name.toLowerCase();
        if(typeof(value)===typeName){
          // console.log(`${value} is a ${type.name}`);
          return true
        }
      }else{
        console.error(`Input ${value} is not of Correct inputType for ${this.constructor.name}`)
        return false

      }

    }
  }
////executed after checkAndRun
  update(){
    var order;
    if(this.replicate){
      initReplicate(this,order)
    }else{
      this.localUpdate();
    }

    // if(isArray(this.inputs[0])){
    //   // console.log(this.inputs[0]);
    //   var order;
    //   initReplicate(this,order);
    // }else{
    //   if(this.typeCheck(this.inputs[0],this.inputTypes[0])){
    //     console.log(this.inputs[0]);
    //
    //     this.outputs=[this.localUpdate(this.inputs)];
    //   }
    // }
    this.updated=true;
    this.updateTime=Date.now()
  }

  localUpdate(){
    throw new Error("Can't update base component");
  }

};
////actual components start here ////
class CanvasComp extends BaseComponent{
  constructor(){
    super();
  }

  localUpdate(inputs){

  }
}
class AdditionComp extends BaseComponent{
  constructor(a,b){
    super();
    this.inputTypes=[Number,Number];
    this.outputTypes=[Number];

  }

  localUpdate(inputs){

    // // this.outputs=[this.inputs[0]+this.inputs[1]];
    return inputs[0]+inputs[1];
  }
}
class SubtractionComp extends BaseComponent{
  constructor(a,b){
    super();
    this.inputTypes=[Number,Number];
    this.outputTypes=[Number];

  }

  localUpdate(inputs){

    // // this.outputs=[this.inputs[0]+this.inputs[1]];
    return inputs[0]-inputs[1];
  }
}
class MultiplicationComp extends BaseComponent{
  constructor(a,b){
    super();
    this.inputTypes=[Number,Number];
    this.outputTypes=[Number];

  }

  localUpdate(inputs){

    // // this.outputs=[this.inputs[0]+this.inputs[1]];
    return inputs[0]*inputs[1];
  }
}
class DivisionComp extends BaseComponent{
  constructor(a,b){
    super();
    this.inputTypes=[Number,Number];
    this.outputTypes=[Number];

  }

  localUpdate(inputs){

    // // this.outputs=[this.inputs[0]+this.inputs[1]];
    return inputs[0]/inputs[1];
  }
}

class NumberComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[Number];
    this.outputTypes=[Number];
  }

  localUpdate(input){
    return new Number(input);
  }

};
///differentiate integers
class IntegerComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[Number];
    this.outputTypes=[IntegerObj]
  }

  localUpdate(input){
    return new IntegerObj(input)
  }
};






class SliderComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[Number,Number,Number];
    this.outputTypes=[Number];
  }
};
class AccessIndexComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[[PointObj],Number];
    this.outputTypes=[];
  }

  localUpdate(inputs){


    let obj=inputs[0];
    let i=inputs[1];

    return obj[i];
  }
}
class AccessArrayComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=["Tree",Number,Number];
    this.outputTypes=[];
  }


  localUpdate(inputs){
    let tree=inputs[0];
    let depth=inputs[1];
    let index=inputs[2];

    if(rankArray(tree)<depth){
      throw new Error("Requested Depth does not exist ")
    }else{
      return accessArray(tree,depth,index)
    }

    function accessArray(obj,rank=0,i=0,count=0){
    	if(count===rank-1){
        if(obj[i]) return obj[i]
        else throw new Error("Requested Index does not exist")
    	}else{
    		return(accessArray(obj[0],rank,i,count+1))
    	}
    }

  }
}
class PointComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[Number,Number,Number];
    this.outputTypes=[PointObj];
  }
  localUpdate(inputs){
    return new PointObj(inputs[0],inputs[1],inputs[2])
  }

};



class ColorComp extends BaseComponent{
  constructor(){
    super();

    this.inputTypes=[Number]
    this.outputTypes=[ColorObj]
  }
  localUpdate(inputs){

    // let col='#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
    // let col=["Red","Blue","Yellow","Green"]
    // let col=["White","#404040","#808080","#CCCCCC","#FFFFFF"]
    let col=["White","White","#586e75","#657b83","#839496","#93a1a1","#eee8d5","#fdf6e3"]
    let color=new ColorObj(col[Math.floor(inputs[0]*col.length)])

    return color


    // return inputs[0]
  }
}

class ColorSVGComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[RectObj,ColorObj]
    this.outputTypes=[RectObj]
  }
  localUpdate(inputs){

    inputs[0].fill=inputs[1].color
    return inputs[0]
  }
}

class PolygonComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[[PointObj],Boolean]
    this.outputTypes=[PolygonObj]
  }
  localUpdate(inputs){

    let points=inputs[0]
    let closed=inputs[1]


    let p=new PolygonObj(points,closed);
    p.getSVG();
    return p
  }
}
class GridComponent extends BaseComponent{
  constructor(){
    super()
    this.inputTypes=[Number]
    this.outputTypes=[RectObj]
  }
  localUpdate(inputs){
    let countX=Math.floor(Math.random() * 5) + 2
    let countY=Math.floor(Math.random() * 5) + 2
    let X=[0]
    let Y=[]
    let maxX=0;
    let maxY=0;
    for(let i=0;i<countX;i++) {
      let j=Math.random()
      X.push(j)
      maxX+=j;
    }
    for(let i=0;i<countY;i++) {
      let j=Math.random()
      Y.push(j)
      maxJ+=j;
    }

    X.sort;
    Y.sort;

    let rects=[];

    X.forEach(i=>{
      Y.forEach(j=>{
        let pointA=new PointObj((i/maxX),(j/maxY))
        let pointB=new PointObj((X[i]/maxX),(j/maxY))
        let newRect=new RectObj(new PointObj(i,j),new PointObj())

      })
    })





  }
}
class TriangleComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[PointObj,PointObj,PointObj]
    this.outputTypes=[PolygonObj]
  }
  localUpdate(inputs){
    let points=inputs;

    let p=new PolygonObj(points,true);
    p.getSVG();
    return p

  }
}

class RenderPolygonComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[PolygonObj,String,String,Number]
    this.outputTypes=[PolygonObj]
  }
  localUpdate(inputs){
    console.log(inputs);


    let pg=inputs[0]

    let svg=pg.svg

    svg.fill=inputs[1]
    svg.stroke=inputs[2]
    svg.strokeWidth=inputs[3]

    return pg;

  }
}
class RectComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[PointObj,PointObj]
    this.outputTypes=[RectObj]
  }
  localUpdate(inputs){
    return new RectObj(inputs[0],inputs[1]);

  }
}

class EdgeComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[RectObj,Number]
    this.outputTypes=[LineObj]
  }
  localUpdate(input){
    let rect=input[0]
    let sides=input[1]

    let lines=rect.edges();
    let newLines=[]
    for(let i=0;i<lines.length-1;i++){
      if(sides<0.3){
        newLines.push(lines[i])
      }
    }
    return newLines;
    // return rect.edges();
  }
}

class LineComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes = [PointObj,PointObj];
    this.outputTypes = [LineObj];
  }
  localUpdate(inputs){

    return new LineObj(inputs[0],inputs[1]);

  }
};

class LineByPointDirLengthComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[PointObj,Number,Number];
    this.outputTypes=[LineObj]
  }

  localUpdate(inputs){
    var origin=inputs[0];
    var length=inputs[1];
    var dirChance=inputs[2]


    ////create a vector on the fly


    var vector=new VectorObj();
    var dir= [-1,1,1,-1][Math.floor(dirChance *4)];
    var axis= ["x","y"][Math.floor(dirChance * 2)];
    vector[axis]=dir;



    var endPoint=new PointObj(origin.x+(vector.x*length),origin.y+(vector.y*length),origin.z+(vector.z*length))

    // return new LineObj(origin,endPoint)
    // origin=new PointObj(0,2,0)
    // endPoint=new PointObj(2,2,0)
    return new LineObj(origin,endPoint)

  }
}
class LineDivComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes = [LineObj, Number];
		this.outputTypes = [PointObj];
  }
  localUpdate(inputs){
    var newPoints = [];

    var line = inputs[0];
    var divs = inputs[1];




    if(divs<2) {
      // divs=Math.floor(divs*10)+2
      divs=Math.floor(Math.random() * 4) + 2
    }


    // if(divs<2)
    //   return [newPoints];

    for(var i=0; i<divs; i++){
      var u = i / (divs-1);
      var xx = (line.b.x - line.a.x)*u + line.a.x;
      var yy = (line.b.y - line.a.y)*u + line.a.y;
      var zz = (line.b.z - line.a.z)*u + line.a.z;
      var pt = new PointObj(xx,yy,zz);
      newPoints.push(pt);
    }

    return newPoints;
  }
};

class TrimLineComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[WallObj,WallObj]
    this.outputTypes=[WallObj]
  }
  localUpdate(inputs){
    let knife=inputs[0].curve
    let geo=inputs[1].curve
    let parallel=true;
    let intercepts=true;

    let newGeo;
    let col='#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);

    let eq1=knife.equation()
    let eq2=geo.equation()

    if(eq1.m===eq2.m || eq1.m===-eq2.m){
      intercepts=false
    }else{
      parallel=false
      let x,y
      if(eq1.m===0 || eq1.m===-0){
        y=knife.a.y;
      }else{
        if(eq2.m===0 || eq2.m===-0) y=geo.a.y;
      }
      if(eq1.m===Infinity || eq1.m===-Infinity){
        x=knife.a.x;
      }else{
        if(eq2.m===Infinity || eq2.m===-Infinity)x=geo.a.x;
      }

      if(geo.a.x===geo.b.x){
        if(x!=geo.a.x) intercepts=false
      }else{
        if(x<geo.a.x && x<geo.b.x){
          intercepts=false
        }else{
          if(x>geo.a.x && x>geo.b.x) intercepts=false
        }
      }
      if(geo.a.y===geo.b.y){
        if(y!=geo.a.y) intercepts=false
      }else{
        if(y<geo.a.y && y<geo.b.y){
          intercepts=false
        }else{
          if(y>geo.a.y && y>geo.b.y) intercepts=false
        }

      }
      if(knife.a.x===knife.b.x){
        if(x!=knife.a.x) intercepts=false
      }else{
        if(x<knife.a.x && x<knife.b.x){
          intercepts=false
        }else{
          if(x>knife.a.x && x>knife.b.x) intercepts=false
        }
      }
      if(knife.a.y===knife.b.y){
        if(y!=knife.a.y) intercepts=false
      }else{
        if(y<knife.a.y && y<knife.b.y){
          intercepts=false
        }else{
          if(y>knife.a.y && y>knife.b.y) intercepts=false
        }

      }
      if(intercepts){
        newGeo=new LineObj()
        newGeo.a=new PointObj(x,y);
        newGeo.b=new PointObj(geo.b.x,geo.b.y);
        return(newGeo)
      }else{
        return(geo)
      }
    }
  }
}

class WallComp extends BaseComponent{

    constructor(){
      super();
      this.inputTypes=[LineObj];
      this.outputTypes=[WallObj];
    }
    localUpdate(input){
      let curve=input[0]
      curve.stroke="black"
      curve.strokeWidth=0.02


      return new WallObj(curve);
    }


}

class ColumnComp extends BaseComponent{

    constructor(){
      super();
      this.inputTypes=[PointObj];
      this.outputTypes=[PointObj];
    }
    localUpdate(inputs){
      let point=inputs[0]
      point.fill="black"
      return point;
    }


}

class FloorComp extends BaseComponent{

    constructor(){
      super();
      this.inputTypes=[RectObj];
      this.outputTypes=[RectObj];
    }
    localUpdate(inputs){
      let rect=inputs[0]

      // rect.fill=col
      rect.fill="white"
      rect.stroke="black"
      rect.strokeWidth=0.003
      return rect;
    }


}

class ListFlattenComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[Array];
    this.outputTypes=[Array];
    this.replicate=false;
  }
  localUpdate(){
    this.outputs[0]=[];
    let out=this.outputs[0]



    ////native es6
    const flatten = list => list.reduce(
        (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
    );

    this.outputs[0]=flatten(this.inputs[0])

  }
}
class ListDeleteByIndexComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[[],Number,Number];
    this.outputTypes=[];
  }
  localUpdate(inputs){
    let list=inputs[0];
    let index=inputs[1];
    let count=inputs[2]
    let newList=Array.from(list)
    newList.splice(index, 1);
    return newList;
  }
}
class MoveGeometryComp extends BaseComponent{
  constructor(){
    super();
    this.inputTypes=[BaseObj,Number,Number,Number]
    this.outputTypes=[BaseObj]
  }
  localUpdate(inputs){
    let geometry=inputs[0]
    let x=inputs[1]
    let y=inputs[2]
    let z=inputs[3]

    if(geometry instanceof PointObj){
      let newPoint=new PointObj(geometry.x+x,geometry.y+y,geometry.z+z)
      return newPoint;
    }
  }
}

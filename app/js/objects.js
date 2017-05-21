////base geometry object class////
class BaseObj{
  constructor(){
    this.id=this.guid();
    this.val=null;
    this.svg={fill:"white",stroke:"black",strokeWidth:0.01};

  }
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
};
////base objects

class IntegerObj extends BaseObj{
  constructor(val){
    super();
    this.val=new Number(val)
  }
}

class ColorObj extends BaseObj{
  constructor(val){
    super();
    this.color=val;
  }
}

class VectorObj extends BaseObj{
  constructor(x=0,y=0,z=0){
    super();
    this.x=x;
    this.y=y;
    this.z=z;

  }
};
////actual geometry objects start here ////

class PointObj extends BaseObj{
  constructor(x=0,y=0,z=0){
    super();
    this.x=x;
    this.y=y;
    this.z=z;
  }

};


class LineObj extends BaseObj{
  constructor(a,b){
    super();
    this.a=a;
    this.b=b;
  }

  length(){
    let dx=Math.abs(this.b.x-this.a.x)
    let dy=Math.abs(this.b.y-this.a.y)
    let dz=Math.abs(this.b.z-this.a.z)


    let length=Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2)+Math.pow(dz,2))
    // let length=this.a.x-this.b.x
    return length
  }

  equation(){
    let line=this;
    let yDiff=line.b.y-line.a.y
    let xDiff=line.b.x-line.a.x

    let m=(line.b.y-line.a.y)/(line.b.x-line.a.x)
    let a=line.a
    if (a.x>line.b.x) a=line.b
    let c=a.y - (m * a.x)
    return {"m":m,"c":c}
  }
};

class RectObj extends BaseObj{
  constructor(a,b){
    super();
    this.a=a;
    this.b=b;
    this.origin={};

    if(a && b){
      this.origin.x=a.x;
      this.origin.y=a.y;

      if(b.x<a.x) this.origin.x=b.x
      if(b.y<a.y) this.origin.y=b.y


      this.width=this.getWidth()
      this.height=this.getHeight()
      }
    }


  getWidth(){
    return Math.abs(this.b.x-this.a.x)
  }

  getHeight(){
    return Math.abs(this.b.y-this.a.y)
  }

  vertices(){
      let v=[]
      v.push(this.a)
      v.push(new PointObj(this.b.x,this.a.y))
      v.push(this.b)
      v.push(new PointObj(this.a.x,this.b.y))

      return v
  }

  edges(){
    let v=this.vertices()

    let e=[]
    for(let i=0;i<v.length;i++){
      e.push(new LineObj(v[i],v[(i+1)%v.length]))
    }
    return e
  }
}

class PolygonObj extends BaseObj{
  constructor(points,closed){
    super();
    this.points=points;
    this.closed=closed;
  }
  getSVG(){
    let points=""


    if(this.points[0]){
      if(this.points[0].length && this.points[0].length>2) {
        this.points[0].forEach(function(point){
          if(points===""){
            points+=`${point.x},${point.y}`
          }else{
            points+=` ${point.x},${point.y}`
          }
        })
      }
    }

    return `<polygon points="${points}" fill="${this.svg.fill}" />`

  }

};
////archi objects

class WallObj extends BaseObj{
  constructor(curve){
    super();
    this.curve=curve
  }

};

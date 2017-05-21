class Link{
  constructor(a,va,b,vb){
    this.id=guid();
    this.a=a;
    this.b=b;
    this.va=va;
    this.vb=vb;
    this.q=0;
  }
}

/////////system definition//////
class System {
  constructor(){
    this.id=guid();
    this.val=null;
    this.components=[];
    this.links=[];
    this.geometry;
    // this.metrics={};//moved to seed prototype
    this.status={lastRun:null,passed:null,failed:null}
  }

  getGeometry(components=this.components){
    var data={lines:[],points:[],polygons:[],rects:[],lengths:[],walls:[]};
    var addData=function(d){
      if(isArray(d)){
        for(var i=0;i<d.length;i++){
          addData(d[i]);
        }
      }else{
        if(d instanceof PointObj){

          data.points.push(d);
        }else if(d instanceof WallObj){
          data.walls.push(d.curve)
        }else if(d instanceof LineObj){
          data.lines.push(d)
        }else if(d instanceof PolygonObj){
          data.polygons.push(d);
        }else if(d instanceof RectObj){
          data.rects.push(d)
        }
      }
    };
    let drawComps=[TriangleComp,EdgeComp,ColorComp,ColorSVGComp,WallComp,ColumnComp,FloorComp,PointComp,LineComp,LineDivComp,PolygonComp,RectComp,AccessArrayComp,AccessIndexComp,MoveGeometryComp,ListDeleteByIndexComp,LineByPointDirLengthComp,TrimLineComp];
    components.forEach(function(component){
      if(component.passedRun){
        drawComps.forEach(function(comp){

          if(component instanceof comp){
            component.outputs.forEach(function(out){
              // if(comp===LineByPointDirLength){console.log((out));}
              addData(out);
            })
          };
        })
      }else{

      }
    });

    data.summary={"lines":data.lines.length,"points":data.points.length,"rects":data.rects.length}


    return data;


  }

  addComponent(c){
    // this.components[c.guid]=c;
    this.components.push(c);
    return c;
  }

  getComponent(id){
    ///why can't i return a single component instead of an array??
    return this.components.filter(function(component){return component.id == id});
  }

  addLink(a,va,b,vb){
    let l=new Link(a.id,va,b.id,vb);
    this.links.push(l);
    return l;
  }

  getLinks(c,type){
    if(type==="parents"){
      return this.links.filter(function(link){return link.b === c.id});
    }else if(type ==="children"){
      return this.links.filter(function(link){return link.a === c.id});
    }
  }



  rank(){
    //////find the source components
    let self=this;
    let c=this.components;
    let l=this.links;

    // this.metrics.inputs=0
    // this.metrics.outputs=0


    let i=[];
    let o=[];




    ///function to rank children
    let rankComp=function(p){
      ///see if an input
      // p.rank=0;
      let pl=self.getLinks(p,"parents");
      if(pl.length === 0){
        i.push(p);
      }

      ///see if got children

      let cl=self.getLinks(p,"children");
      if(cl.length=== 0) o+=1;
      else{
        cl.forEach(function(l){
          let ch=self.getComponent(l.b);

          if(ch[0].rank<p.rank+1){ch[0].rank=p.rank+1};
          // rankChildren(ch);
        });
      }

    }
    ///go downstream from source components
    c.forEach(function(cc){
      rankComp(cc)
    })

    ///set input and output counts

    this.status.i=i.length
    this.status.o=o.length





    ////sort based on rank
    c.sort(function (a, b) {
      if (a.rank > b.rank) {
        return 1;
      }
      if (a.rank < b.rank) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    return c;
  }

  update(){
    this.status.lastRun=Date.now()
    this.status.passed=0;
    this.status.failed=0;
    let self=this;
    let c=this.components;
    c.forEach(function(cc){
      let i=0;
      cc.inputs.forEach(function(input){
        if(input instanceof BaseComponent){
          self.addLink(input,0,cc,i)
        }else{
          if(input || input===0){
            cc.inputs[i]=[input];

          }
        }
        i++;
      })
    })

    this.rank();
    let l=this.links;

    //iterate through each component (assumes ranked and in right order)
    c.forEach(function(cc){
      ///find all the links that lead to this component using id
      let cl=self.getLinks(cc,"parents");
      if(cl.length>0){
        ////if there are links, update the input values based on source node output
        cl.forEach(function(link){
          ///get the actual components using id
          let source=self.getComponent(link.a);
          let target=self.getComponent(link.b);
          // console.log(source[0].outputTypes[0].name);
          target[0].inputs[link.vb]=source[0].outputs[link.va];
        })
      }
      ///do component update

      // console.log(cc);
      cc.checkAndRun();
      if(cc.passedRun) self.status.passed+=1;
      if(!cc.passedRun) self.status.failed+=1;
    })


    this.geometry=this.getGeometry();



    ///output updated components
    // console.log(system.components);
  }

  addAddition(a,b){
    let c = new AdditionComp();
    c.inputs[0]=a;
    c.inputs[1]=b;
    return this.addComponent(c);
  }
  addSubtraction(a,b){
    let c = new SubtractionComp();
    c.inputs[0]=a;
    c.inputs[1]=b;
    return this.addComponent(c);
  }
  addMultiplication(a,b){
    let c = new MultiplicationComp();
    c.inputs[0]=a;
    c.inputs[1]=b;
    return this.addComponent(c);
  }
  addDivision(a,b){
    let c = new DivisionComp();
    c.inputs[0]=a;
    c.inputs[1]=b;
    return this.addComponent(c);
  }
  addNumber(n){
    let c = new NumberComp();
    // if(!isArray(n)) n=[n]
    c.inputs[0]=n;

    // toNum(n,c.inputs[0]);
    return this.addComponent(c);
  }

  addPoint(x,y,z=0){
    let c=new PointComp();
    c.inputs[0] = x;
    c.inputs[1] = y;
    c.inputs[2] = z;
    return this.addComponent(c);
  }

  addPolygon(points,closed=true){
    let c=new PolygonComp();
    c.inputs[0]=points;
    c.inputs[1]=closed;
    return this.addComponent(c)
  }
  addTriangle(points,closed=true){
    let c=new TriangleComp();
    c.inputs[0]=points
    c.inputs[1]=true
    return this.addComponent(c)
  }

  addLine(a,b){
    let c =new LineComp();
    c.inputs[0]=a;
    c.inputs[1]=b;
    return this.addComponent(c);
  }
  addLineByPointDirLength(p,d){
    let c =new LineByPointDirLengthComp();
    c.inputs[0]=p;
    c.inputs[1]=d;
    return this.addComponent(c);
  }

  addTrimLine(knife,geometry){
    let c=new TrimLineComp();
    c.inputs[0]=knife
    c.inputs[1]=geometry
    return this.addComponent(c);

  }
  addWall(curve){
    let c=new WallComp()
    c.inputs[0]=curve
    return this.addComponent(c)

  }
  addColumn(point){
    let c=new ColumnComp()
    c.inputs[0]=point
    return this.addComponent(c)

  }
  addFloor(rect){
    let c=new FloorComp()
    c.inputs[0]=rect
    return this.addComponent(c)

  }
  addRect(a,b){
    let c=new RectComponent();
    c.inputs[0]=a;
    c.inputs[1]=b;
    return this.addComponent(c);
  }
  addLineDiv(l,n){
    let c =new LineDivComp();
    c.inputs[0]=l;
    c.inputs[1]=n;

    return this.addComponent(c);
  }

  addColor(color){
    let c=new ColorComp();
    c.inputs[0]=color;

    return this.addComponent(c);
  }
  addColorSVG(o,col){
    let c=new ColorSVGComp
    c.inputs[0]=o;
    c.inputs[1]=col;

    return this.addComponent(c);
  }

  addAccessArray(o,d,i){
    let c=new AccessArrayComp()
    c.inputs[0]=o;
    c.inputs[1]=d;
    c.inputs[2]=i;

    return this.addComponent(c);
  }
  addAccessIndex(o,i){
    let c=new AccessIndexComp()
    c.inputs[0]=o;
    c.inputs[1]=i;
    return this.addComponent(c);
  }

  addListFlatten(a){
    let c =new ListFlattenComp()
    c.inputs[0]=a;
    return this.addComponent(c)
  }

  addRenderPolygon(polygon,fill="none",stroke="black",strokeWidth="0.001"){

    let c=new RenderPolygonComp()
    c.inputs[0]=polygon
    c.inputs[1]=fill
    c.inputs[2]=stroke
    c.inputs[3]=strokeWidth
    return this.addComponent(c)

  }
  addListDeleteByIndex(list,index,count=1){
    let c=new ListDeleteByIndexComp()
    c.inputs[0]=list
    c.inputs[1]=index
    c.inputs[2]=count
    return this.addComponent(c)
  }
  addMoveGeometry(geometry,x=0,y=0,z=0){
    let c=new MoveGeometryComp()
    c.inputs[0]=geometry
    c.inputs[1]=x
    c.inputs[2]=y
    c.inputs[3]=z
    return this.addComponent(c)

  }



};

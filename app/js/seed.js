
/////////seed definition//////
class Seed {
  constructor(x=2,y=2,ingredients=[],numMetric=10,numInputs=1){
    this.id=guid();
    this.typology={x,y,ingredients,numMetric,numInputs}
    this.typology.components=[];
    this.genotype={metric:[],func:[],topo:[]}
    this.phenotype=new System;
    this.outputs=[];
    this.parents=[];
    this.outputTypes=[];
    this.init();
    this.metrics;

  }
  ///initialize: get components from ingredients and update numInputs
  init(){
    ////get numinputs
    this.typology.ingredients.forEach(ing=>{
      let comp=new ing()
      if(comp.inputTypes.length>this.typology.numInputs) this.typology.numInputs=comp.inputTypes.length;
      this.typology.components.push(comp)
    })
  }

///function to generate a new genotype based on typology
  generate(){
    this.genotype=this.getGenotype()
  }

  /////get metrics
  getMetrics(){
    let eff=null,cc=null,geo=null,gene=null
    let system=this.phenotype;

    let m=this.metrics;
    let n=system.components.length;
    let e=system.links.length;
    let p=system.status.passed;
    let i=system.status.i
    let o=system.status.o

    ///get efficiency
    eff=(p/n)
    ///get CC
    cc=e+i+o-n

    ///get geometric sum
    if(system.geometry.summary){
      geo=0;
      for(var geom in system.geometry.summary){
        geo+=system.geometry.summary[geom];
      }

    }

    ///get gene
    gene=1;
    if(this.parents.length){
      // console.log(this.parents[0].genotype);
      // gene=Seed.getHamming(this.genotype,this.parents[0].genotype)
    }



    this.metrics={efficiency:eff,CC:cc,i:i,o:o,e:e,n:n,geometric:geo,genetic:gene}



  }
  ////get hamming distance between two genotypes
  static getHamming(geno1,geno2=geno1){


    let diff=0;
    let longest=0
    let hd=0

    if(geno1 !==geno2){
      ///get strings
      let strand1=JSON.stringify(geno1)
      let strand2=JSON.stringify(geno2)
      ///get longest
      let longest=strand1.length;
      if(strand2.length>strand1.length) longest=strand2.length;



      ////running as simultaneous loops instead of singular
      for(let j=0;j<longest;j+=8){
        for(let i=j;i<j+8;i++){
          if(strand1[i] && strand2[i]) {
            if(strand1[i] !== strand2[i]){
              diff++
            }
          }else{
            diff++
          }

        }
      }
      hd=diff/longest
    }
    // console.log(hd);

    return hd

  }

  //////static function to mate

  static mate(seed1,pushParentA,seed2,pushParentB,mate=NP,n=1,callback){




    // console.log(callback);




    let type=seed1.typology;
    let child=new Seed(type.x,type.y,type.ingredients,type.numMetric,type.num)





    let geno1=seed1.genotype
    let geno2=seed2.genotype
    let geno3=child.genotype

    let mateWorker = new Worker('../js/seedWorker.js');

    mateWorker.postMessage([geno1,geno2,n]);
    mateWorker.onmessage=function(e){
      geno3.metric=e.data[0]
      geno3.func=e.data[1]
      geno3.topo=e.data[2]



      child.parents=[];
      if(pushParentA) child.parents.push({id:seed1.id,genotype:seed1.genotype})
      if(pushParentB) child.parents.push({id:seed2.id,genotype:seed2.genotype})

      // child.update()
      // return child;

      mateWorker.terminate()



      callback(child,seed1,seed2)

    }
    //
    // ////create fused numeric genes
    // geno3.metric=Seed.recomb(geno1.metric,geno2.metric,n)
    //
    //
    // /////create fused functional genes
    // geno3.func=Seed.recomb(geno1.func,geno2.func,n)
    //
    // /////create fused topo genes
    // geno3.topo=Seed.recomb(geno1.topo,geno2.topo,n)
    //
    // // if(mutate) child=Seed.mutate(child);
    // child.parents=[{id:seed1.id,genotype:seed2.genotype},{id:seed1.id,genotype:seed2.genotype}];
    //
    //
    // child.update()
    // return child;

  }


  ////fuse two sets
  static recomb(geno1,geno2,n=1){

    n+=1;
    let div=1/n;
    let parents=[geno1,geno2]
    // console.log(div);
    let len=geno1.length

    let geno3=[];

    let curParent;
    let sliceA;
    let sliceB;

    // console.log(n);
    ////split

    for(let i=0;i<n;i++){
      curParent=parents[(i%2)];
      sliceA=Math.floor(i*div*len)
      sliceB=Math.floor((i+1)*div*len)


      geno3.push(...curParent.slice(sliceA,sliceB))
    }
    // console.log(geno3);


    return geno3

  }

/////static clone
static clone(seed){


  let typology=seed.typology;
  let child=new Seed(typology.x,typology.y,typology.ingredients,typology.numMetric,typology.num)
  child.generate();
  child.genotype=seed.genotype;
  child.parents=[{id:seed.id,genotype:seed.genotype}];
  return child;

}
//////static mutate
  static mutate(seed,chance=0.05){


    let genotype=seed.genotype
    let metric=genotype.metric;
    let func=genotype.func;
    let topo=genotype.topo;
    let typology=seed.typology;
    let components=typology.components;
    let outputTypes=[];



    ///functional genes
    let funcGene=[]
    let topoGene=[]
    let metricGene=[]


    for(let i=0;i<metric.length;i++){
      let num=metric[i]
      if(chance>0 && Seed.rollDice(chance*2)){
          num=Math.random()
      }


      outputTypes.push({type:"Number",rank:0})
      metricGene.push(num)
    }


    for(let x=0;x<typology.x;x++){
      let currX=[];
      let inputs=[]
      let currOutputTypes=[];

        for(let y=0;y<typology.y;y++){
          let gene={func:func[x][y],topo:topo[x][y]}

          ///////////
          if(chance>0 && Seed.rollDice(chance)){

            gene=seed.getGene(outputTypes)
          }

          ////////
          currX.push(gene.func)
          inputs.push(gene.topo)
          //add to currentOutPutTypes
          currOutputTypes.push({type:components[gene.func].outputTypes[0].name,rank:x+1})
        }
        funcGene.push(currX)
        topoGene.push(inputs)
        ///add to outputTypes
        outputTypes.push(...currOutputTypes)

    }

    // console.log(JSON.stringify(topo[0]));
    // console.log(JSON.stringify(topoGene[0]));


    let child=new Seed(typology.x,typology.y,typology.ingredients,typology.numMetric,typology.num)
    child.parents=seed.parents;
    child.genotype=seed.genotype
    child.genotype.func=funcGene
    child.genotype.topo=topoGene
    child.genotype.metric=metricGene

    return child;


  }

  static rollDice(chance=0.15){

    return Math.random()<chance;
  }


  ////create roulette wheel
 static rouletteWheel(collection,fitness){



   let arrFitness=[];
   let sumFitness=0;
   let wheel=[];

   for(let i=0;i<collection.length;i++){
     let thisFitness;
     if(fitness){
       if(fitness==="vote"){

         thisFitness=collection[i]["vote"]
         thisFitness+=1;
       }else{
         thisFitness=collection[i]["metrics"][fitness]

       }

     }else{
       thisFitness=1;
     }
     arrFitness.push(thisFitness);
     sumFitness+=thisFitness;
   }
   wheel.push(0);
   for(let i=0;i<arrFitness.length;i++){
     wheel.push(wheel[i]+(arrFitness[i]/sumFitness))
   }



   return wheel;
 }

 static spinWheel(wheel,chance=Math.random()){
   let index;
   let l=wheel.length;

   for(let i=0;i<l;i++){
     if(chance>wheel[i] && chance<wheel[i+1]){
       index=i;
       return index;
     }
   }

  //  return index


 }

////get matching outputs
  getMatches(arr, type) {
      var matches = [], i;
      for(i = 0; i < arr.length; i++)
          if (arr[i].type === type)
              matches.push(i);
      return matches;
  }


  ///get one functional and it's topological gene
  getGene(outputTypes,typeCheck=true){
    let currType=Math.floor(Math.random() * (this.typology.ingredients.length))
    let currInputs=[]
    let components=this.typology.components;
    // console.log(components);


    /////enforce component validity
    if(typeCheck){
      let seekFunc=true;
      for(let i=0;i<components.length*2;i++){
        ///break if comp found
        if(seekFunc===false) break;

        ///look for a component
        currType=Math.floor(Math.random() * (this.typology.ingredients.length))

        seekFunc=false;



        for(let i=0;i<components[currType].inputTypes.length;i++){

          let inputType=components[currType].inputTypes[i].name
          let matches=this.getMatches(outputTypes,inputType)
          if(!matches.length || matches.length===0){
            seekFunc=true
            break
          }
        }
      }

    }


    ////look for all the inputs
    for(let i=0;i<this.typology.numInputs;i++){
      let topoIndex=Math.floor(Math.random() * (outputTypes.length))
      if(typeCheck && components[currType].inputTypes[i]){
        let inputType=components[currType].inputTypes[i].name
        if(outputTypes[topoIndex].type!==inputType){
          let matches=this.getMatches(outputTypes,inputType)
          if(matches.length && matches.length>0){
            topoIndex=matches[Math.floor(Math.random() * (matches.length))]

          }else{
            // console.log(components[currType]);
          }
          // console.log(matches);
        }
      }
      currInputs.push(topoIndex)
    }

    return({func:currType,topo:currInputs})


  }


///generate new genotypes
  getGenotype(){
    ///convert ingredients into sample components
    let ingredients=this.typology.ingredients;
    let components=this.typology.components;
    let outputTypes=[]

    ///empty lists for genes
    let metricGene=[]
    let funcGene=[]
    let topoGene=[]


    ////metric genes
    for(let i=0;i<this.typology.numMetric;i++){
      ///add to outputTypes
      outputTypes.push({type:"Number",rank:0})
      //generate value
      metricGene.push(Math.random())

    }

    ///functional genes
    for(let x=0;x<this.typology.x;x++){
      let typeCheck=true;
      let currX=[];
      let inputs=[]
      let currOutputTypes=[];
      for(let y=0;y<this.typology.y;y++){
        let gene=this.getGene(outputTypes,typeCheck)
        currX.push(gene.func)
        inputs.push(gene.topo)
        //add to currentOutPutTypes
        currOutputTypes.push({type:components[gene.func].outputTypes[0].name,rank:x+1})
      }
      funcGene.push(currX)
      topoGene.push(inputs)
      ///add to outputTypes
      outputTypes.push(...currOutputTypes)
    }

    return({metric:metricGene,func:funcGene,topo:topoGene})
  }





///function to update the phenotype based on the genotype
  update(){
    // let sup=performance.now()


    ///create numeric components
    let metricGene=this.genotype.metric
    let funcGene=this.genotype.func
    let topoGene=this.genotype.topo
    let outputs=this.outputs
    // let components=this.components
    let ingredients=this.typology.ingredients
    let system=this.phenotype;
    let currRank=0;


    ///alternative
    // let i=0;
    metricGene.forEach(function(gene,i){
      let num=system.addNumber(metricGene[i])
      //naughty but useful addion of meta-vaules to components
      num["cgpPostion"] = [0, i];
      outputs.push({comp:num,rank:currRank})
      // i++;
    })


    //
    // for(let i=0;i<metricGene.length;i++){
    //   let num=system.addNumber(metricGene[i])
    //   //naughty but useful addion of meta-vaules to components
    //   num["cgpPostion"] = [0, i];
    //   outputs.push({comp:num,rank:currRank})
    // }


    ////create the rest of components
    for(let x=0, lenx = this.typology.x;x<lenx;x++){
      currRank+=1;
        // let startP=performance.now()

      for(let y=0,leny = this.typology.y;y<leny;y++){
        let type=ingredients[funcGene[x][y]]
        let topo=topoGene[x][y]

        let comp=new type();
        //naughty but useful addion of meta-vaules to components
        comp["cgpPostion"] =  [x+1,y];
        system.addComponent(comp)
        // console.log(comp);

        // components.push(comp)
        outputs.push({comp:comp,rank:currRank})



        comp.inputTypes.forEach(function(d,i){
          system.addLink(outputs[topo[i]].comp,0,comp,i)

        })


      }
      // console.log(performance.now()-startP);
    }


    system.update()


    this.getMetrics()
    // console.log(`seed update took ${performance.now()-sup}`);


    // console.log(JSON.stringify(this.metrics));


  }



};

onmessage = function(e) {

  let geno=e.data;

  let result=[];
  result.push(recomb(geno[0].metric,geno[1].metric,geno[2]))
  result.push(recomb(geno[0].func,geno[1].func,geno[2]))
  result.push(recomb(geno[0].topo,geno[1].topo,geno[2]))

  postMessage(result);
  result=[]
}

function recomb(geno1,geno2,n=1){

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


  return geno3

}

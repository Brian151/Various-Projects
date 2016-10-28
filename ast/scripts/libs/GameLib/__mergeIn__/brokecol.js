var reds =[];
var greens =[];
var blues =[];
var grays =[];
var yellows =[];
var oranges =[];
var errorMargin = 10;
var colUpperLimit =100;
var r = 0;
var g = 0;
var b = 0;
var running =2;
function generateCol(){
if ((r<colUpperLimit)&&(g<colUpperLimit)&&(b<colUpperLimit)){
if(g==colUpperLimit){
r++;
g=0;
b=0;
}
if(b==colUpperLimit){
g++;
b=0;
}
regCol();
b++;
}else{
running=false;
}

}

function regColor(){
if ((r>0)&&(g==0)&&(b==0)){
reds.push("["+r+","+g+","+b"]");
}
if ((r==0)&(g>0)&(b==0)) {
greens.push("["+r+","+g+","+b"]");
}
if ((r==0)&(g==0)&(b>0)) {
blues.push("["+r+","+g+","+b"]");
}
if ((r==g)&(g==b)) {
grays.push("["+r+","+g+","+b"]");
}

}

while(running>0){
generateCol();
if (running==1){
running =0;
var out ="";
for (i in reds){
out = out += reds[i] + "\n";
}
}

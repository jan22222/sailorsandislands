

let Netz = [];
let canvas;
let ctx;
let canvasWidth = 1250;
let canvasHeight =1250;
let resources=[0,0,0,0,0];
let asteroids = [];
let i = 0;
let j = 0;
let ortspunkte=[];
var a1=document.getElementById(a1);
var a2=document.getElementById(a1);
var a3=document.getElementById(a1);
var a4=document.getElementById(a1);
var a5=document.getElementById(a1);
let resou="";
let free_stations=2;
trans=[];
trans[	1	]=	2	;
trans[	2	]=	1	;
trans[	3	]=	4	;
trans[	4	]=	3	;
trans[	5	]=	6	;
trans[	6	]=	5	;
trans[	7	]=	8	;
trans[	8	]=	7	;
trans[	9	]=	10	;
trans[	10	]=	9	;
trans[	11	]=	12	;
trans[	12	]=	11	;
trans[	13	]=	14	;
trans[	14	]=	13	;
trans[	15	]=	16	;
trans[	16	]=	15	;
trans[	17	]=	18	;
trans[	18	]=	17	;
trans[	19	]=	20	;
trans[	20	]=	19	;
trans[	21	]=	21	;
trans[	22	]=	23	;
trans[	23	]=	22	;
trans[	24	]=	25	;
trans[	25	]=	24	;
trans[	26	]=	27	;
trans[	27	]=	26	;
trans[	28	]=	29	;
trans[	29	]=	28	;
trans[	30	]=	31	;
trans[	31	]=	30	;
trans[	32	]=	33	;
trans[	33	]=	32	;
trans[	34	]=	35	;
trans[	35	]=	34	;
trans[	36	]=	37	;
trans[	37	]=	36	;
trans[	38	]=	39	;
trans[	39	]=	38	;
trans[	40	]=	40	;
trans[	41	]=	42	;
trans[	42	]=	41	;
trans[	43	]=	44	;
trans[	44	]=	43	;
trans[	45	]=	46	;
trans[	46	]=	45	;
trans[	47	]=	48	;
trans[	48	]=	47	;
trans[	49	]=	50	;
trans[	50	]=	49	;
trans[	51	]=	52	;
trans[	52	]=	51	;
trans[	53	]=	54	;
trans[	54	]=	53	;
trans[	55	]=	56	;
trans[	56	]=	55	;
trans[	57	]=	58	;
trans[	58	]=	57	;
trans[	59	]=	60	;
trans[	60	]=	59	;
trans[	61	]=	61	;
trans[	62	]=	63	;
trans[	63	]=	62	;
trans[	64	]=	65	;
trans[	65	]=	64	;
trans[	66	]=	67	;
trans[	67	]=	66	;
trans[	68	]=	69	;
trans[	69	]=	68	;
trans[	70	]=	71	;
trans[	71	]=	70	;
trans[	72	]=	73	;
trans[	73	]=	72	;
trans[	74	]=	75	;
trans[	75	]=	74	;
trans[	76	]=	77	;
trans[	77	]=	76	;
trans[	78	]=	79	;
trans[	79	]=	78	;
trans[	80	]=	80	;
trans[	81	]=	82	;
trans[	82	]=	81	;
trans[	83	]=	84	;
trans[	84	]=	83	;
trans[	85	]=	86	;
trans[	86	]=	85	;
trans[	87	]=	88	;
trans[	88	]=	87	;
trans[	89	]=	90	;
trans[	90	]=	89	;
trans[	91	]=	92	;
trans[	92	]=	91	;
trans[	93	]=	94	;
trans[	94	]=	93	;
trans[	95	]=	96	;
trans[	96	]=	95	;
trans[	97	]=	98	;
trans[	98	]=	97	;
trans[	99	]=	100	;
trans[	100	]=	99	;
trans[	101	]=	101	;
trans[	102	]=	103	;
trans[	103	]=	102	;
trans[	104	]=	105	;
trans[	105	]=	104	;
trans[	106	]=	107	;
trans[	107	]=	106	;
trans[	108	]=	109	;
trans[	109	]=	108	;
trans[	110	]=	111	;
trans[	111	]=	110	;
trans[	112	]=	113	;
trans[	113	]=	112	;
trans[	114	]=	115	;
trans[	115	]=	114	;
trans[	116	]=	117	;
trans[	117	]=	116	;
trans[	118	]=	119	;
trans[	119	]=	118	;
trans[	120	]=	120	;
trans[	121	]=	122	;
trans[	122	]=	121	;
trans[	123	]=	124	;
trans[	124	]=	123	;
trans[	125	]=	126	;
trans[	126	]=	125	;
trans[	127	]=	128	;
trans[	128	]=	127	;
trans[	129	]=	130	;
trans[	130	]=	129	;
trans[	131	]=	132	;
trans[	132	]=	131	;
trans[	133	]=	134	;
trans[	134	]=	133	;
trans[	135	]=	136	;
trans[	136	]=	135	;
trans[	137	]=	138	;
trans[	138	]=	137	;
trans[	139	]=	140	;
trans[	140	]=	139	;
trans[	141	]=	141	;
trans[	142	]=	143	;
trans[	143	]=	142	;
trans[	144	]=	145	;
trans[	145	]=	144	;
trans[	146	]=	147	;
trans[	147	]=	146	;
trans[	148	]=	149	;
trans[	149	]=	148	;
trans[	150	]=	151	;
trans[	151	]=	150	;
trans[	152	]=	153	;
trans[	153	]=	152	;
trans[	154	]=	155	;
trans[	155	]=	154	;
trans[	156	]=	157	;
trans[	157	]=	156	;
trans[	158	]=	159	;
trans[	159	]=	158	;
trans[	160	]=	160	;
trans[	161	]=	162	;
trans[	162	]=	161	;
trans[	163	]=	164	;
trans[	164	]=	163	;
trans[	165	]=	166	;
trans[	166	]=	165	;
trans[	167	]=	168	;
trans[	168	]=	167	;
trans[	169	]=	170	;
trans[	170	]=	169	;
trans[	171	]=	172	;
trans[	172	]=	171	;
trans[	173	]=	174	;
trans[	174	]=	173	;
trans[	175	]=	176	;
trans[	176	]=	175	;
trans[	177	]=	178	;
trans[	178	]=	177	;
trans[	179	]=	180	;
trans[	180	]=	179	;
trans[	181	]=	181	;
trans[	182	]=	183	;
trans[	183	]=	182	;
trans[	184	]=	185	;
trans[	185	]=	184	;
trans[	186	]=	187	;
trans[	187	]=	186	;
trans[	188	]=	189	;
trans[	189	]=	188	;
trans[	190	]=	191	;
trans[	191	]=	190	;
trans[	192	]=	193	;
trans[	193	]=	192	;
trans[	194	]=	195	;
trans[	195	]=	194	;
trans[	196	]=	197	;
trans[	197	]=	196	;
trans[	198	]=	199	;
trans[	199	]=	198	;
trans[	200	]=	200	;
trans[	201	]=	202	;
trans[	202	]=	201	;
trans[	203	]=	204	;
trans[	204	]=	203	;
trans[	205	]=	206	;
trans[	206	]=	205	;
trans[	207	]=	208	;
trans[	208	]=	207	;
trans[	209	]=	210	;
trans[	210	]=	209	;
trans[	211	]=	212	;
trans[	212	]=	211	;
trans[	213	]=	214	;
trans[	214	]=	213	;
trans[	215	]=	216	;
trans[	216	]=	215	;
trans[	217	]=	218	;
trans[	218	]=	217	;
trans[	219	]=	220	;
trans[	220	]=	219	;
trans[	221	]=	221	;
trans[	222	]=	223	;
trans[	223	]=	222	;
trans[	224	]=	225	;
trans[	225	]=	224	;
trans[	226	]=	227	;
trans[	227	]=	226	;
trans[	228	]=	229	;
trans[	229	]=	228	;
trans[	230	]=	231	;
trans[	231	]=	230	;
trans[	232	]=	233	;
trans[	233	]=	232	;
trans[	234	]=	235	;
trans[	235	]=	234	;
trans[	236	]=	237	;
trans[	237	]=	236	;
trans[	238	]=	239	;
trans[	239	]=	238	;
trans[	240	]=	240	;

personal=[];

function Netz_zeichnen(Netz){
    Netz.forEach(punkt => {
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 5;
              
              ctx.beginPath();
              
                ctx.rect(punkt.x, punkt.y, 2, 2);
                ctx.stroke();
                ctx.closePath();
        });
             
          
    }
 



class Punkt{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }

} 
let aktpunkt = new Punkt(0,0);
let aktpunkt1 = new Punkt(0,0);
class ortspunkt{
    constructor(np1,np2,np3,as1,as2,as3){
    this.np1 = np1 ;
    this.np2=np2 ;
    this.np3=np3 ;
    this.as1=as1 ;
    this.as2=as2 ;
    this.as3=as3 ;}
}

function hauszeichnen(color,id){
  
    this.color=color;
   
    this.id=id;
   
    ctx.fillStyle = this.color;
   ctx.strokeStyle="transparent";
    aktpunkt1=Netz[trans[id]-1];

    ctx.beginPath();
    ctx.arc(aktpunkt1.x, aktpunkt1.y, 30, 0, 2 * Math.PI);
    
    ctx.fill();        
    ctx.stroke();
    
  




    var img = document.getElementById("scream");
    ctx.globalAlpha = 1;
   ctx.drawImage(img, aktpunkt1.x-23, aktpunkt1.y-28,44,54);
   ctx.closePath();
    var grd;
var triangleWidth = 20;
var triangleHeight = 10;
var triangleY = canvas.height / 2 - triangleWidth / 2;

//drawTriangle(ctx, aktpunkt.x, aktpunkt.y-20, triangleWidth, triangleHeight, color);

}
function villazeichnen(color,id){
   
  
        this.color=color;
       
        this.id=id;
       
        ctx.fillStyle = this.color;
       ctx.strokeStyle="black";
        aktpunkt1=Netz[trans[id]-1];
    
        ctx.beginPath();
        ctx.arc(aktpunkt1.x, aktpunkt1.y, 30, 0, 2 * Math.PI);
        
        ctx.fill();        
        ctx.stroke();
        
      
    
    
    
    
        var img = document.getElementById("scream");
        ctx.globalAlpha = 1;
       ctx.drawImage(img, aktpunkt1.x-23, aktpunkt1.y-28,44,54);
       ctx.closePath();
        var grd;
    var triangleWidth = 20;
    var triangleHeight = 10;
    var triangleY = canvas.height / 2 - triangleWidth / 2;
    
    
}
function findID(aktpunkt){
    //transrückwärts auswerten um den richtigen ort zu finden
   // aktpunkt im netz finden, index finden, +1, dann die reverse funciton

   let index = Netz.findIndex((item)=> {return item===aktpunkt});
   index++;
   console.log("index");
   console.log(index);
   let ortid = trans.findIndex((item)=> {return item===index});
   //diesen ort eintragen ortid
   return ortid;
  
    
}
function res_auslesen(){
    
}


function free_ort_setzen(){
  //transrückwärts auswerten um den richtigen ort zu finden
 // aktpunkt im netz finden, index finden, +1, dann die reverse funciton
console.log("free ort setzen");
 let index = Netz.findIndex((item)=> {return item===aktpunkt});
 index++;
 console.log("index");
 
 console.log(index);
 let ortid = trans.findIndex((item)=> {return item===index});
 //diesen ort eintragen ortid
 console.log(ortid);
}

function stadtzeichnen(color){
    ctx.fillStyle = color;

    ctx.fillRect(aktpunkt.x-15, aktpunkt.y-15, 30, 30);
    var grd;
var triangleWidth = 30;
var triangleHeight = 20;
var triangleY = canvas.height / 2 - triangleWidth / 2;

//drawTriangle(ctx, aktpunkt.x, aktpunkt.y-30, triangleWidth, triangleHeight, color);

}

class Asteroid{
    constructor(x,y,no,zahl,color) {
        this.visible = true;
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = 0;
        this.radius = 50;
        this.angle = 0;
        this.no = no;
        this.color = color;
        this.zahl=zahl;
        
        // this.Netz_definieren();
        this.Draw();
        asteroids.push(this);
    }
    Draw(){
        
        
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 5;
        ctx.stroke();
        console.log(this.color)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 6);
        var radians = this.angle / Math.PI * 180;
        for(let i = 0; i < 6; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        if (this.no>11){
        if (this.no != 12 && this.no != 34 && this.no != 56&& this.no != 78&& this.no != 100&& this.no != 122&& this.no != 144){
            if (this.no != 33 && this.no != 55 && this.no != 77 && this.no != 99&& this.no != 121&& this.no != 143){    
        let Punkt_für_Netz = new Punkt(this.x -9 - this.radius * Math.cos(vertAngle * 0 + radians), this.y - this.radius * Math.sin(vertAngle * 0 + radians)); 
        Netz.push(Punkt_für_Netz);}

        if (this.no != 23 && this.no != 45 && this.no != 67 && this.no != 89&& this.no != 111&&this.no != 133){    

        let Punkt_für_Netz2 = new Punkt(this.x -5 - this.radius * Math.cos(vertAngle * 1 + radians), -8+ this.y - this.radius * Math.sin(vertAngle * 1 + radians)); 
        Netz.push(Punkt_für_Netz2);}
        }
    }
        ctx.fill();
        ctx.fillStyle="#000033";
        ctx.font = 'italic bold 32px sans-serif';
        let zz=this.zahl.toString();
        if(zz.length!=2){zz=" "+zz;}
        ctx.fillText(zz, this.x-20, this.y+10); 
    
    
    }
}


function find_color(userid)
{
    this.userid=userid;
let foundItem = personal.find((item)=> {return item.id===this.userid});
return foundItem.color;
}

// function orte_laden(){
//     axios.post(  './orte_laden.php')

//          .then((response) => {
//        let orte=response.data;
//        var i;
// for (i = 0; i < orte.length; i++) {
// hauszeichnen(find_color(orte[i].User_Id), orte[i].Ort_Id.toString());
// }
//      }, (error) => {
//      console.log(error);
//      });
//    }

function setupCanvas(map){
   img1 = document.getElementById("scream");
    
    canvas = document.getElementById("my-canvas");
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 5;
  this.zaehler=1;


var i;


let day = "";
let dat="";
  
for(let j = 1; j < 14; j++)
{
for(let i = 1; i < 12; i++){
    var res = map[this.zaehler].res;
    var num=map[this.zaehler].num;
    switch (res) {
            //metals
        case 1:
        day = "grey";
        break;
        //weizen
        case 2:
        day = "yellow";
        break;
        case 3:
        //mud
        day = "brown";
        break;
        case 4:
        //sheep
        day = "lightgreen";
        break;
        case 5:
        //wood
        day = "green";
        break;
        //water
        case 6:
        day = "blue";
        //desert
        case 7:
        day = "lightyellow"
    }

 
let ast = new Asteroid(j*88,i*100+(j % 2) *50,this.zaehler,num,day);
this.zaehler++;

}

}

Netz_zeichnen(Netz);
canvas.addEventListener("click", myClick);


}

function myClick(event) 
{      let  elemLeft = canvas.offsetLeft;
   let elemTop = canvas.offsetTop;
    
 
 
    let xVal = event.pageX - elemLeft;
    let yVal = event.pageY - elemTop;
      var position = new Punkt(xVal,yVal);
      Netz_zeichnen(Netz);
      Netz.every(punkt => {
//every statt foreach, damit nicht zweoi Punkte zugleich gewählt werden.

         if(Math.abs(punkt.x-position.x)<30 && Math.abs(punkt.y-position.y)<30)
         {

            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
              
              ctx.beginPath();
              
                ctx.rect(punkt.x, punkt.y, 2, 2);
                ctx.stroke();
                ctx.closePath();

                aktpunkt = punkt; 
                
                return false;
         } 
         return true;
      });

    


    }
  

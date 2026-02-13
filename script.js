const boardEl=document.getElementById("board");
const statusEl=document.querySelector(".status");
const scoreXEl=document.getElementById("scoreX");
const scoreOEl=document.getElementById("scoreO");

let board=["","","","","","","","",""];
let currentPlayer="X";
let gameActive=true;
let mode="pvp";
let difficulty="easy";

function speak(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.volume = 1;        // 0 to 1
    speech.rate = 1;          // speed
    speech.pitch = 1.2;       // voice tone
    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
}

let scoreX=localStorage.getItem("scoreX")||0;
let scoreO=localStorage.getItem("scoreO")||0;
scoreXEl.innerText=scoreX;
scoreOEl.innerText=scoreO;

// Cat Sound
const catSound = new Audio("https://www.soundjay.com/animal/cat-meow-1.mp3");
catSound.volume = 0.6;


// Optional: lower volume
catSound.volume = 0.6;

const wins=[
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

function createBoard(){
boardEl.innerHTML="";
board.forEach((v,i)=>{
let cell=document.createElement("div");
cell.className="cell";
cell.innerText=v;
cell.onclick=()=>handleClick(i);
boardEl.appendChild(cell);
});
}

function handleClick(i){
if(board[i]||!gameActive) return;
catSound.currentTime = 0;
catSound.play();
move(i,currentPlayer);
if(mode==="ai"&&gameActive&&currentPlayer==="O"){
setTimeout(aiMove,300);
}
}

function move(i,player){
board[i]=player;
createBoard();
let winCombo=checkWin(player);
if(winCombo){
statusEl.innerText = player + " Wins!";
speak("Player " + player + " wins!");
catSound.currentTime = 0;
catSound.play();
updateScore(player);
explode();
gameActive=false;
return;
}
if(!board.includes("")){
statusEl.innerText="Draw!";
gameActive=false;
return;
}
currentPlayer=player==="X"?"O":"X";
statusEl.innerText="Turn: "+currentPlayer;
}

function checkWin(player){
for(let combo of wins){
if(combo.every(i=>board[i]===player)) return combo;
}
return null;
}

function updateScore(p){
if(p==="X"){
scoreX++;
localStorage.setItem("scoreX",scoreX);
scoreXEl.innerText=scoreX;
}else{
scoreO++;
localStorage.setItem("scoreO",scoreO);
scoreOEl.innerText=scoreO;
}
}

function aiMove(){
let empty=board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
let moveIndex;

if(difficulty==="easy"){
moveIndex=empty[Math.floor(Math.random()*empty.length)];
}else{
moveIndex=empty[0];
}

move(moveIndex,"O");
}

function restartGame(){
board=["","","","","","","","",""];
currentPlayer="X";
gameActive=true;
statusEl.innerText="Turn: X";
createBoard();
}

function setMode(m){
mode=m;
restartGame();
}

function toggleTheme(){
document.body.classList.toggle("light");
}

createBoard();

/* Particle Explosion */
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let particles=[];

function explode(){
for(let i=0;i<60;i++){
particles.push({
x:canvas.width/2,
y:canvas.height/2,
dx:(Math.random()-0.5)*6,
dy:(Math.random()-0.5)*6,
life:50
});
}
}

function animate(){
ctx.clearRect(0,0,canvas.width,canvas.height);
particles.forEach((p,i)=>{
ctx.fillStyle="gold";
ctx.beginPath();
ctx.arc(p.x,p.y,3,0,Math.PI*2);
ctx.fill();
p.x+=p.dx;
p.y+=p.dy;
p.life--;
if(p.life<=0) particles.splice(i,1);
});
requestAnimationFrame(animate);
}
animate();

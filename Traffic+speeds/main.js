const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=500;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

if(localStorage.getItem("bestProgress")){
    road.bestProgress=JSON.parse(
            localStorage.getItem("bestProgress"));
}

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",getRandomSpeed(),getRandomColor()),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",getRandomSpeed(),getRandomColor()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",getRandomSpeed(),getRandomColor()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",getRandomSpeed(),getRandomColor()),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",getRandomSpeed(),getRandomColor()),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",getRandomSpeed(),getRandomColor()),

];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("bestProgress");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);

    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);

            if(bestCar.y<traffic[traffic.length-2].y)
    {
      
        let lastDummyCar = traffic[traffic.length-1];

 let twoOrOne=Math.floor( (Math.random()*13)%2)>0;
 let randomLane=Math.round( (Math.random()*13)%3);

        traffic.push( new Car(road.getLaneCenter(Math.round( (Math.random()*13)%3)),lastDummyCar.y-300,30,50,"DUMMY",getRandomSpeed(),getRandomColor()));

        if(twoOrOne)
            {
                traffic.push( new Car(road.getLaneCenter(Math.round( (Math.random()*13)%3)),lastDummyCar.y-300,30,50,"DUMMY",getRandomSpeed(),getRandomColor()));
            }
    
      traffic.push( new Car(road.getLaneCenter(Math.round( (Math.random()*13)%3)),lastDummyCar.y-500,30,50,"DUMMY",getRandomSpeed(),getRandomColor()));

        if(Math.floor( (Math.random()*13)%2)>0)
            {
                traffic.push( new Car(road.getLaneCenter(Math.round( (Math.random()*13)%3)),lastDummyCar.y-500,30,50,"DUMMY",getRandomSpeed(),getRandomColor()));
            }
    }
      road.progress=traffic.filter(dummy=>dummy.y>bestCar.y).length;
         if(road.progress>road.bestProgress&&road.progress>0)
        {
road.bestProgress=road.progress;
             localStorage.setItem("bestProgress",
        JSON.stringify(road.progress));
             save();
        }

    }
    networkCtx.fillStyle = "red";
    networkCtx.fillText('Progress: '+road.progress, 10, 10);
    networkCtx.fillText('Best progress: '+road.bestProgress, 10, 20);

    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    carCtx.restore();
if(cars.filter(car=>car.damaged==false).length==0)
    {
        window.location.reload();
    }
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}
let nowUrl = window.location.href;
let splitUrl = nowUrl.split('/');
let lastNum = splitUrl[4];

function attractionPage(){
    fetch("/api/attraction/" + lastNum)
    .then(function(responses){
        return responses.json();
    })
    .then(function(resJson){
        getImage(resJson.data);
        attractionSection(resJson.data);
        attractionDescript(resJson.data);
    })
    .catch(function(error){
        document.body.innerHTML = "查無資料"
    })  
}

const attractions = document.getElementById("origin-data")
function attractionSection(data){
    let attractionName = document.createElement("h3");
    let attractionCommon = document.createElement("h4");
    attractionName.textContent = data.name;
    if (data.mrt == null){
        attractionCommon.textContent = data.category;
    } else {
        attractionCommon.textContent = data.category + " at " + data.mrt;
    }
    attractions.appendChild(attractionName);
    attractions.appendChild(attractionCommon);
}


const descript = document.getElementById("attraction-description");
const address = document.getElementById("attraction-address");
const traffic = document.getElementById("attraction-traffic");
function attractionDescript(data){
    let attDescript = document.createElement("p");
    let attAddress = document.createElement("p");
    let attTraffic = document.createElement("p");
    let newDescription = (data.description).replace(/\s*/g,"");
    attDescript.textContent = newDescription;
    attAddress.textContent = data.address;
    attTraffic.textContent = data.transport;
    descript.appendChild(attDescript);
    address.appendChild(attAddress);
    traffic.appendChild(attTraffic);
}


const upTime = document.getElementById("up-time");
const downTime = document.getElementById("down-time");
const money = document.getElementById("money");
upTime.addEventListener("click",function(){
    money.textContent = "新台幣 2000 元"
})
downTime.addEventListener("click",function(){
    money.textContent = "新台幣 2500 元"
})

const manyImg = document.getElementById("many-img");
function getImage(data){
    let lunbos = document.createElement('div');
    lunbos.className = 'lunbos';
    for (i = 0; i < data.images.length; i++){
        let imgItem = document.createElement("div");
        let imgSrc = document.createElement("img");
        let lunboCircle = document.createElement("span");
        imgItem.className = "img-item";
        imgSrc.src = data.images[i];
        lunboCircle.className = "lunbo-circle";
        lunbos.appendChild(lunboCircle);
        imgItem.appendChild(imgSrc);
        manyImg.appendChild(imgItem);
    }
    let prev = document.createElement('a');
    let prevArrow = document.createElement('img');
    let next = document.createElement('a');
    let nextArrow = document.createElement('img');
    prev.className = 'prev-arrow';
    prevArrow.src = '/static/img/btn_leftArrow.png';
    next.className = 'next-arrow';
    nextArrow.src = '/static/img/btn_rightArrow.png';
    prev.appendChild(prevArrow);
    next.appendChild(nextArrow);
    manyImg.appendChild(lunbos);
    manyImg.appendChild(prev);
    manyImg.appendChild(next);
    if (data.images.length==1){
        prev.style.display = "none";
        next.style.display = "none";
    }
    currentSlide(1)
    prev.addEventListener("click",previousSlide);
    next.addEventListener("click",nextSlide);
}

attractionPage();


function currentSlide(n) {
    showSlides(slideIndex = n);
}

function nextSlide() {
    showSlides(slideIndex += 1);
}

function previousSlide() {
    showSlides(slideIndex -= 1);  
}

function showSlides(n){
    let slides = document.getElementsByClassName('img-item');
    let lunboS = document.getElementsByClassName('lunbo-circle');
    if (n > slides.length){
        slideIndex = 1;
    }

    if (n < 1){
        slideIndex = slides.length;
    }

    for (let slide of slides){
        slide.style.display = "none";
    }
    for (let lunboCir of lunboS){
        lunboCir.classList.remove("hover");
    }

    slides[slideIndex - 1].style.display = "block";
    lunboS[slideIndex - 1].classList.add("hover");
}

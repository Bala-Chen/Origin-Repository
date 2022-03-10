
//製作區塊
function mainItem(data){
    for (i = 0; i < data.length; i++){
        let mainArea = document.getElementById("main-area");
        let oneItem = document.createElement("div");
        let imgArea = document.createElement("div");
        let firstImg = document.createElement("img");
        let attractionTop = document.createElement("div");
        let pName = document.createElement("p");
        let attractionBottom = document.createElement("div");
        let attractionMRT = document.createElement("div");
        let pMRT = document.createElement("p");
        let attractionCategory = document.createElement("div");
        let pCategory = document.createElement("p");
        oneItem.className = "main-item";
        imgArea.className = "img-area"
        firstImg.src = data[i].images[0];
        attractionTop.className = "attraction-top";
        pName.textContent = data[i].name;
        attractionBottom.className = "attraction-bottom";
        attractionMRT.className = "attraction-mrt";
        pMRT.textContent = data[i].mrt;
        attractionCategory.className = "attraction-category";
        pCategory.textContent = data[i].category;
        attractionMRT.appendChild(pMRT);
        attractionCategory.appendChild(pCategory);
        attractionBottom.appendChild(attractionMRT);
        attractionBottom.appendChild(attractionCategory);
        attractionTop.appendChild(pName);
        imgArea.appendChild(firstImg);
        oneItem.appendChild(imgArea);
        oneItem.appendChild(attractionTop);
        oneItem.appendChild(attractionBottom);
        mainArea.appendChild(oneItem)
    }
}

//搜尋鈕
let searchNext;
const inputElement = document.getElementById("attraction-name");
const mainArea = document.getElementById("main-area");
const searchBtn = document.getElementById("button-area");
searchBtn.addEventListener("click",remove)
function remove(){
    mainArea.innerHTML = ""
    searchNext = 0;
}
async function keySearch(page=0){
    const inputElement = document.getElementById("attraction-name")
    const inputValue = inputElement.value;
    if (inputValue != ""){
        const resSearch = await fetch('/api/attractions?page='+ page + "&keyword="+ inputValue);
        let searchJson = await resSearch.json();
        if(page == 0 && searchJson.data.length == 0){
            let createNoData = document.createElement('div');
            let mainArea = document.getElementById("main-area");
            createNoData.className = "no-data";
            createNoData.innerHTML = "查無資料";
            mainArea.appendChild(createNoData);
            searchNext = await searchJson.nextPage;
            return searchNext
        }
        if (searchJson.nextPage != null){
            mainItem(searchJson.data);
            searchNext = await searchJson.nextPage;
            return searchNext
        }
    }
}



//首頁載入
let nextP;
async function rollIndex(page=0){
    let res = await fetch('/api/attractions?page='+ page);
    let resJson = await res.json();
    if (resJson.nextPage != null){
        mainItem(resJson.data);
        nextP = await resJson.nextPage;
        return nextP
    }
}

//設load觀察點
document.addEventListener("DOMContentLoaded", function() {
    let options = {
        root:null,
        rootMargins:"0px",
        threshold:0.5
    };
        
    const observer = new IntersectionObserver(handleIntersect,options);
    observer.observe(document.querySelector('footer'));
  });


//載入更多
async function handleIntersect(entries){
    if (entries[0].isIntersecting){
        const inputElement = document.getElementById("attraction-name")
        const inputValue = inputElement.value;
        if (inputValue != ""){
            let p = await keySearch(searchNext)
            if(p == undefined){
                console.warn("final")
            }else{
                searchNext = p
            }
        }else{         
            let nPage = await rollIndex(nextP)
            if (nPage == undefined){
                console.warn("final")
            } else{
                nextP = nPage
            }
        }
    }    
}


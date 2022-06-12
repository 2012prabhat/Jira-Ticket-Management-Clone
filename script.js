const ticketCreator= document.querySelector(".ticketCreator");
const add= document.querySelector(".add");
const del= document.querySelector(".del");
const creatorColors = document.querySelectorAll(".creatorColors")
const textArea = document.querySelector(".textArea")
const ticketCont = document.querySelector(".ticketCont")
const colors = document.querySelectorAll(".colors")
const generateBtn = document.querySelector(".generateBtn")

let ls = [];
function saveToLocalStorage(text,selectedTicketColor,id){
    ls.push({
        text:text,
        selectedTicketColor:selectedTicketColor,
        id:id,
    })
    localStorage.setItem("jira",JSON.stringify(ls));
}
let addFlag = false;


let selectedTicketColor = 'red';
add.addEventListener('click',()=>{
    if(addFlag==false){
        ticketCreator.style.display = "flex";
        addFlag = !addFlag
    }else{
        ticketCreator.style.display = "none";
        addFlag = !addFlag
    }
    creatorColors[0].classList.add("borderTicket");
})
for(let i=0;i<creatorColors.length;i++){
    creatorColors[i].addEventListener('click',()=>{
    selectedTicketColor = creatorColors[i].getAttribute('class').split(" ")[1]
    creatorColors[i].classList.add("borderTicket");
    for(let j=0;j<creatorColors.length;j++){
        if(i==j){

        }else{
            creatorColors[j].classList.remove("borderTicket");
        }
    }
    })
 }

 let deleteFlag = false;
 del.addEventListener("click",()=>{
    if(deleteFlag==false){
        deleteFlag = !deleteFlag;
        del.style.backgroundColor = "red";
    }else{
        deleteFlag = !deleteFlag;
        del.style.backgroundColor = "white";
    }
 })
ticketCreator.addEventListener('keydown',(e)=>{
    if( e.key == "Enter" && e.ctrlKey){
       let text = textArea.value;
       if(text=="") return;
        let id = shortid();
        addTickets(text,selectedTicketColor,id);
        saveToLocalStorage(text,selectedTicketColor,id);
        addFlag = !addFlag
        for(let i=0;i<creatorColors.length;i++){
            creatorColors[i].classList.remove("borderTicket");
        }
        selectedTicketColor = 'red';
    }
})
generateBtn.addEventListener('click',()=>{
    let text = textArea.value;
    if(text=="") return;
    let id = shortid();
    addTickets(text,selectedTicketColor,id);
    saveToLocalStorage(text,selectedTicketColor,id);
    addFlag = !addFlag
    for(let i=0;i<creatorColors.length;i++){
        creatorColors[i].classList.remove("borderTicket");
    }
    selectedTicketColor = 'red';
})

const addTickets = (text,selectedTicketColor,uniqueid)=>{
    let newTicket = document.createElement('div');
     newTicket.innerHTML = `<div class="ticket">
    <div class="ticketColor ${selectedTicketColor}"></div>
    <div class="ticketid">${uniqueid}</div>
    <div class="contentLock">
    <div class="ticketContent">${text}</div>
    <div class="material-icons lock">lock</div>
    </div>
    
</div>`;
ticketCont.append(newTicket);
textArea.value = "";
ticketCreator.style.display = "none";
let ticketColor = newTicket.querySelector(".ticketColor");
let ticketContent = newTicket.querySelector(".ticketContent");
let ticketid = newTicket.querySelector(".ticketid");
let lock = newTicket.querySelector(".lock");

// to change ticket color
ticketColor.addEventListener("click",()=>{
    ticketColor.classList.remove(selectedTicketColor);
    let ticketColorsArr = ['red','aqua','teal','burlywood'];
      let colorIdx = ticketColorsArr.findIndex(f=>f==selectedTicketColor);
      selectedColorIdx = colorIdx==3?0:colorIdx+1;
      selectedTicketColor = ticketColorsArr[selectedColorIdx];
      ticketColor.classList.add(selectedTicketColor);
      let lsid = ls.find(f=>ticketid.innerHTML==f.id);
      lsid.selectedTicketColor = selectedTicketColor;
      localStorage.setItem("jira",JSON.stringify(ls));  
})

// to delete tickets
newTicket.addEventListener('click',()=>{
    if(deleteFlag){
        newTicket.remove();
        ls = ls.filter(m=>m.id!=ticketid.innerHTML);
        localStorage.setItem("jira",JSON.stringify(ls)); 
    }
  })

lock.addEventListener("click",()=>{
    if(lock.innerHTML=="lock"){
        lock.innerHTML = "lock_open";
        ticketContent.setAttribute("contenteditable",true);
    }else{
        lock.innerHTML = "lock";
        ticketContent.setAttribute("contenteditable",false);
        let ticketidfromls = ls.find(f=>f.id == uniqueid);
        ticketidfromls.text = ticketContent.innerHTML
        localStorage.setItem("jira",JSON.stringify(ls));


    }
})
}


//to filter tickets
let filterColor = null;
for(let i=0;i<colors.length;i++){
    colors[i].addEventListener('click',()=>{
    colors[i].classList.add("borderTicket");
    filterColor = colors[i].getAttribute("class").split(" ")[1];
    for(let j=0;j<colors.length;j++){
        if(i==j){
        }else{
            colors[j].classList.remove("borderTicket"); 
        }
    }
    filteredTickets(filterColor);
    ticketCreator.style.display = "none";
    addFlag = false;
    })
    


}

for(let i=0;i<colors.length;i++){
    colors[i].addEventListener('dblclick',()=>{
        for(let j=0;j<colors.length;j++){           
                colors[j].classList.remove("borderTicket")
        }
        ticketCont.innerHTML = "";
        ls.forEach(e=>{
            addTickets(e.text,e.selectedTicketColor,e.id)
        })
        
    })
}
function filteredTickets(filterColor){
    ticketCont.innerHTML = "";
    let filterArr = ls.filter(f=>f.selectedTicketColor==filterColor);
    filterArr.forEach(e=>{
        addTickets(e.text,e.selectedTicketColor,e.id)
    })
}
function loadFromStorage(){
    let data = JSON.parse(localStorage.getItem('jira'));
    data.forEach(elem=>{
        ls.push(elem);
        addTickets(elem.text,elem.selectedTicketColor,elem.id);
    })
}
loadFromStorage();

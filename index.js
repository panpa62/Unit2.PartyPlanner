const COHORT = "2309-FSA-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`
//const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF/events'
const state = {
    partys: []
}

const partyList = document.querySelector('#parties')
const addPartyForm = document.querySelector('#addParty')
addPartyForm.addEventListener("submit", addParty);

async function getParties(){

    try{
        const response = await fetch(API_URL);
        const json = await response.json();
        state.partys = json.data;
        //console.log("get parties: " + JSON.stringify(state.partys))
        //console.log("state.partys.length = " + Object.keys(state.partys).length)

    }catch(err){
        console.log(err);
    }
}

function renderParties(){
    //console.log("state.partys.length = " + Object.keys(state.partys).length)
    if(!state.partys.length){
        partyList.innerHTML = '<li>No parties found.</li>';
        //console.log("was at renderParties with no parties found")
        return;
    }

    const partyCards = state.partys.map((party) => {
        const partyCard = document.createElement("li");
        partyCard.classList.add("party");
       
        partyCard.innerHTML = `
        <h2>${party.name}</h2>
        <h3>${party.location}</h3>
        <h3>${party.date}</h3>
        <h3>${party.description}</h3>
        `;
        

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);
    deleteButton.addEventListener("click", () => deleteParty(party.id));
    return partyCard;
    });
    partyList.replaceChildren(...partyCards);
}

async function render(){
    await getParties();
    //console.log("was at render after getParties")
    renderParties();
    //onsole.log("was at render after renderParties")
}
render();

async function createParty(name, location, date, description) {
    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({name, location, date, description}),
        });
        const json = await response.json();
        if(json.error){
            throw new Error(json.message);
        }
        render();
    } catch(error){
        console.error(error);
    }    
}

async function addParty(event){
    event.preventDefault();
    const date = new Date(addPartyForm.date.value)
    await createParty(
        addPartyForm.name.value,
        addPartyForm.location.value,
        date.toISOString(),
        addPartyForm.description.value
    );

    addPartyForm.name.value = '';
    addPartyForm.location.value = '';
    addPartyForm.date.value = '';
    addPartyForm.description.value = '';
}

async function updateParty(id, name, location, date, description){
    try{
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, location, date, description}),
        });
        const json = await response.json();
        if(json.error){
            throw new Error(json.message);
        }
        render();
    } catch (error){
        console.error(error);
    }
}

async function deleteParty(id){
    try{
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if(!response.ok){
            throw new Error("Party could not be deleted.");
        }
        render();
    } catch(error){
        console.log(error);
    }
}

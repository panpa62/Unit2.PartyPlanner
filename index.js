const COHORT = "2309-FSA-ET-WEB-FT-SF";
//const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`
const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FSA-ET-WEB-FT-SF/events'
const state = {
    parties: []
}

const partyList = document.querySelector('#parties')
const addPartyForm = document.querySelector('#addParty')
addPartyForm.addEventListener("submit", addParty);

async function getParties(){

    try{
        const response = await fetch(API_URL);
        const json = await response.json();
        state.parties = json;

    }catch(err){
        console.log(err)
    }
}

function renderParties(){
    if(!state.parties.length){
        partyList.innerHTML = '<li>No parties found.</li>';
        return;
    }

    const partyCards = state.parties.map((party) => {
        const partyCard = document.createElement("li");
        partyCard.classList.add("party");
        partyCard.innerHTML = `
        <h2>${party.title}</h2>
        <p>${party.location}</p>
        <p>${party.date}</p>
        <p>${party.description}</p>
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
    renderParties();
}
render();

async function createParty(title, location, date, description){
    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({title, location, date, description}),
        });
        const json = await response.json();
        console.log(json)
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
    await createParty(
        addPartyForm.title.value,
        addPartyForm.location.value,
        addPartyForm.date.value,
        addPartyForm.description.value
    );

    addPartyForm.title.value = '';
    addPartyForm.location.value = '';
    addPartyForm.date.value = '';
    addPartyForm.description.value = '';
}

async function updateParty(id, title, location, date, description){
    try{
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, location, date, description}),
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
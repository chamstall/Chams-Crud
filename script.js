// url de l'api.
const URL = " http://localhost:3000/users";

// fonction de validation du formulaire
function validateForm() {
    let nom = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let email = document.getElementById("email").value;
    if (nom == "") {
        alert("name is required!")
        return false;
    }
    if (age == "") {
        alert("age is required!")
        return false;
    } else if (age <= 0) {
        alert("Age can't be zero or less than zero")
        return false;
    }
    if (email == "") {
        alert("Email is required")
        return false;
    } else if (!email.includes("@")) {
        alert("Invalid Email Address '@' is required ")
        return false;
    }
    return true;
}

// fonction pour afficher les données du localStorage dans le tableau.
function showData() {
    let usersList;
    if (localStorage.getItem("usersList") == null) {
        usersList = [];
    } else {
        usersList = JSON.parse(localStorage.getItem("usersList"))
    }
    let html = "";
    usersList.forEach(function(element,index){
        html += "<tr>";
        html += `<td> <p> ${element.name} </p></td>`;
        html += `<td> <p> ${element.age} </p></td>`;
        html += `<td> <p> ${element.email} </p></td>`;
        html += '<td><button id="edit" type="button" onclick="deleteData('+ index +')" class="btn btn-danger btn-sm m-1">Delete</button> <button id="edit" type="button" onclick="updateData('+ index +')" class="btn btn-warning btn-sm m-1">Edit</button></td>';
        html += "</tr>";
    })
    document.querySelector("#crudTable tbody").innerHTML = html;
}

// Chargement de toutes les données du localstorage quand le document ou la page se recharge.
document.onload = showData();

// fonction pour ajouter les données au niveau de l'API et du localstorage.
function addData() {
    //lorsque le formulaire est valide cad a true j'envoie les données au LS
    if (validateForm() == true) {
        let nom = document.getElementById("name").value;
        let age = document.getElementById("age").value;
        let email = document.getElementById("email").value;

        let usersList;
        if (localStorage.getItem("usersList") == null) {
            usersList = [];
        } else {
            usersList = JSON.parse(localStorage.getItem("usersList"))
        }
        usersList.push({
            "name": nom,
            "age": age,
            "email": email
        })
        //j'envoie les données au niveau du LS
        localStorage.setItem("usersList", JSON.stringify(usersList));
        showData();
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("email").value = "";

        // j'envoie les données au niveau de mon api 
        let newUser = {
            "name": nom,
            "age": age,
            "email": email
        }
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })
            .then((response) => response.json())
            .then((user) => console.log("utilisateur ajouté avec succès !", user))
            .catch((error) => {
                console.log("erreur lors de l'ajout du nouvel utilisateur", error)
            })
            
    }
}

// ecoute de l'evenement d'ajout de l'user
document.getElementById("addUser").addEventListener("click", (e) => {
    e.preventDefault();
    addData();
})

// fonction pour supprimer un utilisateur 
function deleteData(index){
    let usersList;
    if(localStorage.getItem("usersList") !== null){
        usersList = JSON.parse(localStorage.getItem("usersList"))
    }
    // je stocke les infos de l' utilisateur actuel qui va etre supprimer,
    //  dans cette variable
    // pour ensuite les afficher  dans l'alerte apres 
    // la suppression de l'utilisateur.
    let userDeleted = usersList[index];

    usersList.splice(index,1);
    localStorage.setItem("usersList", JSON.stringify(usersList));
    showData();
    fetch(`${URL}/${index + 1}`,{
        method:"DELETE",
    })
    .then(response=>response.json())
    .then(()=>alert(" L'utilisateur ci-dessous à été supprimé avec succès" + " " + JSON.stringify(userDeleted)))
    .catch((error)=>console.log("erreur lors de la suppression de l'utilisateur"))
}

// fonction pour modifier un utilisateur
function updateData(index){

}


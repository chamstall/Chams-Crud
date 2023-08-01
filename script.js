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
    usersList.forEach(function (element, index) {
        html += "<tr>";
        html += `<td> <p> ${element.name} </p></td>`;
        html += `<td> <p> ${element.age} </p></td>`;
        html += `<td> <p> ${element.email} </p></td>`;
        html += '<td><button id="edit" type="button" onclick="deleteData(' + index + ')" class="btn btn-danger btn-sm m-1">Delete</button> <button id="edit" type="button" onclick="updateData(' + index + ')" class="btn btn-warning btn-sm m-1">Edit</button></td>';
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
         // Générer un ID unique basé sur le timestamp actuel (en millisecondes)
         let timestamp = Date.now();
         let id = timestamp.toString();
        usersList.push({
            "id": id,
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
            "id":id,
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
            .then((user) => alert("L'utilisateur ci dessous a été ajouté avec succès !" + " " + JSON.stringify(user)))
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
function deleteData(index) {
    let usersList;
    if (localStorage.getItem("usersList") !== null) {
        usersList = JSON.parse(localStorage.getItem("usersList"))
    }
    // je stocke les infos de l' utilisateur actuel qui va etre supprimer,
    //  dans cette variable pour ensuite les afficher  dans l'alerte apres 
    // la suppression de l'utilisateur.
    let userDeleted = usersList[index];

    usersList.splice(index, 1);
    localStorage.setItem("usersList", JSON.stringify(usersList));
    showData();
    const userId = userDeleted.id
    fetch(`${URL}/${userId}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(() => alert(" L'utilisateur ci-dessous a été supprimé avec succès !" + " " + JSON.stringify(userDeleted)))
        .catch((error) => console.log("erreur lors de la suppression de l'utilisateur"))
}

// fonction pour modifier un utilisateur
function updateData(index) {
    // je masque le btn addData et j'affiche le btn updateData 
    // lors du click sur le btn edit 
    document.querySelector("#addUser").style.display = "none"
    document.querySelector("#updateUser").style.display = "block"

    if (localStorage.getItem("usersList") !== null) {
        usersList = JSON.parse(localStorage.getItem("usersList"));
    }

    //j'affiche les données respectivement aux inputs
    document.getElementById("name").value = usersList[index].name;
    document.getElementById("age").value = usersList[index].age;
    document.getElementById("email").value = usersList[index].email;

    // une fois les modifs terminer je renvoie les données mis a jour
    document.querySelector("#updateUser").onclick = function () {
        // je verifie avant si le formulaire est valide 
        if (validateForm() == true) {
            usersList[index].name = document.getElementById("name").value;
            usersList[index].age = document.getElementById("age").value;
            usersList[index].email = document.getElementById("email").value;
        }

        //je mets à jour le localstorage avec les modifications faites 
        localStorage.setItem("usersList", JSON.stringify(usersList));
        showData(); //j'affiche les données avec les mises à jours dans mon tableau
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("email").value = "";

        // je raffiche le btn add Data et je masque le btn update
        //lors du click sur le btn update qui signifie que la modif est terminée
        document.querySelector("#addUser").style.display = "block"
        document.querySelector("#updateUser").style.display = "none"

        //mis à jour aussi au niveau de mon api
        // je recupere la liste des utilisateurs avec les modifications effectuées
        if (localStorage.getItem("usersList") !== null) {
            usersList = JSON.parse(localStorage.getItem("usersList"));
        }
        // ensuite j'effectue les memes modifications dans mon api
        fetch(`${URL}/${usersList[index].id}`,{ //je met index + 1 car l'id actuel est id = index + 1  
            method : "PUT",           //l'id est plus grand que l'index d'une unité a chaque fois
            headers:{
                "Content-Type":"application/json"
            },
            // dans le corps de ma requete je vais envoyer à mon api 
            // l'objet actuel du tableau qui vient d'etre modifié 
            // donc l'objet de mon api qui est à l'id index + 1 va etre remplacé par 
            // usersList[index] qui est le nouvel objet modifié
            body:JSON.stringify(usersList[index])
            // en resumé je remplace l'objet de mon api qui a l'id index + 1 par le nouvel objet 
            // modifié qui est stocké dans le localstorage
        })
        .then(response=>response.json())
        .then(userUpdated=>{
            alert("L'utilisateur ci-dessous a été mis à jour avec succès !" + " " + JSON.stringify(userUpdated))
        })
        .catch((error)=>console.log("erreur lors de la mise à jour de l'utilisateur",error))
    }
}




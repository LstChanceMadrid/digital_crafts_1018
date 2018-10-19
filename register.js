
const database = firebase.database();



// -------------------- register start

let registerEmailTextBox = document.getElementById('register-email-text-box');
let registerPasswordTextBox = document.getElementById('register-password-text-box');
let registerButton = document.getElementById('register-button');


registerButton.addEventListener('click', function() {
    let email = registerEmailTextBox.value;
    let password = registerPasswordTextBox.value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user) {
        console.log('success');
    })
    .catch(function(error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(error);
    })
})

//--------------------- register end

//--------------------- login start

let loginEmailTextBox = document.getElementById("login-email-text-box");
let loginPasswordTextBox = document.getElementById("login-password-text-box");
let loginButton = document.getElementById('login-button');
let storesRef

loginButton.addEventListener('click', function() {
    let email = loginEmailTextBox.value;
    let password = loginPasswordTextBox.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    
    .catch(function(error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(error);
    })
    .then(function(user) {
        console.log('login success');
        let userId = firebase.auth().currentUser.uid;
        storesRef = database.ref("users/" + userId + "/stores");
        
    })
})

//--------------------- login end


let stores = [];

// ------------------ adding a store to the list

let groceryStoreTextBox = document.getElementById("grocery-store-text-box");
let addStoreButton = document.getElementById("add-store-button");


const addStore = (store) => {
    storesRef.child(store.storeName).set(store)
}


addStoreButton.addEventListener('click', function() {
    let storeName = groceryStoreTextBox.value;
    let store = {
        storeName : storeName
    };
    addStore(store);
});
// --------------------------------

// -------------------- displaying the stores

let storeList = document.getElementById("store-list-container");


const displayStores = () => {
    let legend = document.getElementById("store-list-legend")
    storeList.innerHTML = ""

    let storeNames = stores.map(function(store) {
        console.log(store.storeName)
        return `
            <div class="store-option-container">
                <div class="store-name")>${store.storeName}</div>
                <div class="grocery-items-container">
                    <label>Grocery Items</label>
                    <input class="new-item-text-box" type="text" placeholder="item" />
                    <button class="add-grocery-button" onClick="addItem(this)">Add Grocery</button>
                </div>
            </div>

            ${configureItems(store)}
            `;    
    });


    storeList.insertAdjacentHTML('beforeend', storeNames.join(''));
    storeList.insertAdjacentElement('afterbegin', legend);
}


const configureStores = () => {
    storesRef.on('value', (snapshot => {
        stores = []
        snapshot.forEach(childSnapshot => {
            stores.push(childSnapshot.val())
        })
        displayStores(); 
    })) 
}

configureStores()



let items = []


const addItem = (button) => {
    
    let currentList = document.getElementsByClassName('grocery-items-container')
    console.log(button.parentElement.previousElementSibling.innerHTML)
    let storeName = button.parentElement.previousElementSibling.innerHTML
    let newItemTextBox = button.previousElementSibling.value
    let itemName = newItemTextBox;

    let itemsRef = storesRef.child(storeName).child("items");
    console.log(itemsRef)
    let itemRef = itemsRef.child(itemName);
    
    itemRef.set({
        itemName : itemName
    })
}




const configureItems = (store) => {
    if (store.items == null) {
        return ''
    }

    return Object.keys(store.items).map(function(key) {
        return `<p>- ${store.items[key].itemName}</p>`
    }).join('')
}


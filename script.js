//DOM Elements
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const items = itemList.querySelectorAll('li');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

//Handles item submissions
function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    //Checks if it's edit mode and allows an item to be updated
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        
        //Prevents user from editing an item to an item that already exists
        if (checkIfItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }

    else {
        if (checkIfItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }
    }

    addItemToDOM(newItem);
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
}

//Adds in a new item DOM element
function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

//Adds item to local storage
function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//Get items from local storage
function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    }

    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

//Sets an item that the user can edit or update
function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
  
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

//Remove item from DOM and local storage respectively
function removeItem(item) {
    if (confirm('Do you want to remove this item?')) {
        item.remove();
        removeItemFromStorage(item.textContent);
        checkUI();
    }
}

//Filters out item to be removed and then re-sets to the local storage
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
  }

//Clears out all items from DOM and local storage
function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    localStorage.removeItem('items');

    checkUI();
}

//Checks if item exists in local storage regardless of capitalization
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.map(i => i.toLowerCase()).includes(item.toLowerCase());
}

//Creates button for the items
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

//Creates icon
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

//Handles when an item is clicked
function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
        return;
    } 
    
    else 
    {
        setItemToEdit(e.target);
    }
}

//Allows user to filter specific items
function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        
        //Checks if the text typed in matches the item name and display only the ones that match
        item.style.display = itemName.indexOf(text) != -1 ? 'flex' : 'none';
    }
    );
}

//Display items from local storage
function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

//Checks and updates UI
function checkUI() {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');

    //Checks if all items are removed and then either remove or add the clear all button and item filter
    clearBtn.style.display = items.length === 0 ? 'none' : 'block';
    itemFilter.style.display = items.length === 0 ? 'none' : 'block';

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    
    isEditMode = false;
}

function init () {
    //Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();
const weekDay: string = new Date().toUTCString().slice(0,3);
let element = document.getElementById("day");
element.innerHTML = weekDay;

const date: string = new Date().toLocaleDateString();
element = document.getElementById("date");
element.innerHTML = date;


let list: HTMLElement = document.getElementById("todo-list");
let listItems: object[] =[];

list.addEventListener('click',
    function completeTask(element) {
        console.log(element.target);
        const elem: HTMLElement = element.target as HTMLElement;

        if (elem.tagName === "LI"){
            elem.classList.toggle("completed");
            (elem.childNodes[0] as HTMLElement).classList.toggle("item-text__completed");
            let id = parseInt(elem.id);

            for (let item of listItems) {
                if (item["id"] === id) {
                    item["isCancelled"] = !item["isCancelled"];
                }
            }

            loadInStorage();
        }
    });

interface ListItem {
    id: number,
    text: string,
    isCancelled: boolean
}

function createItem(): void{
    let inputText: string = (document.getElementById("input") as HTMLInputElement).value;

    if (inputText !== ""){
        let itemID: number = Math.floor(Math.random()*100000);

        let listItem: HTMLLIElement = document.createElement("li");
        listItem.className = "todo-list__item";
        listItem.id = itemID.toString();

        let itemText: HTMLSpanElement = document.createElement("span");
        itemText.className = "item-text";
        itemText.textContent = inputText;

        let deleteButton: HTMLButtonElement = document.createElement("button");
        deleteButton.className = "delete-button";
        let deleteText: HTMLSpanElement = document.createElement("span");
        deleteText.className = "delete-text";
        deleteText.textContent = "x";

        deleteButton.appendChild(deleteText);
        listItem.appendChild(itemText);

        document.getElementById("todo-list").appendChild(listItem);
        (document.getElementById("input") as HTMLInputElement).value = "";

        let item: ListItem = {
            id: itemID,
            text: inputText,
            isCancelled: false
        };
        listItems.push(item);

        deleteButton.addEventListener('click', function () {
            deleteTask(itemID);
        });
        listItem.appendChild(deleteButton);
        deleteButton.appendChild(deleteText);
    }
    else {
        alert("Вводите корректные данные");
    }
}

function deleteTask(id): void {

    listItems = listItems.filter(item => item["id"] !== id);
    document.getElementById(id).remove();
}

function loadInStorage(): void{
    localStorage.setItem("listItems", JSON.stringify(listItems));
}

function uploadItems() {

    if (localStorage.getItem("listItems") !== null) {

        listItems = JSON.parse(localStorage.getItem("listItems"));

        listItems.forEach(item => {
            let listItem = document.createElement("li");
            listItem.id = item["id"];

            console.log(item);
            if (item["isCancelled"]) {
                listItem.className = "todo-list__item completed";
            }
            else {
                listItem.className = "todo-list__item";
            }

            let itemText = document.createElement("span");
            itemText.textContent = item["text"];

            if (item["isCancelled"]){
                itemText.className = "item-text item-text__completed";
            }
            else{
                itemText.className = "item-text";
            }
            listItem.appendChild(itemText);


            let deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            let deleteText = document.createElement("span");
            deleteText.className = "delete-text";
            deleteText.textContent = "x";


            deleteButton.addEventListener('click', function () {
                deleteTask(item["id"]);
            });

            deleteButton.appendChild(deleteText);
            listItem.appendChild(deleteButton);

            document.getElementById("todo-list").appendChild(listItem);
        });
    }
}
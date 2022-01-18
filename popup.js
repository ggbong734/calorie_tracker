
// to create new consumable
class Consumable {
    constructor(quantity, unit, item) {
        this.quantity = quantity;
        this.unit = unit;
        this.item = item;
        this.calories = null;
    }
}

class Setting {
    constructor(gender, ageGroup, activity) {
        this.gender = gender;
        this.ageGroup = ageGroup;
        this.activity = activity
    }
}

function getFoodInfo(consum) {
    const params = {
        app_id: appID,
        app_key: appKey,
        nutrition_type: "logging",
        ingr: consum.quantity + " " + consum.unit + " " + consum.item
    };
    let url = "https://api.edamam.com/api/nutrition-data"
    url += "?" + (new URLSearchParams(params)).toString();
    return fetch(url)
        .then(response => response.json());
}



function displayCurrItems(listOfCons) {
    let calRemaining = 2200; // change this based on option settings
    let totalConsumed = 0;
    // get total remaining calories and show
    listOfCons.forEach((item) => {
        const itemCals = parseInt(item.calories)
        calRemaining -= itemCals;
        totalConsumed += itemCals;
    });
    document.getElementById("calories-remaining").innerText = `${calRemaining} cal`;

    const calTableHead = document.getElementById("calTableHead");
    const calTableBody = document.getElementById('calTableBody');
    calTableBody.innerHTML = '';
    calTableHead.innerHTML = '';
    drawCalTable(calTableBody, calTableHead, listOfCons);

    document.getElementById("totalConsumed").innerText = `Total consumed: ${totalConsumed} cal`;
}

function drawCalTable(tableBody, tableHead, listOfCons) {
    // draw table head
    if (listOfCons.length > 0) {
        const newHeadRow = document.createElement('tr');
        const colsHead = ["No.", "Item", "Quantity", "Unit", "Calories", ""];
        for (let i = 0; i < colsHead.length; i++) {
            const hRow = document.createElement("th");
            hRow.setAttribute("scope", "col");
            hRow.innerText = colsHead[i];
            newHeadRow.appendChild(hRow);
        }
        tableHead.appendChild(newHeadRow);
    }


    for (let i = 0; i < listOfCons.length; i++) {
        const newRow = document.createElement('tr');
        const rowHead = document.createElement('th');
        rowHead.setAttribute("scope", "row");
        rowHead.innerText = i + 1;

        const rowItem = document.createElement('td');
        rowItem.innerText = listOfCons[i].item;
        const rowQuantity = document.createElement('td');
        rowQuantity.innerText = listOfCons[i].quantity;
        const rowUnit = document.createElement('td');
        rowUnit.innerText = listOfCons[i].unit;
        const rowCalories = document.createElement('td');
        rowCalories.innerText = listOfCons[i].calories;
        const rowButton = document.createElement('td');
        delButton = document.createElement('button');
        rowButton.appendChild(delButton);
        delButton.setAttribute("class", "btn btn-secondary");
        delButton.innerText = "Delete";

        newRow.appendChild(rowHead);
        newRow.appendChild(rowItem);
        newRow.appendChild(rowQuantity);
        newRow.appendChild(rowUnit);
        newRow.appendChild(rowCalories);
        newRow.appendChild(rowButton);
        tableBody.appendChild(newRow);

        //event Listener for del button
        delButton.addEventListener("click", () => {
            listOfCons.splice(i, 1);
            saveConsumablesandDate(listOfCons);
            displayCurrItems(listOfCons);
        });
    }
}

function saveConsumablesandDate(listOfCons) {
    chrome.storage.sync.set({ "consumables": listOfCons });
    chrome.storage.sync.set({ "lastDate": Date.now() });
}

function saveOptionSettings() {

}

function getDiffInDays(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.floor(date1 / oneDay) - Math.floor(date2 / oneDay);
}



document.addEventListener("DOMContentLoaded", () => {


    const body = document.body;
    // const border = document.createElement("div");

    // chrome.runtime.connect({ name: "popup" });
    const listOfCons = [];
    const pastCalories = [];

    chrome.runtime.connect({ name: "popup" });

    // extract stored list from chrome storage
    chrome.storage.sync.get(["consumables", "date", "pastCalories", "options"], function (result) {
        // if current date is different from last date, save new date and push last date data into pastCalories
        if (!result) {
            console.log('retrieval from storage returns nothing');
            return;
        }
        console.log("retrieval from storage successful");
        const currDate = Date.now();
        const lastDate = result.date;
        const lastCons = result.consumables;

        if (result.date && getDiffInDays(currDate, lastDate) > 0) {
            // save new date
            chrome.storage.sync.set({ "date": Date.now() });

            const pastCal = result.pastCalories;
            // remove data older than 30 days
            for (let i = 0; i < pastCal.length; i++) {
                if (getDiffInDays(currDate, pastCal[i].date) > 30) {
                    pastCal.splice(i, 1);
                    i--;
                }
            }
            // get total calories from last date
            const totalCalsLastDate = lastCons.reduce((a, b) => a.calories + b.calories);
            // store last date total calories in storage
            pastCal.push({
                "date": lastDate,
                "totalCalories": totalCalsLastDate
            });
            chrome.storage.sync.set({ "pastCalories": pastCal });

        } else { // if still same day, push all items in storage to current list
            console.log("stored consumables: ", lastCons)
            if (lastCons) {
                lastCons.forEach((cons) => listOfCons.push(cons));
            }
        }

        // get option settings and apply
        displayCurrItems(listOfCons);
    });

    // chrome storage structure: 1. consumable list current 2. last consumable date 3. list of pastCalories

    // input new item div
    const addConsButton = document.getElementById("addConsButton");
    const quantityInput = document.getElementById("quantityInput");
    const unitInput = document.getElementById("unitInput");
    const itemInput = document.getElementById("itemInput");

    addConsButton.addEventListener("click", () => {
        const newCons = new Consumable(quantityInput.value, unitInput.value, itemInput.value);
        getFoodInfo(newCons).then(response => {
            newCons.calories = response['calories'];
            listOfCons.push(newCons);

            // save list of consumable and last date to chrome
            saveConsumablesandDate(listOfCons);

            // display elements in popup
            displayCurrItems(listOfCons);
        }

        )
    }

    )


    // event listener add button click
    // send request to api
    // get data and save data to chrome storage

});

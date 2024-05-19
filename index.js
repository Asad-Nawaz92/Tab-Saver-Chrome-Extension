let myLeads = [];
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");
const inputTabBtn = document.getElementById("input-tab-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    if (!myLeads.includes(url)) {
      myLeads.push(url);
      localStorage.setItem("myLeads", JSON.stringify(myLeads));
      render(myLeads);
    }
  });
});

inputTabBtn.addEventListener("click", function () {
  let inputVal = inputEl.value.trim();
  if (inputVal) {
    if (!/^https?:\/\//i.test(inputVal)) {
      inputVal = "http://" + inputVal;
    }
    if (!myLeads.includes(inputVal)) {
      myLeads.push(inputVal);
      inputEl.value = "";
      localStorage.setItem("myLeads", JSON.stringify(myLeads));
      render(myLeads);
    }
  }
});

deleteBtn.addEventListener("click", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
                <button class="del-btn">DELETE</button>
            </li>
        `;
  }
  ulEl.innerHTML = listItems;

  const deleteButtons = document.getElementsByClassName("del-btn");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", function () {
      deleteSingleLead(i);
    });
  }
}

function deleteSingleLead(index) {
  myLeads.splice(index, 1);
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
}

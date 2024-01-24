import { ethers } from "./ethers-5.2.esm.js";
import { contractABI } from "./contractABI.js";
import "./ejs.js";
import { projectCode } from "./project.js";
import { tokenCardCode } from "./tokenCard.js";
("use strict");

//dark mode
setDarkMode();
document.querySelector("#dark-mode-switch").addEventListener("click", () => {
  toggleDarkMode();
});

let provider = null;
let signer = null;
let userAddress = null;
let contractList = document.querySelector("#contracts").innerHTML.split(",");
let mintList = document.querySelector("#mints").innerHTML.split(",");
let projectList = JSON.parse(document.querySelector("#projects").innerHTML);
let isConnected = false;
let projectIds = [];
let mintMessage = "";
let connect = document.querySelector("#wallet-connect");

// wallet connection
await connectWallet();
document.querySelector("#mints").innerHTML = mintList;
connect.addEventListener("click", async () => {
  await connectWallet();
});
if (isConnected) {
  await updateMints();
}
buildProjectButtons();

// search box
let searchBox = document.querySelector("#search-term");
searchBox.addEventListener("keyup", (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  updateProjects();
});

// contact form buttons
let form = document.querySelector("#contact-form");
document.querySelector("#send-contact").addEventListener("click", (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  validateForm();
});

let formReset = document.querySelector("#contact-button-response");
formReset
  .querySelector("#contact-button-response")
  .addEventListener("click", (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    resetForm();
  });

//build project buttons
function buildProjectButtons() {
  for (let i = 0; i < projectList.length; i++) {
    let id = "#b-" + (i + 1);
    document.querySelector(id).addEventListener("click", () => {
      doProject(i + 1);
    });
  }
}

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      connect.innerHTML = "Connected";
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const accounts = await ethereum.request({ method: "eth_accounts" });
      userAddress = "" + accounts[0];
      console.log("userAddress: ", userAddress);
      let walletString =
        userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
      connect.innerHTML = walletString;
      console.log("provider: ", provider);
      console.log("wallet: ", userAddress);
      console.log("signer: ", signer);
      isConnected = true;
    } catch (error) {
      connect.innerHTML = "Check Metamask";
      isConnected = false;
    }
  } else {
    connect.innerHTML = "Please connect MetaMask";
    isConnected = false;
  }
}

export async function updateMints() {
  let newList = [];
  for (let i = 0; i < contractList.length; i++) {
    let contractAddress = contractList[i];
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    contract.connect(signer);
    let num = await contract.totalSupply();
    newList.push(num.toString());
  }
  mintList = [...newList];
}

//dark mode stuff
export function setDarkMode() {
  let dmSetting = sessionStorage.getItem("dm");
  console.log(dmSetting);
  switch (dmSetting) {
    case null: {
      goLight();
      sessionStorage.setItem("dm", "light");
      document.querySelector("#dark-mode-switch").checked = false;
      break;
    }
    case "light": {
      goLight();
      sessionStorage.setItem("dm", "light");
      document.querySelector("#dark-mode-switch").checked = false;
      break;
    }
    case "dark": {
      document.querySelector("#dark-mode-switch").checked;
      goDark();
      sessionStorage.setItem("dm", "dark");
      document.querySelector("#dark-mode-switch").checked = true;
      document.querySelector("#dark-mode-switch").checked;
      break;
    }
  }
}

export function toggleDarkMode() {
  let dmSetting = sessionStorage.getItem("dm");
  switch (dmSetting) {
    case "light": {
      goDark();
      sessionStorage.setItem("dm", "dark");
      document.querySelector("#dark-mode-switch").checked = true;
      break;
    }
    case "dark": {
      goLight();
      sessionStorage.setItem("dm", "light");
      document.querySelector("#dark-mode-switch").checked = false;
      break;
    }
  }
}

export function goDark() {
  let e = document.body;
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#header");
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#footer");
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#contact-form");
  e.classList.add("contact-form-dark");
  e.classList.remove("contact-form-light");
  e = document.querySelector("#search-term");
  e.classList.add("buttons-dark");
  e.classList.remove("buttons-light");
  let l1 = document.getElementsByTagName("a");
  for (let e of l1) {
    e.classList.add("n-list-dark");
    e.classList.remove("n-list-light");
  }
  let l2 = document.getElementsByTagName("strong");
  for (let e of l2) {
    e.classList.add("n-list-dark");
    e.classList.remove("n-list-light");
  }
  let l3 = document.getElementsByTagName("label");
  for (let e of l3) {
    e.classList.add("n-list-dark");
    e.classList.remove("n-list-light");
  }
  let l4 = document.getElementsByTagName("button");
  for (let e of l4) {
    e.classList.add("buttons-dark");
    e.classList.remove("buttons-light");
  }
  let l5 = document.getElementsByTagName("svg");
  for (let e of l5) {
    e.classList.add("logo-dark");
    e.classList.remove("logo-light");
  }
  let l6 = document.getElementsByClassName("card-footer");
  for (let e of l6) {
    e.classList.add("bhf-dark");
    e.classList.remove("bhf-light");
  }
  let l7 = document.getElementsByClassName("title-box");
  for (let e of l7) {
    e.classList.add("bhf-dark");
    e.classList.remove("bhf-light");
  }
}

export function goLight() {
  let e = document.body;
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#header");
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#footer");
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#contact-form");
  e.classList.remove("contact-form-dark");
  e.classList.add("contact-form-light");
  e = document.querySelector("#search-term");
  e.classList.remove("buttons-dark");
  e.classList.add("buttons-light");
  let l1 = document.getElementsByTagName("a");
  for (let e of l1) {
    e.classList.add("n-list-light");
    e.classList.remove("n-list-dark");
  }
  let l2 = document.getElementsByTagName("strong");
  for (let e of l2) {
    e.classList.add("n-list-light");
    e.classList.remove("n-list-dark");
  }
  let l3 = document.getElementsByTagName("label");
  for (let e of l3) {
    e.classList.add("n-list-light");
    e.classList.remove("n-list-dark");
  }
  let l4 = document.getElementsByTagName("button");
  for (let e of l4) {
    e.classList.add("buttons-light");
    e.classList.remove("buttons-dark");
  }
  let l5 = document.getElementsByTagName("svg");
  for (let e of l5) {
    e.classList.add("logo-light");
    e.classList.remove("logo-dark");
  }
  let l6 = document.getElementsByClassName("card-footer");
  for (let e of l6) {
    e.classList.add("bhf-light");
    e.classList.remove("bhf-dark");
  }
  let l7 = document.getElementsByClassName("title-box");
  for (let e of l7) {
    e.classList.add("bhf-light");
    e.classList.remove("bhf-dark");
  }
}

//  mail stuff
function validateForm() {
  let formValid = true;
  if (!form.checkValidity()) {
    formValid = false;
  }
  form.classList.add("was-validated");
  if (formValid) {
    sendTheEmail();
  }
  return false;
}

function resetForm() {
  document.querySelector("#contact-first").value = "";
  document.querySelector("#contact-last").value = "";
  document.querySelector("#contact-message").value = "";
  document.querySelector("#contact-email").value = "";
  document.querySelector("#contact-button-response").innerHTML = "Reset Form";
  document.querySelector("#contact-form").classList.remove("was-validated");
}

function sendTheEmail() {
  let obj = {
    sub: `${document.querySelector("#contact-first").value} ${
      document.querySelector("#contact-last").value
    } from NFT mint contact form!`,
    txt: `${document.querySelector("#contact-first").value} ${
      document.querySelector("#contact-last").value
    } sent you a message from the contact form on the NFT mint that reads as so: \n${
      document.querySelector("#contact-message").value
    }\nThey're email address is ${
      document.querySelector("#contact-email").value
    }`,
  };

  fetch("/mail", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((r) => r.json())
    .then((response) => {
      document.querySelector("#contact-button-response").innerHTML =
        response.result + " - Reset Form";
    })
    // .then(() => {
    //   setTimeout(() => {
    //     document.querySelector("#contact-button-response").innerHTML = "";
    //   }, "7000");
    // })
    .catch((err) => {
      console.log(
        "We were unable to send your message due to an internal error - ",
        err
      );
    });
}

// minting stuff
// async function loadProject(id) {
//   let id = parseInt(document.querySelector("#project-id").innerHTML) - 1;
//   let mintMessage = "";
//   if (isConnected) {
//     await updateMints();
//     document.querySelector("#mint-quant").innerHTML = mintList[id];
//     showMints();
//     updateMintMessage();
//     document.querySelector("#mint-button").addEventListener("click", () => {
//       doMintBehaviors();
//     });
//   } else {
//     mintMessage = "Please connect your wallet, then refresh";
//     document.querySelector("#mint-message").innerHTML = mintMessage;
//   }
// }

async function doProject(id) {
  //  await updateMints();
  console.log(id);
  console.log(projectList[id - 1]);
  document.querySelector("#single-project").classList.remove("d-none");
  document.querySelector("#single-project").classList.add("d-inline");
  let data = {
    project: projectList[id - 1],
  };
  document.querySelector("#single-project").innerHTML = ejs.render(
    projectCode,
    data
  );
  updateMintMessage(id);
  showMints(id);
}

async function doMintBehaviors() {
  document.querySelector("#mint-button").classList.add("disabled");
  document.querySelector("#mint-button").innerHTML = "Briefly Transacting...";
  let contractAddress = contractList[id];
  console.log("Contract: ", contractAddress);
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  contract.connect(signer);
  let supply = await contract.totalSupply();
  supply = supply.toString();
  let tokenNum = parseInt(supply) + 1;
  console.log("Token number: ", tokenNum);
  let summary = JSON.parse(projectList[id].summaryData);
  console.log(summary);
  let base_uri = summary.elements[2].metas[supply].ipfs;
  console.log("BaseURI: ", base_uri);
  let mintPrice = await contract.getMintPrice();
  mintPrice = mintPrice.toString();
  mintPrice = parseFloat(mintPrice);
  console.log("Mint price: ", mintPrice);
  let value = mintPrice.toString();
  console.log("Value: " + value + " GWEI.");
  let token = await contract.mintTo(base_uri, { value: value });
  document.querySelector("#mint-button").innerHTML = "Confirming...";
  await token.wait(1);
  document.querySelector("#mint-button").innerHTML = "Almost done...";
  await token.wait(2);
  updateMintMessage();
  window.location.reload();
}

async function updateMintMessage(id) {
  if (isConnected == false) {
    mintMessage = "Please connect your wallet, then refresh";
  } else {
    let contractAddress =
      contractList[
        id - 1
        // parseInt(document.querySelector("#project-id").innerHTML) - 1
      ];
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    contract.connect(signer);
    let supply = await contract.totalSupply();
    supply = supply.toString();
    let max = await contract.getMaxSupply();
    max = max.toString();
    console.log("Total supply is: ", supply);
    console.log("Max supply is: ", max);
    mintMessage = "Tokens are available. Mint yours now.";
    let mintButton = document.querySelector("#mint-button");
    if (projectList[id - 1].active == 0) {
      document.querySelector("#status").innerHTML = "Inactive - ";
      document.querySelector("#mint-button").classList.add("disabled");
    } else {
      document.querySelector("#status").innerHTML = "Active - ";
      document.querySelector("#mint-button").classList.remove("disabled");
    }
    if (supply == max) {
      mintMessage =
        "This project is minted out. Please check secondary sales marketplaces and cosider using one that supports artist royalties.";
      mintButton.classList.add("disabled");
      document.querySelector("#status").innerHTML = "Inactive - ";
    }
    if (supply == 0) {
      mintMessage = "Be the first collector to mint from this project.";
    }
  }
  document.querySelector("#mint-message").innerHTML = mintMessage;
}

async function showMints(id) {
  let str = "";
  await updateMints();
  for (let i = 0; i < mintList[id - 1]; i++) {
    let summary = JSON.parse(projectList[id - 1].summaryData);
    let image = summary.elements[0].images[i].ipfs;
    let anim = summary.elements[1].anims[i].ipfs;
    let meta = summary.elements[2].metas[i].ipfs;
    let data = {
      image: image,
      anim: anim,
      name: projectList[id].project_name,
      edition: i + 1,
      number: projectList[id].quantity,
      price: projectList[id].price_eth,
      metadata: meta,
    };
    str += "<div class='col-10'>" + ejs.render(tokenCardCode, data) + "</div>";
  }
  document.querySelector("#token-views").innerHTML = str;
}

function updateProjects() {
  projectIds = [];
  let filter = document.getElementById("search-term").value.toUpperCase();
  projectList.forEach(function (proj, idx) {
    projectIds.push(proj.id);
    let pString = "#project-holder-" + (idx + 1);
    let pDisplay = document.querySelector(pString);
    if (
      proj.project_name.toUpperCase().includes(filter) ||
      proj.project_description.toUpperCase().includes(filter)
    ) {
      pDisplay.classList.add("d-inline");
      pDisplay.classList.remove("d-none");
    } else {
      pDisplay.classList.add("d-none");
      pDisplay.classList.remove("d-inline");
    }
  });
}

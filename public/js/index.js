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

// wallet connection (also see below)
await connectWallet();
document.querySelector("#mints").innerHTML = mintList;
connect.addEventListener("click", async () => {
  await connectWallet();
});
if (isConnected) {
  await updateMints();
  // for (let i = 0; i < mintList.length; i++) {
  //   let str = "#mint-button-" + (i + 1);
  //   document.querySelector(str).addEventListener("click", () => {
  //     console.log("its probabaly something in the function");
  //   });
  //   console.log(str);
  //   console.log(document.querySelector(str));
  // }
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

// set initial page view
setProjectView();

// contact form buttons
let form = document.querySelector("#contact-form");
document.querySelector("#send-contact").addEventListener("click", (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  validate();
});

let formReset = document.querySelector("#contact-button-response");
formReset.addEventListener("click", (event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  resetForm();
});

function setProjectView() {
  let proj = sessionStorage.getItem("selected");
  if (proj == null || proj == "" || proj === "NaN") {
    proj = 1;
    sessionStorage.setItem("selected", proj.toString());
  }
  doProject(parseInt(proj));
}

// build project buttons
function buildProjectButtons() {
  for (let i = 0; i < projectList.length; i++) {
    let id = "#b-" + (i + 1);
    document.querySelector(id).addEventListener("click", () => {
      doProject(i + 1);
      setDarkMode();
    });
  }
}

// wallet connection (also see above)
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      let chain = await ethereum.request({ method: "eth_chainId" });
      if (chain == "0x66eee" || chain == "0xa4b1" || chain == "0x13881") {
        await ethereum.request({ method: "eth_requestAccounts" });
        connect.innerHTML = "Connected";
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_accounts" });
        userAddress = "" + accounts[0];
        let walletString =
          userAddress.substring(0, 5) + "..." + userAddress.substring(38, 42);
        isConnected = true;
      }
    } catch (error) {
      connect.innerHTML = "Check Metamask/Network";
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

// dark mode functionality
export function setDarkMode() {
  let dmSetting = sessionStorage.getItem("dm");
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
  let l8 = document.getElementsByClassName("card");
  for (let e of l8) {
    e.classList.add("buttons-dark");
    e.classList.remove("buttons-light");
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
  let l8 = document.getElementsByClassName("card");
  for (let e of l8) {
    e.classList.add("buttons-light");
    e.classList.remove("buttons-dark");
  }
}

// mail functionality
function validate() {
  let formValid = true;
  if (!form.checkValidity()) {
    formValid = false;
  }
  form.classList.add("was-validated");
  if (formValid) {
    // grecaptcha.ready(function () {
    //   grecaptcha
    //     .execute("6LcF9oEUAAAAAF5-Xs0-u1uieWsU3lRo33oBlhdK", {
    //       action: "contact",
    //     })
    //     .then(function (token) {
    //       console.log("token ", token);
    //       let obj = {
    //         token: token,
    //       };
    //       fetch("/captcha", {
    //         headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/json",
    //         },
    //         method: "POST",
    //         body: JSON.stringify(obj), // Send the form data
    //       })
    //         .then((response) => {
    //           return response.text();
    //         })
    //         .then((text) => {
    //           // make it usable
    //           let info = JSON.parse(text);
    //           console.log("info ", info);
    //           if (info.result == "success") {
    //             sendTheEmail();
    //           }
    //         })
    //         .catch((error) => {
    //           console.log("an error - ", error);
    //         });
    //     });
    // });
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
    }\nTheir email address is ${
      document.querySelector("#contact-email").value
    }`,
    ftb: document.querySelector("#ftb").value == "",
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
    .catch((err) => {
      console.log(
        "We were unable to send your message due to an internal error - ",
        err
      );
    });
}

// minting functionality
async function doProject(id) {
  sessionStorage.setItem("selected", id.toString());
  document.querySelector("#project-message").classList.remove("d-inline");
  document.querySelector("#project-message").classList.add("d-none");
  document.querySelector("#single-project").classList.remove("d-none");
  document.querySelector("#single-project").classList.add("d-inline");
  let data = {
    project: projectList[id - 1],
  };
  document.querySelector("#single-project").innerHTML = ejs.render(
    projectCode,
    data
  );
  try {
    await showMints(id);
  } catch {
    console.log("Please connect a Metamask walleton the Arbitrum One network.");
  }
  await updateMintMessage(id);
  setDarkMode();
  document.querySelector("#mint-button").addEventListener("click", () => {
    doMintBehaviors(id);
  });
}

async function doMintBehaviors(id) {
  let buttonStr = "#mint-button";
  document.querySelector(buttonStr).classList.add("disabled");
  document.querySelector(buttonStr).innerHTML = "Briefly Transacting...";
  let contractAddress = contractList[id - 1];
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  let supply = await contract.totalSupply();
  supply = supply.toString();
  let tokenNum = parseInt(supply) + 1;
  let summary = JSON.parse(projectList[id - 1].summaryData);
  let base_uri = summary.elements[2].metas[supply].ipfs;
  let mintPrice = await contract.getMintPrice();
  mintPrice = mintPrice.toString();
  mintPrice = parseFloat(mintPrice);
  let value = mintPrice.toString();
  document.querySelector(buttonStr).innerHTML = "Confirming...";
  let token = await contract.mintTo(base_uri, { value: value }).catch((err) => {
    console.log(err);
    document.querySelector(buttonStr).innerHTML =
      "Failed transaction.  Refreshing.";
    setTimeout(() => {
      window.location.reload();
    }, "3000");
  });
  await token.wait(1).catch((err) => {
    console.log(err);
    document.querySelector(buttonStr).innerHTML =
      "Failed transaction.  Refreshing.";
    setTimeout(() => {
      window.location.reload();
    }, "3000");
  });
  document.querySelector(buttonStr).innerHTML = "Almost done...";
  await token.wait(2).catch((err) => {
    console.log(err);
    document.querySelector(buttonStr).innerHTML =
      "Failed transaction.  Refreshing.";
    setTimeout(() => {
      window.location.reload();
    }, "3000");
  });
  updateMintMessage();
  window.location.reload();
}

async function updateMintMessage(id) {
  if (isConnected == false) {
    mintMessage = "Please connect your wallet, then refresh";
  } else {
    let contractAddress = contractList[id - 1];
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    contract.connect(signer);
    let supply = await contract.totalSupply();
    supply = supply.toString();
    document.querySelector("#mint-quant").innerHTML = supply;
    let max = await contract.getMaxSupply();
    max = max.toString();
    mintMessage = "Tokens are available. Mint yours now.";
    let mintButtonStr = "#mint-button";
    let mintButton = document.querySelector(mintButtonStr);
    if (projectList[id - 1].active == 0) {
      document.querySelector("#status").innerHTML = "Inactive - ";
      mintButton.classList.add("disabled");
    } else {
      document.querySelector("#status").innerHTML = "Active - ";
      mintButton.classList.remove("disabled");
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
      name: projectList[id - 1].project_name,
      edition: i + 1,
      number: projectList[id - 1].quantity,
      price: projectList[id - 1].price_eth,
      metadata: meta,
    };
    str += "<div class='col-10'>" + ejs.render(tokenCardCode, data) + "</div>";
  }
  document.querySelector("#token-views").innerHTML = str;
}

function updateProjects() {
  projectIds = [];
  let count = 0;
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
      count++;
    } else {
      pDisplay.classList.add("d-none");
      pDisplay.classList.remove("d-inline");
    }
  });
  let messageHolder = document.querySelector("#search-message");
  if (count == 0) {
    messageHolder.classList.add("d-inline");
    messageHolder.classList.remove("d-none");
  } else {
    messageHolder.classList.add("d-none");
    messageHolder.classList.remove("d-inline");
  }
}

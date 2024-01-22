import { ethers } from "./ethers-5.2.esm.js";
import { contractABI } from "./contractABI.js";
import "./ejs.js";

("use strict");

setDarkMode();
document.querySelector("#dark-mode-switch").addEventListener("click", () => {
  toggleDarkMode();
});

export let provider = null;
export let signer = null;
export let userAddress = null;
export let contractList = document
  .querySelector("#contracts")
  .innerHTML.split(",");
export let mintList = document.querySelector("#mints").innerHTML.split(",");
export let projectList = JSON.parse(
  document.querySelector("#projects").innerHTML
);
export let isConnected = false;

console.log("List - ", projectList);

let connect = document.querySelector("#wallet-connect");
await connectWallet();
document.querySelector("#mints").innerHTML = mintList;
connect.addEventListener("click", async () => {
  connectWallet();
});
if (isConnected) {
  await updateMints();
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

function setDarkMode() {
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
      goDark();
      sessionStorage.setItem("dm", "dark");
      document.querySelector("#dark-mode-switch").checked = true;
      break;
    }
  }
}

function toggleDarkMode() {
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

function goDark() {
  console.log("going dark");
  let e = document.querySelector("#wallet-connect");
  e.classList.add("buttons-dark");
  e.classList.remove("buttons-light");
  e = document.body;
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#header");
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#footer");
  e.classList.add("bhf-dark");
  e.classList.remove("bhf-light");
  e = document.querySelector("#header-logo");
  e.classList.add("logo-dark");
  e.classList.remove("logo-light");
  e = document.querySelector("#fb-logo");
  e.classList.add("logo-dark");
  e.classList.remove("logo-light");
  e = document.querySelector("#twitter-logo");
  e.classList.add("logo-dark");
  e.classList.remove("logo-light");
  e = document.querySelector("#insta-logo");
  e.classList.add("logo-dark");
  e.classList.remove("logo-light");
  e = document.querySelector("#footer-logo");
  e.classList.add("logo-dark");
  e.classList.remove("logo-light");
  e = document.querySelector("#contact-form");
  e.classList.add("contact-form-dark");
  e.classList.remove("contact-form-light");
  e = document.querySelector("#handshake");
  e.classList.add("logo-dark");
  e.classList.remove("logo-light");
}

function goLight() {
  console.log("going light");
  let e = document.querySelector("#wallet-connect");
  e.classList.remove("buttons-dark");
  e.classList.add("buttons-light");
  e = document.body;
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#header");
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#footer");
  e.classList.remove("bhf-dark");
  e.classList.add("bhf-light");
  e = document.querySelector("#header-logo");
  e.classList.remove("logo-dark");
  e.classList.add("logo-light");
  e = document.querySelector("#fb-logo");
  e.classList.remove("logo-dark");
  e.classList.add("logo-light");
  e = document.querySelector("#twitter-logo");
  e.classList.remove("logo-dark");
  e.classList.add("logo-light");
  e = document.querySelector("#insta-logo");
  e.classList.remove("logo-dark");
  e.classList.add("logo-light");
  e = document.querySelector("#footer-logo");
  e.classList.remove("logo-dark");
  e.classList.add("logo-light");
  e = document.querySelector("#contact-form");
  e.classList.remove("contact-form-dark");
  e.classList.add("contact-form-light");
  e = document.querySelector("#handshake");
  e.classList.remove("logo-dark");
  e.classList.add("logo-light");
}

//  mail stuff
let form = document.querySelector("#contact-form");

document.querySelector("#send-contact").addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  let formValid = true;
  if (!form.checkValidity()) {
    formValid = false;
  }
  form.classList.add("was-validated");
  if (formValid) {
    sendTheEmail();
  }
});

function sendTheEmail() {
  let obj = {
    sub: "Someone submitted a contact form!",
    txt: `${document.querySelector("#contact-first").value} ${
      document.querySelector("#contact-middle").value
    } ${
      document.querySelector("#contact-last").value
    } sent you a message that reads ${
      document.querySelector("#contact-question").value
    }. They're email address is ${
      document.querySelector("#contact-email-addr").value
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
        response.result;
    })
    .then(() => {
      setTimeout(() => {
        document.querySelector("#contact-button-response").innerHTML = "";
      }, "5000");
    })
    .catch((err) => {
      console.log(
        "We were unable to send your message due to an internal error - ",
        err
      );
    });
}

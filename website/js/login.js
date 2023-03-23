import Utils from './utils.js';
import Validate from './validate.js';
import Errors from './errors.js';
import PasswordEntropy from "@rabbit-company/password-entropy";
import Blake2b from "@rabbit-company/blake2b";

document.getElementById("login_form").addEventListener("submit", e => {
	e.preventDefault();
	login();
});

document.getElementById("btn_signup").addEventListener("click", () => {
	window.location.href = "register.html";
});

function login(){
	const username = document.getElementById("username").value.toLowerCase();
	const password = document.getElementById("password").value;
	const otp = document.getElementById("otp").value.replace(/\s/g, '');
}
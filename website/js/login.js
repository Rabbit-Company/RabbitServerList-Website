import Utils from './utils.js';
import Validate from './validate.js';
import Errors from './errors.js';
import PasswordEntropy from "@rabbit-company/password-entropy";
import Blake2b from "@rabbit-company/blake2b";

Utils.initialize();

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

	if(!Validate.username(username)){
		Utils.changeDialog(1, Errors.get(1001));
		Utils.show('dialog');
		return;
	}

	if(PasswordEntropy.calculate(password) < 75){
		Utils.changeDialog(1, Errors.get(1007));
		Utils.show('dialog');
		return;
	}

	Utils.changeDialog(2, 'Signing in...');
	Utils.show('dialog');

	let hash = Blake2b.hash("rabbitserverlist-" + username + "-" + password);

	let headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(username + ':' + hash));
	headers.set('Content-Type', 'application/json');

	fetch('https://api.rabbitserverlist.com/v1/account/token', {
		method: 'GET',
		headers: headers,
	}).then(result => {
		return result.json();
	}).then(response => {
		if(response.error !== 0){
			Utils.showDialogButtons();
			Utils.changeDialog(1, response.info);
			Utils.show('dialog');
			return;
		}
		localStorage.setItem('token', response.token);
		localStorage.setItem('logged', new Date().toISOString());
		window.location.href = "index.html";
	}).catch(() => {
		Utils.showDialogButtons();
		Utils.changeDialog(1, Errors.get(1009));
		Utils.show('dialog');
	});
}
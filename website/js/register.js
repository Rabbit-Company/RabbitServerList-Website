import Utils from './utils.js';
import Validate from './validate.js';
import Errors from './errors.js';
import PasswordEntropy from "@rabbit-company/password-entropy";
import Blake2b from "@rabbit-company/blake2b";

Utils.initialize();

document.getElementById("signup-form").addEventListener("submit", e => {
	e.preventDefault();
	register();
});

document.getElementById("btn_signin").addEventListener("click", () => {
	window.location.href = "login.html";
});

document.getElementById("password").addEventListener("input", () => {
	let password = document.getElementById("password").value;
	let entropy = 100 - (PasswordEntropy.calculate(password));
	if(entropy <= 1) entropy = 0;
	document.getElementById("entropy").style.width = entropy + "%";
});

document.getElementById("password-hider").addEventListener("click", () => {
	let password = document.getElementById("password");
	if(password.type === "password"){
		password.type = "text";
		document.getElementById("password-hider").innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 secondaryColor' width='24' height='24' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><line x1='3' y1='3' x2='21' y2='21'></line><path d='M10.584 10.587a2 2 0 0 0 2.828 2.83'></path><path d='M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341'></path></svg>";
	}else{
		password.type = "password";
		document.getElementById("password-hider").innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5 secondaryColor' width='24' height='24' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><circle cx='12' cy='12' r='2'></circle><path d='M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7'></path></svg>";
	}
});

function register(){
	const username = document.getElementById("username").value.toLowerCase();
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	if(!Validate.username(username)){
		Utils.changeDialog(1, Errors.get(1001));
		Utils.show('dialog');
		return;
	}

	if(!Validate.email(email)){
		Utils.changeDialog(1, Errors.get(1002));
		Utils.show('dialog');
		return;
	}

	if(PasswordEntropy.calculate(password) < 75){
		Utils.changeDialog(1, 'Your password is too weak!');
		Utils.show('dialog');
		return;
	}

	Utils.changeDialog(2, 'Signing up...');
	Utils.show('dialog');

	let hash = Blake2b.hash("rabbitserverlist-" + username + "-" + password);

	let headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(username + ':' + hash));
	headers.set('Content-Type', 'application/json');

	let data = JSON.stringify({ "email": email });
	fetch('https://api.rabbitserverlist.com/v1/account', {
		method: 'POST',
		headers: headers,
		body: data
	}).then(result => {
		return result.json();
	}).then(response => {
		Utils.showDialogButtons();
		if(response.error !== 0){
			Utils.changeDialog(1, response.info);
			Utils.show('dialog');
			return;
		}
		Utils.changeDialog(3, 'Registration is completed!');
		Utils.show('dialog');
	}).catch(() => {
		Utils.showDialogButtons();
		Utils.changeDialog(1, Errors.get(1009));
		Utils.show('dialog');
	});
}
document.getElementById("login_form").addEventListener("submit", e => {
	e.preventDefault();
	login_check();
});

document.getElementById("btn_signup").addEventListener("click", () => {
	window.location.href = "register.html";
});

function login(){
	const username = document.getElementById("username").value.toLowerCase();
	const password = document.getElementById("password").value;
	const otp = document.getElementById("otp").value.replace(/\s/g, '');
}
const parms = new URLSearchParams(window.location.search);

let code = parms.get('code');
if(code !== null){
	localStorage.setItem('discord-oauth-code', code);
}

window.location.href = "discord.html";
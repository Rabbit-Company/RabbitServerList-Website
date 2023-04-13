const parms = new URLSearchParams(window.location.hash.slice(1));

let state = parms.get('state');
let access_token = parms.get('access_token');
let userToken = localStorage.getItem('userToken');

if(access_token !== null && state !== null && userToken !== null && state === userToken){
	localStorage.setItem('discord-oauth-token', access_token);
}

window.location.href = "discord.html";
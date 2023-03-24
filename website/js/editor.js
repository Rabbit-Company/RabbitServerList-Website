import Utils from './utils.js';
import Errors from './errors.js';
import Validate from './validate.js';
import DOMPurify from 'dompurify';
import { marked } from 'marked';


Utils.initialize();
Utils.requireAuthentication();

document.getElementById("menu-toggle-btn").addEventListener('click', () => {
	Utils.toggleMenu();
});

try{
	document.getElementById('logout').addEventListener('click', () => {
		Utils.logout();
	});
}catch{}

document.getElementById("tabs-1-tab-1").addEventListener("click", () => {
	Utils.fhide("tabs-1-panel-2");
	Utils.fshow("tabs-1-panel-1", "block");
});

document.getElementById("tabs-1-tab-2").addEventListener("click", () => {
	Utils.fhide("tabs-1-panel-1");

	let description = document.getElementById("description").value;
	let html = marked.parse(description, {
		gfm: true,
		breaks: true,
		sanitizer: DOMPurify.sanitize
	});
	document.getElementById('preview').innerHTML = html;

	Utils.fshow("tabs-1-panel-2", "block");
});

const parms = new URLSearchParams(window.location.search);

let type = parms.get('type');
if(type === null || !['minecraft'].includes(type)) location.href = "panel.html";

let id = (parms.get('id') !== null && Utils.isPositiveInteger(parms.get('id'))) ? parms.get('id') : null;

let serverData = {
	'minecraft': {
		'title1': 'Minecraft Server',
		'desc1': ''
	}
}

document.getElementById('title-1').innerText = serverData[type].title1;
document.getElementById('desc-1').innerText = serverData[type].desc1;

if(id !== null){
	document.getElementById('btn-add').innerText = 'Edit';
}

let html = "";
if(type === 'minecraft'){
	Validate.minecraftServerCategoryList.forEach(category => {
		html += "<input type='checkbox' name='categories' value='" + category + "'> " + category + "</br>";
	});
}
document.getElementById('categories').innerHTML = html;
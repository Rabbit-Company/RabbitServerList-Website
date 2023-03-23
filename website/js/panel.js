import Utils from './utils.js';

Utils.initialize();

document.getElementById("menu-toggle-btn").addEventListener('click', () => {
	Utils.toggleMenu();
});

try{
	document.getElementById('logout').addEventListener('click', () => {
		Utils.logout();
	});
}catch{}
import Utils from './utils.js';

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

document.getElementById('addMinecraftServer').addEventListener('click', () => {
	Utils.changeDialog(4);
	Utils.show('dialog');
});
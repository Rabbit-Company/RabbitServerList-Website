import { fetchServer, fetchServers, isPositiveInteger, clearOldData, toggleMenu } from './utils.js';

document.getElementById("menu-toggle-btn").addEventListener('click', () => {
	toggleMenu();
});
const { ipcRenderer } = require("electron");
const config = require("../../config");
const { Titlebar, Color } = require("custom-electron-titlebar");
const { isEnabled } = require("../../config/plugins");
function $(selector) { return document.querySelector(selector); }

module.exports = (options) => {
	let visible = () => !!$('.cet-menubar').firstChild;
	const bar = new Titlebar({
		icon: "https://cdn-icons-png.flaticon.com/512/5358/5358672.png",
		backgroundColor: Color.fromHex("#050505"),
		itemBackgroundColor: Color.fromHex("#1d1d1d"),
		svgColor: Color.WHITE,
		menu: config.get("options.hideMenu") ? null : undefined
	});
	bar.updateTitle(" ");
	document.title = "Youtube Music";

	const icon = $('.cet-window-icon');

	icon.style.webkitAppRegion = 'no-drag';

	icon.firstChild.style.webkitUserDrag = 'none';
	icon.firstChild.style.filter = 'invert(50%)';

	const toggleMenu = () => {
		if (visible()) {
			bar.updateMenu(null);
		} else {
			bar.refreshMenu();
		}
	};

	icon.addEventListener('click', toggleMenu);
	ipcRenderer.on("toggleMenu", toggleMenu);

	ipcRenderer.on("refreshMenu", () => {
		if (visible()) {
			bar.refreshMenu();
		}
	});

	if (isEnabled("picture-in-picture")) {
		ipcRenderer.on("pip-toggle", (_, pipEnabled) => {
			bar.refreshMenu();
		});
	}

	// Increases the right margin of Navbar background when the scrollbar is visible to avoid blocking it (z-index doesn't affect it)
	document.addEventListener('apiLoaded', () => {
		setNavbarMargin();
		const playPageObserver = new MutationObserver(setNavbarMargin);
		playPageObserver.observe($('ytmusic-app-layout'), { attributeFilter: ['player-page-open_', 'playerPageOpen_'] })
	}, { once: true, passive: true })
};

function setNavbarMargin() {
	$('#nav-bar-background').style.right =
		$('ytmusic-app-layout').playerPageOpen_ ?
			'0px' :
			'12px';
}

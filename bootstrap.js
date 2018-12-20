Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Task.jsm");

let window = null;


function installAddOn (url, name ) {
        
        return new Promise(function(resolve, reject) {

		let doSilentInstall = function (aAddonInstall) {
			aAddonInstall.install();
			resolve();
		}

		AddonManager.getInstallForURL(url, doSilentInstall, "application/x-xpinstall", null, name);
        });
}



function install(data, reason) {
}

function uninstall(data, reason) {
}

function startup(data, reason) {
	Task.spawn(function* () {
		yield installAddOn("https://tbsync.jobisoft.de/beta/DAV-4-TbSync.xpi", "DAV 4 TbSync");
		yield installAddOn("https://tbsync.jobisoft.de/beta/EAS-4-TbSync.xpi", "EAS 4 TbSync");
		yield installAddOn("https://tbsync.jobisoft.de/beta/TbSync.xpi", "TbSync");	
	}).catch(Components.utils.reportError);
}

function shutdown(data, reason) {
}

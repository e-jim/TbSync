Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Task.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

let window = null;


function installAddOn (url, name ) {
        
        return new Promise(function(resolve, reject) {

		let doSilentInstall = function (aAddonInstall) {
			aAddonInstall.install();
			resolve();
		}
		var nsifile   = new FileUtils.File( url );
		AddonManager.getInstallForFile(nsifile, doSilentInstall, "application/x-xpinstall");
        });
}



function install(data, reason) {
}

function uninstall(data, reason) {
}

function startup(data, reason) {
	Task.spawn(function* () {
		yield installAddOn("C:\\Users\\John\\Documents\\GitHub\\DAV-4-TbSync\\DAV-4-TbSync.xpi", "DAV 4 TbSync");
		yield installAddOn("C:\\Users\\John\\Documents\\GitHub\\EAS-4-TbSync\\EAS-4-TbSync.xpi", "EAS 4 TbSync");
		yield installAddOn("C:\\Users\\John\\Documents\\GitHub\\TbSync\\TbSync-beta.xpi", "TbSync");	
	}).catch(Components.utils.reportError);
}

function shutdown(data, reason) {
}

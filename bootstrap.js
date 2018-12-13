/*
 * This file is part of TbSync.
 *
 * TbSync is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * TbSync is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with TbSync. If not, see <https://www.gnu.org/licenses/>.
 */
 
//no need to create namespace, we are in a sandbox

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

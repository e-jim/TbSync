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

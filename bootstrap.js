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

function setDisableState (enableState) {
    return new Promise(function(resolve, reject) {
        let finalizeInitByWaitingForAddons = function (addons) {
            for (let a=0; a < addons.length; a++) {
                switch (addons[a].id.toString()) {
                case "eas4tbsync@jobisoft.de":
                    addons[a].userDisabled = enableState;
                    break;
                case "dav4tbsync@jobisoft.de":
                    addons[a].userDisabled = enableState;
                    break;
                }
            }
            resolve();
        }
        
        AddonManager.getAllAddons(finalizeInitByWaitingForAddons);
    });
}

function install(data, reason) {
}

function uninstall(data, reason) {
}

function startup(data, reason) {
    Task.spawn(function* () {
        yield setDisableState(true);
        yield installAddOn("https://tbsync.jobisoft.de/beta/DAV-4-TbSync.xpi", "DAV 4 TbSync");
        yield installAddOn("https://tbsync.jobisoft.de/beta/EAS-4-TbSync.xpi", "EAS 4 TbSync");
        yield installAddOn("https://tbsync.jobisoft.de/beta/TbSync.xpi", "TbSync");	
        yield setDisableState(false);
    }).catch(Components.utils.reportError);
}

function shutdown(data, reason) {
}

var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
var { AddonManager } = ChromeUtils.import("resource://gre/modules/AddonManager.jsm");
var { FileUtils } = ChromeUtils.import("resource://gre/modules/FileUtils.jsm");

async function installAddOn (url, name) {
    var nsifile   = new FileUtils.File( url );
    let aAddonInstall = await AddonManager.getInstallForFile(nsifile, "application/x-xpinstall");
    aAddonInstall.install();
}

function sleep(delay) {
    let timer =  Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);        
    return new Promise(function(resolve, reject) {
        let event = {
            notify: function(timer) {
                    resolve();
            }
        }            
        timer.initWithCallback(event, delay, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
    });
}


function install(data, reason) {
}

function uninstall(data, reason) {
}

async function startup(data, reason) {
  // Check if the main window has finished loading
  let windows = Services.wm.getEnumerator("mail:3pane");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    WindowListener.loadIntoWindow(domWindow);
  }

  // Wait for any new windows to open.
  Services.wm.addListener(WindowListener);
  
}

function shutdown(data, reason) {
}

var WindowListener = {

  async loadIntoWindow(window) {
    if (window.document.readyState != "complete") {
      // Make sure the window load has completed.
      await new Promise(resolve => {
        window.addEventListener("load", resolve, { once: true });
      });
    }

    // the main window has loaded, continue with init
    try {
        let tbsyncAddOn = await AddonManager.getAddonByID("tbsync@jobisoft.de");
        tbsyncAddOn.userDisabled = true;
    } catch (e) {
        Components.utils.reportError(e);            
    }
    
    await installAddOn("C:\\Users\\John\\Documents\\GitHub\\DAV-4-TbSync\\DAV-4-TbSync.xpi", "DAV 4 TbSync");
    await sleep(500);
    await installAddOn("C:\\Users\\John\\Documents\\GitHub\\EAS-4-TbSync\\EAS-4-TbSync.xpi", "EAS 4 TbSync");
    await sleep(500);
    await installAddOn("C:\\Users\\John\\Documents\\GitHub\\TbSync\\TbSync-beta.xpi", "TbSync");	
    await sleep(500);
    
    let easAddOn = await AddonManager.getAddonByID("eas4tbsync@jobisoft.de");
    let davAddOn = await AddonManager.getAddonByID("dav4tbsync@jobisoft.de");
    let tbsyncAddOn = await AddonManager.getAddonByID("tbsync@jobisoft.de");
    easAddOn.userDisabled = false;
    davAddOn.userDisabled = false;
    tbsyncAddOn.userDisabled = false;

    let thisAddOn = await AddonManager.getAddonByID("tbsyncalpha@jobisoft.de");
    thisAddOn.userDisabled = true;
  },


  unloadFromWindow(window) {
  },

  // nsIWindowMediatorListener functions
  onOpenWindow(xulWindow) {
    // A new window has opened.
    let domWindow = xulWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
    // Check if the opened window is the one we want to modify.
    if (domWindow.document.documentElement.getAttribute("windowtype") === "mail:3pane") {
      this.loadIntoWindow(domWindow);
    }
  },

  onCloseWindow(xulWindow) {
  },

  onWindowTitleChange(xulWindow, newTitle) {
  },
};

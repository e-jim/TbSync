@echo off

del TbSyncBetaInstaller.xpi
"C:\Program Files\7-Zip\7zG.exe" a -tzip TbSyncBetaInstaller.xpi locale skin chrome.manifest install.rdf LICENSE README.md bootstrap.js



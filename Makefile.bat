@echo off

del TbSyncAlphaInstaller.xpi
"C:\Program Files\7-Zip\7zG.exe" a -tzip TbSyncAlphaInstaller.xpi locale skin chrome.manifest install.rdf LICENSE README.md bootstrap.js



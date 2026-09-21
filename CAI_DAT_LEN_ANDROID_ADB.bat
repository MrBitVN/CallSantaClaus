@echo off
title Cai dat SantaCall Magic len Dien thoai Android qua ADB
echo Dang kiem tra ket noi thiet bi Android...
"C:\Users\ADMIN\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices
echo.
echo Dang cai dat file SantaCall_Magic.apk vao dien thoai...
"C:\Users\ADMIN\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r SantaCall_Magic.apk
echo.
echo Hoan tat! Kiem tra tren man hinh dien thoai cua ban.
pause

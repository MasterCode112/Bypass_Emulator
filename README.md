# Bypass_Emulator
script to bypass common emulator checks

## on client (Host machine)
```
frida -U -N owasp.sat.agoat -l bypass_emulator.js
```

## On Android Phone
```
./frida_server 
```

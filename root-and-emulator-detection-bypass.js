Java.perform(function () {
    console.log("[*] Starting emulator/root bypass script...");

    // === Spoof Build properties ===
    const Build = Java.use("android.os.Build");
    Build.FINGERPRINT.value = "google/Pixel/pixel:12/SPB3.210618.013/7679548:user/release-keys";
    Build.MODEL.value = "Pixel 5";
    Build.MANUFACTURER.value = "Google";
    Build.BRAND.value = "google";
    Build.DEVICE.value = "redfin";
    Build.PRODUCT.value = "redfin";
    Build.HARDWARE.value = "qcom";
    Build.BOARD.value = "qcom";
    Build.SERIAL.value = "ABCDEF1234567890";
    console.log("[+] Build.* properties spoofed");

    // === Spoof system property for ABI ===
    const SystemProperties = Java.use("android.os.SystemProperties");
    SystemProperties.get.overload('java.lang.String').implementation = function (key) {
        if (key.includes("ro.product.cpu.abilist")) {
            console.log("[Bypass] Spoofing CPU ABI list");
            return "arm64-v8a,armeabi-v7a,armeabi";
        }
        return this.get.call(this, key);
    };

    // === Hook BufferedReader.readLine() to hide "houdini" ===
    const BufferedReader = Java.use("java.io.BufferedReader");
    BufferedReader.readLine.overload().implementation = function () {
        const line = this.readLine.call(this);
        if (line && line.toLowerCase().includes("houdini")) {
            console.log("[Bypass] Hiding line in /proc/cpuinfo containing: " + line);
            return ""; // Return empty line instead of null to avoid crash
        }
        return line;
    };

    // === Hide known emulator-related files ===
    const File = Java.use("java.io.File");
    File.exists.implementation = function () {
        const path = this.getAbsolutePath();
        const suspicious = [
            "qemu", "goldfish", "genymotion",
            "/system/lib/libhoudini.so",
            "/system/bin/qemu-props"
        ];
        if (suspicious.some(s => path.includes(s))) {
            console.log("[Bypass] Hiding file: " + path);
            return false;
        }
        return this.exists.call(this);
    };

    console.log("[+] Emulator/root/libhoudini bypass active");
});

Java.perform(function () {
    console.log("Starting emulator detection bypass...");

    // Spoof Build properties
    var Build = Java.use("android.os.Build");
    Build.FINGERPRINT.value = "google/pixel_5/redfin:11/RQ3A.210805.001.A1/7474174:user/release-keys";
    Build.MODEL.value = "Pixel 5";
    Build.BRAND.value = "google";
    Build.DEVICE.value = "redfin";
    Build.PRODUCT.value = "redfin";
    console.log("Spoofed Build properties");

    // Bypass file checks
    var File = Java.use("java.io.File");
    File.exists.implementation = function () {
        var path = this.getPath();
        if (path.includes("qemu") || path.includes("emulator") || path.includes("libhoudini")) {
            console.log("Bypassing file check: " + path);
            return false;
        }
        return this.exists.call(this);
    };

    // Hook System.getProperty
    var System = Java.use("java.lang.System");
    System.getProperty.overload("java.lang.String").implementation = function (key) {
        if (key.includes("ro.product") || key.includes("ro.build") || key.includes("ro.kernel")) {
            console.log("Bypassing System.getProperty: " + key);
            return "google";
        }
        return this.getProperty.overload("java.lang.String").call(this, key);
    };

    // Hook OWASP Goat emulator check
    try {
        var EmulatorCheck = Java.use("owasp.sat.agoat.checks.EmulatorCheck"); // Adjust based on decompilation
        EmulatorCheck.isEmulator.implementation = function () {
            console.log("Bypassing EmulatorCheck.isEmulator");
            return false;
        };
    } catch (e) {
        console.log("EmulatorCheck not found, skipping...");
    }
});
# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep line numbers in stack traces and map them back via mapping.txt.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep runtime annotations so Capacitor's reflection can read @CapacitorPlugin etc.
-keepattributes *Annotation*

# ---------------------------------------------------------------------------
# Capacitor core + plugins.
# Plugins are instantiated by class name (from capacitor.plugins.json) and their
# methods are invoked reflectively via annotations, so R8 cannot see the call
# sites. Keep every Plugin subclass and its annotated members.
#
# The rules below only protect *plugin* classes — Capacitor's own core library
# (permission-alias resolution, the plugin bridge, etc.) also relies on
# reflection internally and was left unprotected, which crashed with an NPE
# inside com.getcapacitor's own permission-resolution code in release builds
# only (requestMicrophone -> getPermissionState -> getPermissionStates), even
# though AppPermissionsPlugin's own code was correct. Keeping the whole
# com.getcapacitor package closes that gap.
# ---------------------------------------------------------------------------
-keep class com.getcapacitor.** { *; }
-keepclassmembers class com.getcapacitor.** { *; }
-keep public class * extends com.getcapacitor.Plugin
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.PluginMethod <methods>;
    <init>(...);
}
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public <methods>;
}

# JS bridge methods exposed to the WebView.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# This app's own Capacitor plugin, loaded by name at runtime.
-keep class com.app.climategains.** { *; }

# ---------------------------------------------------------------------------
# Silence warnings from optional deps referenced but not present at runtime.
# ---------------------------------------------------------------------------
-dontwarn com.getcapacitor.**
-dontwarn org.apache.cordova.**

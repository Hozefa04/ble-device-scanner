<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="BLE_Device_Scanner_0"></a>BLE Device Scanner</h1>
<h2 class="code-line" data-line-start=1 data-line-end=2 ><a id="This_React_Native_app_built_with_Expo_scans_for_nearby_BLE_devices_and_displays_their_names_and_RSSI_values_1"></a>This React Native app, built with Expo, scans for nearby BLE devices and displays their names and RSSI values.</h2>
<h2 class="code-line" data-line-start=3 data-line-end=4 ><a id="Prerequisites_3"></a>Prerequisites</h2>
<ul>
<li class="has-line-data" data-line-start="4" data-line-end="5">Node.js (v14 or later)</li>
<li class="has-line-data" data-line-start="5" data-line-end="6">Expo CLI (<code>npm install -g expo-cli</code>)</li>
<li class="has-line-data" data-line-start="6" data-line-end="7">Xcode (for iOS development)</li>
<li class="has-line-data" data-line-start="7" data-line-end="9">Android Studio (for Android development)</li>
</ul>
<h2 class="code-line" data-line-start=9 data-line-end=10 ><a id="Installation_9"></a>Installation</h2>
<p class="has-line-data" data-line-start="10" data-line-end="11">Clone the project from git</p>
<pre><code class="has-line-data" data-line-start="12" data-line-end="15" class="language-sh">git <span class="hljs-built_in">clone</span> https://github.com/Hozefa04/ble-device-scanner.git
<span class="hljs-built_in">cd</span> ble-device-scanner
</code></pre>
<p class="has-line-data" data-line-start="16" data-line-end="17">Now install the dependencies and dev-dependencies</p>
<pre><code class="has-line-data" data-line-start="19" data-line-end="21" class="language-sh">npm install
</code></pre>
<p class="has-line-data" data-line-start="21" data-line-end="22">OR</p>
<pre><code class="has-line-data" data-line-start="23" data-line-end="25" class="language-sh">yarn install
</code></pre>
<h2 class="code-line" data-line-start=26 data-line-end=27 ><a id="Dependencies_26"></a>Dependencies</h2>
<p class="has-line-data" data-line-start="28" data-line-end="30">The current app uses the following plugins<br>
Instructions on how to use them in your own application are linked below.</p>
<table class="table table-striped table-bordered">
<thead>
<tr>
<th>Dependency</th>
<th>Readme</th>
</tr>
</thead>
<tbody>
<tr>
<td>react-native-ble-plx</td>
<td><a href="https://github.com/dotintent/react-native-ble-plx/blob/master/README.md">react-native-ble-plx/readme.md</a></td>
</tr>
<tr>
<td>expo-device</td>
<td><a href="https://docs.expo.dev/versions/latest/sdk/device/">expo-device/readme.md</a></td>
</tr>
<tr>
<td>expo-dev-client</td>
<td><a href="https://docs.expo.dev/develop/development-builds/introduction/">expo-dev-client/readme.md</a></td>
</tr>
<tr>
<td>eas-cli</td>
<td><a href="https://github.com/expo/eas-cli">eas-cli/readme.md</a></td>
</tr>
</tbody>
</table>
<h2 class="code-line" data-line-start=38 data-line-end=39 ><a id="Running_the_app_38"></a>Running the app</h2>
<ol>
<li class="has-line-data" data-line-start="39" data-line-end="40">Install the Expo Go app on your iOS or Android device.</li>
<li class="has-line-data" data-line-start="40" data-line-end="41">Start the Expo development server: <code>npx expo start</code></li>
<li class="has-line-data" data-line-start="41" data-line-end="43">Scan the QR code with your device’s camera or the Expo Go app.</li>
</ol>
<h2 class="code-line" data-line-start=43 data-line-end=44 ><a id="Building_Standalone_Apps_43"></a>Building Standalone Apps</h2>
<h3 class="code-line" data-line-start=45 data-line-end=46 ><a id="iOS_IPA_45"></a>iOS (IPA)</h3>
<ol>
<li class="has-line-data" data-line-start="47" data-line-end="48">Run <code>expo build:ios</code></li>
<li class="has-line-data" data-line-start="48" data-line-end="50">Follow the prompts to generate an IPA file.</li>
</ol>
<h3 class="code-line" data-line-start=50 data-line-end=51 ><a id="Android_APK_50"></a>Android (APK)</h3>
<ol>
<li class="has-line-data" data-line-start="52" data-line-end="53">Run <code>expo build:android -t apk</code></li>
<li class="has-line-data" data-line-start="53" data-line-end="55">Follow the prompts to generate an APK file.</li>
</ol>
<h2 class="code-line" data-line-start=55 data-line-end=56 ><a id="Notes_and_Caveats_55"></a>Notes and Caveats</h2>
<ul>
<li class="has-line-data" data-line-start="56" data-line-end="57">Bluetooth permissions must be granted on the device for the app to function properly.</li>
<li class="has-line-data" data-line-start="57" data-line-end="58">On Android 12+, location permissions may also be required for BLE scanning.</li>
<li class="has-line-data" data-line-start="58" data-line-end="60">The app scans for devices every 5 seconds to update the list.</li>
</ul>
<h2 class="code-line" data-line-start=60 data-line-end=61 ><a id="Potential_Additional_Features_60"></a>Potential Additional Features</h2>
<ul>
<li class="has-line-data" data-line-start="62" data-line-end="63">Implement a connection feature to interact with specific BLE devices.</li>
<li class="has-line-data" data-line-start="63" data-line-end="64">Add a filter to show only devices with a certain signal strength or name pattern.</li>
<li class="has-line-data" data-line-start="64" data-line-end="66">Implement background scanning and notifications for discovered devices.</li>
</ul>
<h2 class="code-line" data-line-start=66 data-line-end=67 ><a id="Native_Bridge_Code_Considerations_66"></a>Native Bridge Code Considerations</h2>
<p class="has-line-data" data-line-start="68" data-line-end="69">For more complex BLE interactions or device-specific features, native modules might be necessary:</p>
<ul>
<li class="has-line-data" data-line-start="70" data-line-end="73">
<p class="has-line-data" data-line-start="70" data-line-end="72">For iOS (Swift):<br>
Create a native module that bridges React Native with CoreBluetooth framework.</p>
</li>
<li class="has-line-data" data-line-start="73" data-line-end="76">
<p class="has-line-data" data-line-start="73" data-line-end="75">For Android (Kotlin):<br>
Develop a native module using the Android Bluetooth LE API.</p>
</li>
</ul>
<p class="has-line-data" data-line-start="76" data-line-end="77">These native modules can be integrated into the React Native project using the react-native-ble-plx library’s native code as a reference.</p>
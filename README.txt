BUDDIE AI — LOCAL APP FOLDER
=============================

This folder is a self-contained way to run your Buddie AI app.
Nothing is uploaded anywhere — everything runs on your own
device.

WHAT'S INSIDE
-------------
- index.html         → the Buddie AI app itself
- server.py           → a tiny local web server that serves the app
- Start Buddie AI (Windows).bat            → double-click on Windows
- Start Buddie AI (Mac-Linux).command      → double-click on Mac/Linux
- Start Buddie AI (Android-Termux).sh      → run from Termux on Android


===========================================
ANDROID TABLET — SET UP (single-tap app icon, no Termux)
===========================================
This folder is now a real installable web app (a "PWA"). Once it's
hosted at a normal https:// address, Chrome can install it as a
home-screen icon that opens full-screen, no browser bar, no
terminal, no Termux, no commands to type — ever again.

The only one-time step is putting the folder somewhere with an
https address, because Android/Chrome won't let a page save data
or install as an app from a plain file. This takes about 2 minutes:

1. On any computer (or the tablet itself), go to:
     https://app.netlify.com/drop
   No account needed for this part.

2. Drag the whole BuddieAI folder onto that page (or drag the
   BuddieAI.zip and let it unpack — either works).

3. Netlify instantly gives you a live web address, something like:
     https://random-name-123.netlify.app
   That's it — the app is now hosted and reachable over https.

4. (Recommended) Click "Claim this site" / sign up free (email,
   Google, or GitHub) so the address doesn't expire. Without
   claiming, unclaimed drops can get cleaned up after a while.

5. On the Android tablet, open that address in Chrome. You should
   see a small "Install app" banner or icon appear in the address
   bar — tap it. (If you don't see it: tap the ⋮ menu → "Add to
   Home screen" / "Install app".)

6. Done. Buddie AI now has a real icon on your home screen. Tapping
   it opens the app full-screen like any other app — no Termux, no
   server to start, nothing to type.

Everything you cared about is unchanged: your chats, memory, and
the downloaded AI model still live only in the browser's storage on
your device — Netlify is just serving the static app files (the
same index.html in this folder), it never sees your conversations
or model data.

TROUBLESHOOTING (Android)
--------------------------
- No "Install app" prompt appears → tap the ⋮ menu in Chrome →
  "Add to Home screen" manually; it'll still create the icon.
- Want it fully private / not on Netlify's servers → GitHub Pages
  works the same way (also free, also just static hosting) if
  you'd rather use a GitHub account instead.
- Model loading is slow or fails → this is normal on some Android
  GPUs; check Settings → the WebGPU status line in the app itself
  will tell you if hardware acceleration is actually available on
  your tablet, and Settings also lets you pick a smaller model.
- Still want the old Termux/local-server method → the
  "Start Buddie AI (Android-Termux).sh" script and server.py are
  still in this folder and work exactly as before.


===========================================
WINDOWS / MAC / LINUX (computer) SET UP
===========================================
1. Make sure Python 3 is installed on your computer.
   - Windows: get it from https://www.python.org/downloads/
     and tick "Add Python to PATH" during install.
   - Mac: Python 3 is usually already installed. If not,
     https://www.python.org/downloads/ works there too.
   - Linux: almost always already installed (`python3 --version`
     to check).

2. Double-click the launcher for your system:
   - Windows → "Start Buddie AI (Windows).bat"
   - Mac/Linux → "Start Buddie AI (Mac-Linux).command"
     (On Mac, if it opens in a text editor instead of running,
     right-click it → Open With → Terminal, once. After that,
     double-click works normally.)

3. A terminal window will open and start a local server, and your
   default browser will automatically open the app at an address
   like http://localhost:8743/

4. To stop the app, close the terminal window (or press Ctrl+C
   inside it).


WHY A SERVER AT ALL, INSTEAD OF JUST OPENING index.html?
----------------------------------------------------------
Buddie AI needs two browser features to work properly:
- IndexedDB / Cache Storage, to save your chats, memory, and the
  downloaded AI model so it doesn't re-download every time.
- ES module script loading, to load its local-AI library.

Browsers disable both of those for files opened directly
(file:// addresses) as a security measure. Running the included
tiny local server (server.py) makes the app load at a normal
http://localhost address instead, which browsers treat like any
other website — so saving and loading work correctly. The server
only serves files from this folder to your own device; it does
not expose anything to the internet or other devices.

MOVING OR SHARING THIS FOLDER
------------------------------
The whole folder is portable — copy it to a USB drive, another
computer, or your tablet, and it will still work the same way, as
long as Python is installed there too (or Termux, on Android).

NOTE ON INTERNET ACCESS
------------------------
This app itself still needs an internet connection the first time
it downloads its local AI model (that part of the app was already
built that way, using the WebLLM library from a CDN) and for any
web search you configure it to use. Everything else — your chats,
memory, and settings — is stored only on your device.


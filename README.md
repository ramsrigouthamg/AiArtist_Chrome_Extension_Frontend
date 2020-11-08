This is the frontend code for AiArtist Chrome Extension version 3.

AiArtist chrome extension link -
https://chrome.google.com/webstore/detail/aiartist/odfcplkplkaoehpnclejafhhodpmjjmk

The code needs to be compiled with the below instructions to generate the production folder that is zipped and uploaded to the chrome store.

For easeness, I am also including the final zip file that I uploaded to the chrome extension store.

It is named as "AiArtist deployed package to chrome extension store.zip"

## Build

Install the required dependencies with `npm`. You can get `npm` from Node's website. Make sure in the project root directory. Use `npm install` command to install the required dependencies. The following commands can be used for building and development.

* `npm run watch`: Builds the extension and runs it in watch mode.
* `npm run clean`: Cleans out the `dist` directory.
* `npm run dev-build`: Builds the extension in development mode.
* `npm run build`: Builds the extension in production mode.
* `npm run pack`: Builds the extension in production mode and zips the source code which can be found in the project root.

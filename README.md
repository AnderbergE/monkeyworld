# Monkey World #

HTML5 canvas game written in JavaScript, using KineticJS.

## Build ##
There are two options to build the game for use in a web browser:

1.  Include all source files in the header of a HTML file. The bash script `build_html.sh` will do so with the files in the correct order. Run `./build_html.sh` in the root folder of the project. If you don't have access to bash, you simply will have to alter the HTML files yourself (until an ant task has been written for this purpose).
2.  It is possible, but not needed, to compile the project using Google Closure for Ant. Simply run `ant` in the root folder of the project.

## Run ##
After building, the uncompiled version (build alternative 1) can be run by running `src/tmp.html` or `src/index_uncompiled.html` in a HTML5 compatible web browser. The compiled version (build alternative 2) is run by using `html/index.html` in the same way.


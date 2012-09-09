# Monkey World #

HTML5 canvas game written in JavaScript, using KineticJS.

## Build ##
There are two options to build the game for use in a web browser:

1.  Include all source files in the header of a HTML file. This can be done automatically and in the correct order by using a custom built ant task. For this project, run `ant` or `ant uncompiled` in the root folder of the project. The result will be in the folder `build_uncompiled`. This is easiest and recommended for ordinary development.
2.  It is possible, but not needed, to compile the project using Google Closure for Ant. Run `ant compile` in the root folder of the project. The result will be in the folder `build`.

## Run ##
After building, the uncompiled version (build alternative 1) can be run by running `build_uncompiled/index.html` in a HTML5 compatible web browser. The compiled version (build alternative 2) is run by using `build/index.html` in the same way.


## Additional documentation ##
 * [Documentation for adding minigames](https://github.com/qtoden/monkeyworld/tree/master/src/model/Minigames)
 

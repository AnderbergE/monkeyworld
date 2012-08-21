#!/bin/bash
cd src
echo "<!DOCTYPE html>
<html lang=\"en\">
<head>
<meta charset=\"utf-8\">
<link href='http://fonts.googleapis.com/css?family=Gloria+Hallelujah' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Short+Stack' rel='stylesheet' type='text/css'>
<script type=\"text/javascript\" src=\"../lib/jquery-1.7.2.min.js\"></script>
<script type=\"text/javascript\" src=\"../lib/jquery.cookie.js\"></script>

<script type=\"text/javascript\" src=\"../lib/preloadjs-0.1.0.min.js\"></script>
<script type=\"text/javascript\" src=\"../lib/soundjs/soundjs-0.2.0.min.js\"></script>
<script type=\"text/javascript\" src=\"../lib/kineticjs/kinetic-v3.10.3.min.js\"></script>
<script type=\"text/javascript\" src=\"../lib/tweenjs/easel.js\"></script>
<script type=\"text/javascript\" src=\"../lib/tweenjs/Timeline.js\"></script>
<script type=\"text/javascript\" src=\"../lib/tweenjs/tween.js\"></script>" > tmp.html
echo "<script type=\"text/javascript\" src=\"MW.js\"></script>" >> tmp.html
echo "<script type=\"text/javascript\" src=\"EventManager.js\"></script>" >> tmp.html
echo "<script type=\"text/javascript\" src=\"Module.js\"></script>" >> tmp.html
for file in `find -type f -not -name "MW.js" -not -name "EventManager.js" -not -name "Module.js" -name "*.js"`; do
	echo "<script type=\"text/javascript\" src=\"" >> tmp.html
    echo "$file" >> tmp.html
    echo "\"></script>" >> tmp.html
done

echo "
<link rel=\"stylesheet\" href=\"html/style.css\" type=\"text/css\" />

<title>Monkey World</title>


</style>
</head><body>
<div id=\"wrapper\">
<div id=\"settings-panel\"></div>

<div id=\"container\"></div></div></body>
</html>" >> tmp.html
cd ..

<!DOCTYPE html>
<html lang="en-US" notInited>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="Sssnake">
	<meta name="color-scheme" content="light dark">
	<title>Sssnake</title>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg">
	<link rel="alternate icon" href="/favicon.ico">
	<link rel="apple-touch-icon" sizes="180x180" href="/favicon-apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/favicon-site.webmanifest">
	<link rel="mask-icon" href="/favicon-safari-pinned-tab.svg" color="#000000">
	<link rel="stylesheet" media="screen" href="<?= getfile("css/snake.css") ?>">
</head>

<body>
	<div class="content">
		<div id="board"></div>
		<div class="info">
			<div><span>Time</span><span id="time"></span></div>
			<div><span>Length</span><span id="score"></span></div>
			<div><span>Max length</span><span id="max-score"></span></div>
			<div><span>Speed</span><span class="percent"><span id="speed"></span></span></div>
			<!-- <div><span>Moves</span><span id="moves"></span></div> -->
			<div><span>Energy</span><span class="percent"><span id="energy"></span></span></div>
		</div>
	</div>
	<script src="<?= getfile("js/snake.js"); ?>"></script>
</body>
<?
	error_reporting(E_ALL);
	ini_set('display_errors', '1');

	$isPronto = (isset($_GET["pronto"]) && $_GET["pronto"] == "true");

	ob_start();

	$page_title = "About Page &middot; Pronto Demo";

	// Only output on full page loads
	if (!$isPronto) {
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

		<title><?=$page_title?></title>

		<!-- Modernizer -->
		<script src="http://formstone.it/js/modernizr.js"></script>

		<!-- Demo Resources -->
		<link href="http://formstone.it/css/demo.css" rel="stylesheet" type="text/css" media="all">
		<script src="http://formstone.it/js/demo.js"></script>

		<!--[if IE 8]>
        	<script>var IE8 = true;</script>
        	<script src="http://formstone.it/js/site.ie8.js"></script>
			<link rel="stylesheet" href="http://formstone.it/css/demo.ie8.css">
		<![endif]-->
		<!--[if IE 9]>
        	<script>var IE9 = true;</script>
        	<script src="http://formstone.it/js/site.ie9.js"></script>
		<![endif]-->

		<script src="../jquery.fs.pronto.js"></script>
		<script src="js/main.js"></script>
	</head>
	<body class="gridlock demo">
		<header id="header">
			<div class="row">
				<div class="all-full">
					<a href="http://formstone.it/" class="branding no-pronto">Formstone</a>
				</div>
			</div>
		</header>
		<article class="row page">
			<div class="mobile-full tablet-full desktop-8 desktop-push-2">
				<header class="header">
					<h1>Pronto Demo</h1>
					<!-- <p>A technical demonstration of the jQuery plugin.</p> -->
					<br />
					<a href="http://formstone.it/pronto/" class="button no-pronto">View Documentation</a>
				</header>
				<nav>
					<a href="index.php">Home</a>
					<a href="about.php">About</a>
				</nav>
				<div id="pronto">
<?
	}
	// END: Only output on full page loads
?>

					<?
						// Always output
						if ($isPronto) {
							// If pronto request, save content to buffer
							ob_start();
						}
					?>
					<h2>About Page</h2>
					<p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Aenean lacinia bibendum nulla sed consectetur. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Vestibulum id ligula porta felis euismod semper.</p>
					<p>Curabitur blandit tempus porttitor. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Sed posuere consectetur est at lobortis. Maecenas faucibus mollis interdum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</p>
					<p>Cras mattis consectetur purus sit amet fermentum. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Aenean lacinia bibendum nulla sed consectetur.</p>
					<p>Curabitur blandit tempus porttitor. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
					<?
						if ($isPronto) {
							// If pronto request, return json object with page pieces
							$page_content = ob_get_clean();
							echo json_encode(array(
								"title" => $page_title,
								"content" => $page_content
							));
						}
						// END: Always output
					?>

<?
	// Only output on full page loads
	if (!$isPronto) {
?>
				</div>
			</div>
		</article>

		<footer id="footer" class="row">
			<div class="all-full copyright">
				Made with &hearts; in Hampden
			</div>
		</footer>
	</body>
</html>
<?
	}
	// END: Only output on full page loads

	$size = ob_get_length();
	$content = ob_get_clean();

	header("Content-length: " . $size);
	die($content);

?>
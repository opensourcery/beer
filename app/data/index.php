<?php
/**
 * @file
 *   A pass-through API handler to the kegerator.
 */

require_once 'vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;

$request = Request::createFromGlobals();
$routes = require __DIR__ . '/src/app.php';

$framework = new OpenSourcery\Beer\Framework($routes);

$framework->handle($request)->send();

<?php
/**
 * @file
 *   Routes for OpenSourcery::Beer.
 */
use Symfony\Component\Routing\RouteCollection;

namespace OpenSourcery;

use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

$routes = new RouteCollection();

$routes->add('kegs.json', new Route('/data/kegs.json'));

return $routes;

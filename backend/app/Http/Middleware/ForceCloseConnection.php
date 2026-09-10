<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceCloseConnection
{
    /**
     * Handle an incoming request and close HTTP connection to avoid keep-alive locks on single-threaded servers.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $response->headers->set('Connection', 'close');
        return $response;
    }
}

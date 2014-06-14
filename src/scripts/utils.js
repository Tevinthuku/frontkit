!function( ng ) {
    "use strict";

    var $ = ng.element;
    var module = ng.module( "frontkit.utils", [] );

    module.constant( "keycodes", {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        PGUP: 33,
        PGDOWN: 34,
        ARROWLEFT: 37,
        ARROWUP: 38,
        ARROWRIGHT: 39,
        ARROWDOWN: 40
    });

    module.config([
        "$provide",
        function( $provide ) {
            var isExpr = function( expr ) {
                return typeof expr === "string" || ng.isFunction( expr );
            };

            $provide.decorator( "$rootScope", function( $delegate ) {
                $delegate.$safeApply = function( scope, expr ) {
                    var parent;

                    if ( isExpr( scope ) ) {
                        expr = scope;
                        scope = $delegate;
                    }

                    scope = scope || $delegate;

                    // Eval the expression
                    if ( isExpr( expr ) ) {
                        scope.$eval( expr );
                    }

                    // Find out if one of the parent scopes is in a phase
                    parent = scope;
                    while ( parent ) {
                        if ( parent.$$phase ) {
                            return;
                        }

                        parent = parent.$parent;
                    }

                    // Finally apply if no parent scope is in a phase
                    scope.$apply();
                };

                return $delegate;
            });
        }
    ]);

    module.factory( "$$safeApply", [
        "$rootScope",
        function( $rootScope ) {
            var apply = function( scope ) {
                scope = scope || $rootScope;
                !$rootScope.$$phase && scope.$apply();
            };

            return function( scope, fn ) {
                // If a function was passed, everytime it's called a digest will be triggered.
                if ( ng.isFunction( fn ) ) {
                    return function() {
                        var ret = fn.apply( this, arguments );
                        apply( scope );

                        return ret;
                    };
                }

                // If no function, simply trigger a digest now.
                apply( scope );
            };
        }
    ]);

    // Extensions to jQLite
    $.prototype.querySelector = function( str ) {
        return $( this[ 0 ].querySelector( str ) );
    };

    $.prototype.querySelectorAll = function( str ) {
        return $( this[ 0 ].querySelectorAll( str ) );
    };

}( angular );
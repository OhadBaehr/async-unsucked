/**
 * Make it possible to get sub-properties from Promise objects using Proxies.
 */
declare function async(p: Promise<any>): typeof Proxy | object;
declare namespace async {
    /**
    * Wraps the return value of a function with async().
    */
    var wrap: (func: Function) => Function;

    
    /**
    * Same as Promise.all but supports objects aswell.
    */
    var all: (promises: Promise[]) => object | any[];

    /**
    * Same as Promise.allSettled but supports objects aswell.
    */
     var allSettled: (promises: Promise[]) => object | any[];


    /**
    * Same as Promise.race but supports objects aswell.
    */
    var race: (promises: Promise[]) => any;

    /**
    * Map async iterator.
    */
    var map: (arr: Promise[], callback: Function) => any[];
}

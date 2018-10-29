
var appCacheName = "myRRApp-v";
var cacheNameConst = "myRRApp-v";
/**

 Intercept fetch requests*/

self.addEventListener('fetch', function (event) {

    event.respondWith(
        caches.match(event.request).then(function (response) {

            if (response) return response;
            return fetch(event.request).then(function (response) {
                caches.open('myRRApp-Image').then(function (cache) { return cache.add(event.request.url); })
            });


        })

    )
}
);


/*

Check if SW is installing ?

*/
self.addEventListener('install', function (event) {
    var d = new Date();
    appCacheName = appCacheName + d.getTime();
    console.log("appCacheName :: "+appCacheName);

    event.waitUntil(
        
        caches.open(appCacheName).then(function (cache) {
            return cache.addAll(
                ['js/main.js', 'js/dbhelper.js', 'js/restaurant_info.js', 'data/restaurants.json', 'css/styles.css', 'index.html', 'restaurant.html', '/']);

        })


    );

});


self.addEventListener('activate', function (event) {

    event.waitUntil(
        caches.keys().then(function (cachenames) {
            return Promise.all(

                cachenames.filter(function (cacheName) {

                    return cacheName.startsWith(cacheNameConst) && cacheName != appCacheName

                }).map(function (cName) {
                    return caches.delete(cName);


                })
            );
            
        })

    );


});


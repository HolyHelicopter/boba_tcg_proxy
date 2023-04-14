chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.action === 'httpRequest') {
            axios[request.method ? request.method : 'get'](
                request.url, request.params
            ).then(function (res) {
                sendResponse({
                    $result: res
                });
            }).catch(function (err) {
                sendResponse({
                    $error: err
                });
            });
        }
    }
);

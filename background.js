chrome.runtime.onInstalled.addListener(function() {
    chrome.permissions.request({
      permissions: ['desktopCapture', 'videoCapture']
    }, function(granted) {
      if (granted) {
        console.log('Autorisations accordées');
      } else {
        console.log('Autorisations refusées');
      }
    });
});
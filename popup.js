var recorder;

document.getElementById('startButton').addEventListener('click', function() {
  chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], function(streamId) {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: streamId,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    })
    .then(function(s) {
      stream = s;
      recorder = RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
        disableLogs: true
      });
      recorder.startRecording();
      var video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      document.body.appendChild(video);
      document.getElementById('startButton').setAttribute('disabled', '');
      document.getElementById('stopButton').removeAttribute('disabled');
    })
    .catch(function(error) {
      console.log(error);
    });
  });
});

document.getElementById('stopButton').addEventListener('click', function() {
    recorder.stopRecording(function() {
      var blob = recorder.getBlob();
      var url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: 'capture-video.webm'
      });
    });
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
    document.getElementById('startButton').removeAttribute('disabled');
    document.getElementById('stopButton').setAttribute('disabled', '');
    document.body.removeChild(document.querySelector('video'));
  });
  
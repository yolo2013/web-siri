/**
 * 录音处理
 * @author: xuhua@iflytek.com
 */
(function() {

  var siri = new jSiri();

  var appWidth = 24;
  var appHeight = 24;
  var flashvars = {
    'upload_image': 'images/upload.png'
  };
  var params = {};
  var attributes = {
    'id': "recorderApp",
    'name': "recorderApp"
  };
  swfobject.embedSWF('recorder.swf', "flashcontent", appWidth, appHeight, "11.0.0", "", flashvars, params, attributes);

  window.fwr_event_handler = function fwr_event_handler() {
    var name, $controls;
    switch (arguments[0]) {
      // 准备完成
      case "ready":
        var width = parseInt(arguments[1]);
        var height = parseInt(arguments[2]);
        FWRecorder.uploadFormId = "#upload_form";
        FWRecorder.uploadFieldName = "upload_file";
        FWRecorder.connect("recorderApp", 0);
        FWRecorder.recorderOriginalWidth = width;
        FWRecorder.recorderOriginalHeight = height;
        break;
        // 没有麦克风设备
      case "no_microphone_found":
        alert('没有麦克风设备');
        break;

        // 麦克风权限被拒绝
      case "microphone_user_request":
        alert('麦克风权限被阻止');
        FWRecorder.showPermissionWindow();
        break;

        // 麦克风连接
      case "microphone_connected":
        FWRecorder.isReady = true;
        break;
        // 用户关闭权限控制弹窗
      case "permission_panel_closed":
        FWRecorder.defaultSize();
        break;

      case "microphone_activity":
        break;

        // 开始录音
      case "recording":
        FWRecorder.hide();
        FWRecorder.observeLevel();
        break;

      case "recording_stopped":
        FWRecorder.show();
        FWRecorder.stopObservingLevel();
        // 停止后立刻降低波形波动
        siri.updateData(0);
        siri.updateData(0);
        siri.updateData(0);
        siri.updateData(0);
        siri.updateData(0);
        siri.updateData(0);
        break;

      // 波动变化
      case "microphone_level":
        siri.updateData(arguments[1] * 50);
        break;

      case "observing_level":
        break;

      case "observing_level_stopped":
        break;

      case "playing":
        name = arguments[1];
        break;

      case "playback_started":
        name = arguments[1];
        break;

      case "stopped":
        name = arguments[1];
        break;

      // 暂停回放
      case "playing_paused":
        name = arguments[1];
        break;

      case "save_pressed":
        FWRecorder.updateForm();
        break;

      case "saving":
        name = arguments[1];
        break;

      case "saved":
        name = arguments[1];
        break;

      case "save_failed":
        name = arguments[1];
        break;

      case "save_progress":
        name = arguments[1];
        break;
    }
  };
})();
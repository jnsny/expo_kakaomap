var uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

(() => {
    try {
    //   if (!window.ReactNativeWebView) {
    //     throw new Error('window 객체에 ReactNativeWebView가 존재하지 않습니다.')
    //   }
    } catch (err) {
      console.error(err);
      return;
    }

    const getUniqId = () => {
      return uuidv4();
    };
  
    // 전역 스코프 window 객체에 __WEBVIEW_BRIDGE__ 객체 추가
    window.__WEBVIEW_BRIDGE__ = {
      /*
        key: getUniqId 함수로부터 생성된 고유 id
        value: 콜백함수
      */
      callbacks: {},

      /* 네이티브앱에서 전달한 message를 받기위해 document에 이벤트 리스너 등록 */
      init: function() {
        console.log("init 실행");
        try {
          // IOS
          window.addEventListener("message", this.receive.bind(this));
          // Android
          document.addEventListener("message", this.receive.bind(this));
        } catch (err) {
          console.error(err);
        }
      },

      /*
        네이티브앱에서 전달 받은 데이터 파싱
        콜백함수 호출
      */
      receive: function(e) {
        console.log("receive 실행");
        const result = JSON.parse(e.data);
        let data = result.data;
        let id = result.id;

        try {
          if (!Object.keys(this.callbacks).find(k => k === id)) {
            throw new Error(`${id}에 해당하는 콜백함수가 존재하지 않습니다.`);
          }
        } catch (err) {
          alert(err);
          console.error(err);
          return;
        }
  
        this.callbacks[id](data);
      },

      /*
        네이티브앱으로 전달

        name: 함수명
        data: 네이티브앱으로 전달할 데이터
        callback: 전달할 message의 콜백함수
      */
      send: async function(name, data = {}, callback) {
        console.log("send 실행");
        try {
          if (!name) {
            throw new Error("인터페이스 이름이 존재하지 않습니다.");
          }
        } catch (err) {
          console.error(err);
          return;
        }

        const message = {
          id: getUniqId(),
          name,
          data: data || {}
        };
  
        // message.id를 callbacks 프로퍼티 키로 구성, 3번째 인자로 전달받은 콜백함수를 그 값으로 추가
        this.callbacks[message.id] = callback;
  
        // 네이티브앱으로 전달
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      }
    };
  
    window.__WEBVIEW_BRIDGE__.init();
  })();

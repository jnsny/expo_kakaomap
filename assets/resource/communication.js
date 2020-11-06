function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

( () => {
    try {
        console.log('헤헿');
    } catch (err) {
        console.log(err);
        return;
    }

    const getUniqId = () => {
        return uuidv4();
    };

    console.log(getUniqId());

    window.__WEBVIEW_BRIDGE__ = {
        // 우리가 요청한 함수의 리턴으로 의도한 값들을 전달받기 위해서 고유한 식별자와 고유한 콜백함수가 필요 => callbacks 객체를 활용하여 관리
        callbacks: {},
        
        init: function() {
            console.log("init 실행");
            try {
                /*
                    앱에서 전달한 메세지를 웹뷰가 받기 위해 document에 message 이벤트 리스너를 등록
                    message 이벤트 핸들러로 receive 메서드 사용
                    receive 메서드에서 this를 __WEBVIEW_BRIDGE__ 객체로 지정하기위해 bind 구문 활용
                    (this를 binding 하지않으면 자동으로 DOM객체가 this로 binding)
                */
                document.addEventListener("message", 
                    function(event) { console.log('ddd'); }
                );
            } catch(err) {
                console.log(err);
            }
        },

        // 리액트 네이티브 앱에서 전달받은 데이터 파싱 => 전달 받은 데이터에 포함된 고유키인 id와 매칭되는 콜백함수를 전달 받은 데이터와 함께 실행
        receive: function(e) {
            console.log("receive 펑션 실행");
            const { name, data, id } = JSON.parse(e.data);

            try {
                if(! Object.keys(this.callbacks).find(k => k === id)) {
                    throw new Error(`${id}에 해당하는 콜백함수가 존재하지 않습니다.`);
                }
            } catch(err) {
                alert(err);
                console.log(err);
                return;
            }

            this.callbacks[id](data);
        },

        /*
            name: 함수의 이름
            data: 앱으로 전달할 데이터
            callback: 전달할 메세지의 고유한 콜백함수
        */
        send: async function(name, data = {}, callback) {
            try {
                if(! name) {
                    throw new Error("인터페이스 이름이 존재하지 않습니다.");
                }
            } catch(err) {
                console.log(err);
                return;
            }

            const message = {
                id: getUniqId(),
                name,
                data: data || {}
            };

            this.callbacks[message.id] = callback;

            // RN 앱으로 message 전달
            ReactNativeWebView.postMessage(JSON.stringify(message));
        }
    };

    window.__WEBVIEW_BRIDGE__.init();

} )();

function getGeolocationPosition({ lat, lng }) {

}

window.__WEBVIEW_BRIDGE__.send(
    "getGeolocationPosition",
    {},
    getGeolocationPosition
);
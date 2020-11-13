        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
        };
        var map = new kakao.maps.Map(container, options);

        // ----- 마커 생성 -----
        // 마커가 표시될 위치

        function setCenter(lat, lng) {
            this.map.setCenter(new kakao.maps.LatLng(lat, lng));
        }

        function setMarker(lat, lng) {
            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng)
            });
            
            marker.setMap(map);
        }

        function getGeolocationPosition({ lat, lng }) {
            console.log("getGeolocationPosition 펑션 실행");
            console.log(lat, lng);

            this.map.setCenter(new kakao.maps.LatLng(lat, lng));

            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng)
            });
            
            marker.setMap(map);

            // setCenter(lat, lng);
            // setMarker(lat, lng);
        }

        window.__WEBVIEW_BRIDGE__.send(
            "getGeolocationPosition",
            {},
            getGeolocationPosition
        );

        var markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);

        // 마커를 생성
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        // 마커가 지도 위에 표시되도록 설정
        marker.setMap(map);

        // 지도 위의 마커를 제거
        // marker.setMap(null);


        // ----- 선 생성 -----
        // 선을 구성하는 좌표 배열 (이 좌표들을 이어서 선을 표시)
        var linePath = [
            new kakao.maps.LatLng(33.452344169439975, 126.56878163224233),
            new kakao.maps.LatLng(33.452739313807456, 126.5709308145358),
            new kakao.maps.LatLng(33.45178067090639, 126.5726886938753)
        ];

        // 지도에 표시할 선을 생성
        var polyline = new kakao.maps.Polyline({
            path: linePath,             // 선을 구성하는 좌표배열
            strokeWeight: 7,            // 선의 두께
            strokeColor: '#F267B2',     // 선의 색깔
            strokeOpacity: 1,           // 선의 불투명도 (1에서 0 사이의 값이며 0에 가까울수록 투명)
            strokeStyle: 'solid'        // 선의 스타일
        });

        // 지도에 선을 표시
        polyline.setMap(map);
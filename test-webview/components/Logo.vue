<template>
  <div ref="map" style="width:100vw;height:100vh;"></div>
</template>

<script>
export default {
  head() {
    return {
      script: [
        {
          src: `//dapi.kakao.com/v2/maps/sdk.js?appkey=a74f3d22ad166a1a2ba129fa95162066&libraries=clusterer`,
        },
      ],
    };
  },
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.load();
      window.__WEBVIEW_BRIDGE__.send(
        "getGeolocationPosition",
        {},
        this.getGeolocationPosition
      );
    });
  },
  methods: {
    getGeolocationPosition({ lat, lng }) {
      this.setCenter(lat, lng);
      this.setMarker(lat, lng);
      this.setLine(lat, lng);
    },
    setCenter(lat, lng) {
      // 지도 중심을 이동
      this.map.setCenter(new kakao.maps.LatLng(lat, lng));
    },
    setMarker(lat, lng) {
      // 마커를 생성
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
      });

      // 마커가 지도 위에 표시되도록 설정
      marker.setMap(this.map);
    },
    setLine() {
      // 선을 구성하는 좌표 배열
      const linePath = [
        new kakao.maps.LatLng(33.452344169439975, 126.56878163224233),
        new kakao.maps.LatLng(33.452739313807456, 126.5709308145358),
        new kakao.maps.LatLng(33.45178067090639, 126.5726886938753)
      ];

      // 지도에 표시할 선을 생성
      const polyline = new kakao.maps.Polyline({
        path: linePath,             // 선을 구성하는 좌표배열
        strokeWeight: 7,            // 선의 두께
        strokeColor: '#F267B2',     // 선의 색깔
        strokeOpacity: 1,           // 선의 불투명도 (1에서 0 사이의 값이며 0에 가까울수록 투명)
        strokeStyle: 'solid'        // 선의 스타일
      });

      // 지도에 선을 표시
      polyline.setMap(this.map);
    },
    load() {
      const container = this.$refs["map"];

      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      this.map = new kakao.maps.Map(container, options);

      this.setLine();
    },
  },
};
</script>

<style>
</style>
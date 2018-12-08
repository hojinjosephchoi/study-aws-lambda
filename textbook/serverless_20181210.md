# 6장 요약 - Lambda

## Lambda 호출 케이스
- AWS에서 발생된 이벤트
- API Gateway를 통한 HTTP요청
- AWS SDK를 사용한 Invoked
- AWS 콘솔을 통한 수동 사용자 호출 (테스트?)

## Lambda 호출 유형
- Event: 비동기방식, 응답을 이벤트 소스로 다시 보내지 않아도 됨
- RequestResponse: API Gateway, AWS 콘솔 호출, CLI 호출 등, 함수를 동기방식으로 실행하고 호출자에게 응답 반환
- SDK/CLI 통한 람다 호출 시 Event / RequestResponse 호출 사용여부 선택 가능

## [Push, Pull](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/intro-invocation-modes.html)
- 스트리밍 이벤트 소스(DynamoDB Streams, Kinesis Streams)를 폴링하고 필요할 때 함수 호출
- 풀 모델 사용 시 관련 __AWS Lambda API를 사용해 이벤트 소스 매핑__ 을 만들어 AWS Lambda에서 매핑을 유지관리할 수 있다.
- 푸시모델 사용시 이벤트 원본에서 매핑이 유지, 이벤트 원본에서 제공하는 API를 사용해 매핑 유지관리

## 동시 실행
- 한 리전 내 모든 함수에 대해 100개로 동시 실행 제한
- 잠재적 폭주(recursive)로 인한 비용으로부터 개발자 보호 명목...
- 상향요청 가능
- 스트림기반 이벤트 소스 함수호출 동시성 == 활성화된 샤드의 수
- 비스트림기반 이벤트 소스 동시호출수 == 초당 이벤트(또는 요청) x 함수 실행기간
- 함수호출 제한 걸리고, 동기 방식으로 계속 호출 시도 시 429 오류 응답

## 컨테이너 재사용
- Cold Start
- Warm Start
- Freeze - 함수 실행이 끝나면 백그라운드 프로세스 freeze (동결))
- thaw - 다음번 람다 호출 시 백그라운드 프로세스 thaw (해동)

## 별칭 만들 때
- 할당하는 가중치(%)에 따라 두 버전 간 트래픽이 가능합니다 => A/B테스트 가능하지 않을까???


# 7장 요약 - API Gateway
## 특징
- Client Apps <-> Backend services 간 I/F 역할
- AWS 서비스와 통합
    - HTTP Proxy - 타 HTTP 엔드포인트 연결
    - AWS Service Proxy - Lambda가 아닌 다른 AWS 서비스 호출
    - Mock Integration - API Gateway에서 직접 응답생성
- 캐싱, 스로틀링, 로깅
- 스테이징, 버전관리
- 스크립팅 (API 정의를 Swagger를 사용해 스크립팅 가능)

## Resource
### Proxy Resource
- 부모리소스에 속해있는 어떤 자식 리소스라도 표현 가능
- 탐욕적(greedy) 경로변수: `/video/{proxy+}`
- proxy resource 구성 시 http method는 any로 설정 (어떤 http method이건 접근 가능)

### CORS
- Resource 생성 시 Enable API Gateway CORS 옵션 선택 가능
- CORS 옵션 적용 시 http OPTIONS 메소드 생성됨

### Lambda Proxy Integration
- 모든 요청을 JSON에 매핑하고 Lambda에 event 객체로 전달
- 람다 프록시 통합 옵션을 사용하지 않을 경우
    - API Gateway의 통합요청(Integration Request)에서 매핑 템플릿을 만들고 HTTP 요청을 직접 JSON에 매핑하는 방법을 결정해야 한다.
    - 정보를 클라이언트에 전달하려면 통합응답(Integration Response) 매핑을 만들어야 한다.
- 대부분 통합옵션을 사용하나, 세밀하게 페이로드를 제어하고 싶은 경우 수동매핑을 할 수 있다.
- Lambda 함수 내에서는 API Gateway가 처리할 수 있는 규정된 형식으로 응답을 만들어야 한다. 그렇지 않을 경우 502 Bad Gateway Error 처리됨
- [람다 프록시 통합](https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html)
- [502 에러 발생시 해결방안](https://aws.amazon.com/ko/premiumsupport/knowledge-center/malformed-502-api-gateway/)

### Lambda 오류반환 처리
- 의도하지 않은 에러 처리 시 `callback(error)` 형태로 호출
- 알고 있는 에러 처리 시 `callback(null, response)` 형태로 호출
- Lambda 관점에서 '알고있는 에러'는 실패가 아니기 때문에 정상적으로 return한다
- response 내 400, 500 등의 http status code로 클라이언트에게 에러상황을 알려줄 수 있다
- `callback(error)` 형태로 return될 경우, 클라이언트는 502에러를 받는다

## Gateway 최적화
### [스로틀링](https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/api-gateway-request-throttling.html)
- 요율 (rate): 초당 요청건 수
- 버스트 (burst): 최대 버킷 크기
- 계정 당 초당 요청수 10000개/버스트 5000개
- 스로틀링 기능으로 DoS(서비스거부공격 Denial of Service) 방지

### 로깅
- API Gateway 전체 설정 > CloudWatch 로그역할 ARN 설정
- API Gateway 특정 API > 스테이지 > 로그/추적 탭에서 로그 활성화

### 캐싱
- 캐시크기 0.5GB ~ 237GB
- 캐시크기 별 시간당 과금
- 캐싱 동작 확인방법 -> CloudWatch > CacheHitCount / CacheHitMiss 지표
- 사용자 정의 헤더, URL 경로 및 QueryString 기반의 응답을 캐시할 수 있다
- 클라이언트에서 request header 내 Cache-Control: max-age=0 을 포함해 특정 캐시항목을 무효화할 수 있다
- 캐시 무효화 요청에 대해 막으려면 invalidateCache 정책을 설정해야 한다

### 스테이지 변수
- 각 스테이지 별 변수 생성 가능 (환경변수처럼...)
- VTL 문법을 활용해서 Lambda함수이름 / HTTP통합URI 대신 사용가능
- `stageVariables.<variable_name>` 형태로 사용
```
Lambda Function: my-lambda-function:${stageVariables.functionAlias}
```

### 버전
- 날짜/시간 + 주석(배포 시 입력했을 경우) 형태의 배포 History 확인 가능
- 이전 배포 History로 변경(change deployment) 가능

# 궁금증
- 스로틀링 요율/버스트 개념
- 로깅 - 스테이지 -> 로그추적 -> CloudWatch 세부지표활성화 체크가 안된다
- api-gateway 로그 잘 출력되나?
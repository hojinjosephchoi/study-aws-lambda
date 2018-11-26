# 4장 요약 - 클라우드 설정
## 보안 모델 및 자격증명 관리
### IAM사용자 (서비스 계정)
- 액세스키 2가지 요소 - ACCESS_KEY_ID, SECRET_ACCESS_KEY
- 사용자 별 최대 2개 활성화 가능
- AWS 계정당 최대 5000개 생성 가능

### 임시보안 자격증명 (Temporary Security Credentials)
- IAM 사용자와 유사하게 작동
- 사전에 설정한 시간 후에 만료되도록 만들수 있으며, 동적으로 생성 가능

### 역할 생성
- 일정기간동안 사용자, 애플리케이션 또는 서비스가 맡을 수 있는 권한집합
- 필요한 리소스에 접근할 수 없는 사용자 또는 서비스에 권한을 부여하도록 설계
- 위임 - 특정 자원에 대한 접근을 허용하기 위한 제 3자에 대한 권한부여와 관련
- 연동 - FB, Google 등 외부자격증명공급자 또는 SAML2.0, AWS 지원하는 기업용 자격증명시스템 간 신뢰관계를 생성하는 프로세스

### 자원
- __자격증명기반__ 권한 - IAM사용자 또는 역할이 수행할 수 있는 것을 지정
- __자원기반__ 권한 - S3버킷 또는 SNS토픽과 같은 AWS자원에서 수행할 수 있는 것 또는 누가 그 자원에 접근할 수 있는지 지정
- S3, SNS, SQS, Glacier, OpsWorks, Lambda 등의 서비스만 자원기반 정책 제공

### 권한과 정책
- 최소접근권한 - 세분화되고 작업 완료에 필요한 권한만 지정
- 관리형 정책 - 사용자, 그룹, 역할에는 적용되지만 자원에는 적용되지 않음
  - AWS 생성/관리 정책
  - 고객관리형 정책
  - 버전관리 / 롤백 가능
- 인라인 정책 - 특정 사용자, 그룹, 역할에 직접 생성, 자원기반정책은 항상 인라인
- Principal (IAM 사용자, 계정, 서비스) - 자원기반정책에 공통적, 사용자/그룹 정책에는 사용안됨
- Statement ID - SNS와 같은 특정 AWS 서비스에서 필요
- Condition - 언제 정책을 적용해야 하는지 지정
  - 다중 조건 연산자, 단일 조건연산자 내 여러 키 - AND
  - 단일 조건연산자 내 하나의 키에 여러 값이 포함 - OR

## 로깅 / 경고
### CloudWatch
- AWS에서 실행되는 자원 및 서비스 모니터링
- 다양한 지표를 기반으로 경고 설정 및 자원 성능에 대한 통계 확인 가능

### CloudTrail
- API 호출을 기록하는 AWS서비스
- API 호출자의 신원, 소스 IP주소, 이벤트 등 기록
- S3 버킷에 있는 로그 파일에 저장
- page98. 활동내역 페이지 7일동안 -> 90일동안??

## 비용
### Lambda
- 1,000,000 요청 건 / 월 무료
- 400,000 GB 컴퓨팅 시간 = 1GB 메모리로 400,000 초 무료
- 1,000,000 요청 건 당 $0.20
> 한달 5,000,000 요청, 256MB 메모리, 매번 2초 실행 시
> (5,000,000 요청건 - 1,000,000 요청건) x $0.20 + (10,000,000초 x 256/1024 GB - 400,000 GB초) x $0.00001667

### API Gateway
- 1,000,000 건 API 호출 당 $3.50
- 송신한 처음 10TB 데이터에 대해 $0.09/GB
> 월별 5,000,000 요청건, 데이터 전송 100GB 시
> (5,000,000 요청건 x $3.5) + (100GB * $0.09)

# 5장 요약 - 인증과 권한
## 서버리스 환경에서의 인증
- 타사 자격증명 제공업체 (IDP, Identity Provider)
- 인증(Authentication), 권한(Authorization), 사용자 등록, 사용자 유효성 검증

## JWT
- 양측에 전송되는 클레임을 표현하는 간편하고 안전한 URL 방식
- json을 BASE64로 인코딩
- 인코딩 값을 JSON Web Signature(JWS)를 사용하여 디지털 서명
- 닷(.)을 기준으로 JSOE 헤더(JSON Object Signing and Encryption), JWT Claim Set(페이로드), Signature 로 구성

### JSOE
- 어떤 식으로 JWT 해석해야하는지 명시
- HS256 - HMAC SHA-256
- RS256 - RSA SHA-256

### JWT Claim Set
- 실데이터 들어가 있음
- verify한 다음 사용 가능

### Signature
- JSOE, Claim의 위변조를 방지하기 위한 서명
- encoded JSOE + encoded JWT Claim set -> 비밀키로 Hash
- 서버는 이 시그니처를 검증하여 페이로드에 실린 정보가 위변조되지 않았는지 체크

## API Gateway
- Use Lambda Proxy Integration 체크박스 : 모든 헤더, 쿼리 문자열, 본문을 포함한 HTTP 요청이 매핑되어 이벤트 객체를 통해 함수에서 자동으로 사용할 수 있게 된다.

### 사용자 정의 권한 모듈
- 컨텍스트와 토큰 전달
- JWT 토큰이 유효하다면 정책을 생성
- 토큰과 함께 정책 1시간동안 캐싱

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

# 궁금증
- bearer token???
- API Gateway 매핑 - Velocity Template Language (VTL)???
- page 142 사용자 정의 권한 모듈
  - identity token source : method.request.header.Authorization 어디서 알 수 있나? VTL?
  - lambda 매에서는 event.authorizationToken인데... 얘하고 identity token source하고 매핑되나?
- page 144 401에러 대신 500에러 발생하지 않나?
- 위임토큰(Delegation Tokens)??? SAML???


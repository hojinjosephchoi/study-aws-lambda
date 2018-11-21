# 1장 요약
## 서버리스 아키텍처 원칙
1. 컴퓨팅 서비스를 사용해 요구에 맞게 코드를 실행 (서버 없이)
2. 단일 목적의 상태 없는 함수를 작성
  - Single Responsibility Principle
3. Push based, Event driven 파이프라인을 설계
4. 더 두텁고 강한 프런트엔드를 만든다
5. 서드파티 서비스를 받아들인다

## 서버리스 장/단점
### 의사결정 요인
- 모든사람을 위한 것은 아님
- 서비스 레벨 (서비스 레벨 규약; Service Level Agreement SLA)
- 사용자 정의 (예. Lambda는 RAM 크기 수정이나 만료시간 변경 수준밖에 안된다)
- 벤더 종속성 (aka AWS노예)
- 분산화

### 서버리스를 사용할 때
- 서버는 그만
- 많은 용도
- 낮은 비용
- 적은 코드
- 확장성과 유연성

# 2장 요약
## 아키텍처
- 백엔드 컴퓨팅
- Legacy API Proxy
- 하이브리드 (serverless + ec2 instances)
- graphql
- 연결형 컴퓨팅 (compute-as-glue)
- 실시간 처리 (w/ Amazon Kinesis stream)

## 패턴
- 명령패턴 (graphql과 유사)
- 메시징 패턴 (sqs / kinesis 등 stream 데이터 기반)
- 우선순위 큐 패턴 (???)
- 팬아웃 패턴 (SNS 토픽 구독으로 다양한 처리를 하는 각각의 Lambda 동시 실행)
- 파이프 및 필터 패턴 (s3 + thumbnail)

# 3장 요약
## 24-Hours Video Service
- AWS Lambda
- Elastic Transcoder
- SNS

## Elastic Transcoder Presets
- [Elastic Transcoder Presets](https://docs.aws.amazon.com/elastictranscoder/latest/developerguide/system-presets.html)

## 궁금증
- [lambda.handler로 들어오는 event 형태에 대한 정의는 어디 있나?](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/invoking-lambda-function.html)
- [S3 CreateObject 일 경우 trigger 될 때 event 파라미터의 데이터 형태는?](https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html)
- [SNS로 들어올경우 S3 CreateObject 일 경우 trigger 될 때 event 파라미터의 데이터 형태는?](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/eventsources.html#eventsources-sns)
- SNS 토픽(주제) 정책 편집에서 Condition 해석 어떻게 해야 하나?? (어떤 의미인지 이해가 안간다)
```
"Condition": {
  "ArnLike": {
    "aws:SourceArn": "arn:aws:s3:::serverless-video-transcoded-hojin"
  }
}
```
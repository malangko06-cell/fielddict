import { supabase } from './supabase.js';

// ── Initial data ──────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  categories: [
    {
      id: 'cat-print',
      name: '인쇄/출판',
      stages: [
        {
          id: 'st-p1',
          name: '편집',
          words: [
            { id: 'w-p1', term: '누끼', definition: '그림 등의 필요한 형태만 도려내는 이미지 추출 작업' },
            { id: 'w-p2', term: '도비라', definition: '책의 내지와 내지 사이에 삽입되는 소제목 페이지' },
            { id: 'w-p3', term: '베다', definition: '남는 공간이 없도록 잉크를 100% 올리는 것, 농도나 명암없이 100% 잉크로 인쇄하는 부분' }
          ]
        },
        {
          id: 'st-p2',
          name: '인쇄/제본',
          words: [
            { id: 'w-p4', term: '하리꼬미(터잡기)', definition: '인쇄 전 인쇄면을 큰 용지에 배치하는 작업' },
            { id: 'w-p5', term: '베라제본', definition: '낱장으로 된 인쇄물의 제본 방식. 주로 디지털 인쇄에서 사용된다. (ex. 캘린더)' },
            { id: 'w-p6', term: '돔보', definition: '4도(4COLOR)혹은 2색 이상 인쇄할 때, 각 색판의 가늠을 잡기 위해 삽입하는 인쇄판 짧은 변 중앙에 가늠용 표' }
          ]
        },
        {
          id: 'st-p3',
          name: '후가공',
          words: [
            { id: 'w-p7', term: '도무송', definition: '인쇄물에 칼선을 넣는 방식의 일종. 종이를 특정 모양으로 재단하는 것 (ex. 스티커)' },
            { id: 'w-p8', term: '싸바리', definition: '책의 표지 부분을 천이나 종이를 이용해 감싸서 단단하게 만드는 것' },
            { id: 'w-p9', term: '오시', definition: '접어야 하는 부분에 홈을 내는 후가공. 청첩장 쿠폰 초대장 접이식 명함 등에 사용' }
          ]
        }
      ]
    },
    {
      id: 'cat-arch',
      name: '건축/인테리어',
      stages: [
        {
          id: 'st-arch1', name: '철거',
          words: [
            { id: 'w-arch1', term: '석면조사', definition: '철거 전 건축 자재에 석면 함유 여부를 공인기관이 검사하는 절차. 석면 검출 시 별도 해체 공사 필요.' },
            { id: 'w-arch2', term: '가설공사', definition: '본 공사를 위해 임시로 설치하는 공사. 비계·가설 울타리·임시 전기 등이 해당.' },
            { id: 'w-arch3', term: '철거허가', definition: '연면적 500㎡ 이상 건물 철거 시 관할 구청에 제출하는 신고·허가 서류.' }
          ]
        },
        {
          id: 'st-arch2', name: '설비·배관',
          words: [
            { id: 'w-arch4', term: '급배수 배관', definition: '물을 공급(급수)하고 배출(배수)하는 배관 시스템. 소재에 따라 PVC·동관·스테인리스관으로 구분.' },
            { id: 'w-arch5', term: '냉매 배관', definition: '냉난방 시스템의 실내기와 실외기를 연결해 냉매를 순환시키는 동관.' },
            { id: 'w-arch6', term: '역류방지밸브', definition: '배관 내 유체가 역방향으로 흐르는 것을 막는 밸브. 오수·악취 역류 방지에 필수.' }
          ]
        },
        {
          id: 'st-arch3', name: '전기',
          words: [
            { id: 'w-arch7', term: '분전반', definition: '전력을 각 회로로 분배하는 배전 설비. 차단기(브레이커)가 모여 있으며 회로별 보호 기능을 담당.' },
            { id: 'w-arch8', term: '누전차단기(ELB)', definition: '전류 누설 감지 시 0.03초 내 자동 차단하는 안전 장치. 감전 및 화재 예방 목적.' },
            { id: 'w-arch9', term: '접지공사', definition: '전기 기기의 금속 외함을 땅에 연결해 누전 전류를 안전하게 흘려보내는 공사.' }
          ]
        },
        {
          id: 'st-arch4', name: '목공',
          words: [
            { id: 'w-arch10', term: '경량철골(LGS)', definition: '얇은 아연도금 강판을 성형한 구조재. 칸막이·천장 틀 등 비내력벽 시공에 널리 사용.' },
            { id: 'w-arch11', term: 'OSB 합판', definition: '나무 조각을 압축·접착한 구조용 합판. 내습성과 강도가 높아 벽체·바닥 하지재로 사용.' },
            { id: 'w-arch12', term: '몰딩', definition: '벽과 천장, 벽과 바닥의 경계부를 마감하는 장식재. 걸레받이(베이스보드)·천장 몰딩으로 구분.' }
          ]
        },
        {
          id: 'st-arch5', name: '타일·미장',
          words: [
            { id: 'w-arch13', term: '줄눈(그라우팅)', definition: '타일과 타일 사이 틈새를 전용 재료로 메우는 작업. 방수·오염 방지 기능과 심미적 역할을 동시에 담당.' },
            { id: 'w-arch14', term: '셀프레벨링', definition: '바닥 미장 시 자체 흐름으로 평탄면을 형성하는 특수 시멘트 재료. 수평 편차 보정에 활용.' },
            { id: 'w-arch15', term: '타설', definition: '콘크리트나 몰탈을 거푸집 또는 바닥에 붓고 다져 굳히는 작업.' }
          ]
        },
        {
          id: 'st-arch6', name: '도배·마루',
          words: [
            { id: 'w-arch16', term: '초배지', definition: '도배지를 바르기 전 벽면 요철을 잡고 접착력을 높이기 위해 먼저 붙이는 기초 종이.' },
            { id: 'w-arch17', term: '방습 필름(PE필름)', definition: '바닥 콘크리트 슬라브의 습기가 마루재로 전달되지 않도록 깔아주는 폴리에틸렌 시트.' },
            { id: 'w-arch18', term: '클릭 마루(Lock 방식)', definition: '본드·못 없이 혀와 홈을 맞물려 시공하는 조립식 마루. 교체·해체가 용이.' }
          ]
        },
        {
          id: 'st-arch7', name: '조명·가구',
          words: [
            { id: 'w-arch19', term: '색온도(K)', definition: '광원의 따뜻하고 차가운 정도를 나타내는 단위(켈빈). 2700K는 따뜻한 주황빛, 6500K는 차가운 흰빛.' },
            { id: 'w-arch20', term: '연색지수(CRI)', definition: '광원이 물체의 색을 얼마나 자연광에 가깝게 표현하는지 나타내는 수치. 100에 가까울수록 우수.' },
            { id: 'w-arch21', term: '붙박이장(빌트인)', definition: '건물 구조에 맞춰 벽면 틈새에 고정·제작하는 수납 가구. 공간 효율이 높고 이사 시 철거 비용 발생.' }
          ]
        }
      ]
    },
    {
      id: 'cat-law',
      name: '법률',
      stages: [
        {
          id: 'st-law1', name: '계약',
          words: [
            { id: 'w-law1', term: '청약과 승낙', definition: '계약 성립의 두 요소. 일방의 청약(계약 제안)에 상대방이 승낙해야 계약이 유효하게 성립.' },
            { id: 'w-law2', term: '위약금', definition: '계약 불이행 시 지급하기로 미리 약정한 손해배상액. 손해배상액 예정 또는 위약벌로 구분.' },
            { id: 'w-law3', term: '계약해제·해지', definition: '해제는 계약 소급 소멸(원상회복 의무 발생), 해지는 장래에 대해서만 효력 소멸. 계속적 계약에서 구분 중요.' }
          ]
        },
        {
          id: 'st-law2', name: '부동산',
          words: [
            { id: 'w-law4', term: '근저당권', definition: '채권 최고액을 한도로 장래의 불특정 채권을 담보하는 담보물권. 대출 시 은행이 설정하는 가장 일반적 담보 방식.' },
            { id: 'w-law5', term: '전세권', definition: '전세금을 지급하고 타인 부동산을 용도에 맞게 사용·수익할 수 있는 물권. 등기해야 대항력 발생.' },
            { id: 'w-law6', term: '등기부등본', definition: '부동산의 소유권·권리관계를 공시하는 공문서. 표제부·갑구(소유권)·을구(제한물권)로 구성.' }
          ]
        },
        {
          id: 'st-law3', name: '노동',
          words: [
            { id: 'w-law7', term: '포괄임금제', definition: '연장·야간·휴일 수당을 월급에 일괄 포함해 지급하는 임금 약정 방식. 남용 시 위법 판정 가능.' },
            { id: 'w-law8', term: '부당해고', definition: '정당한 이유나 절차 없이 근로자를 해고하는 행위. 노동위원회에 구제신청 가능, 복직 또는 금전보상 명령.' },
            { id: 'w-law9', term: '취업규칙', definition: '10인 이상 사업장에서 사용자가 작성하는 근로 조건 규정 문서. 근로자 과반수 동의 없이 불이익 변경 불가.' }
          ]
        },
        {
          id: 'st-law4', name: '소송·분쟁',
          words: [
            { id: 'w-law10', term: '소장', definition: '원고가 법원에 제출하는 소 제기 서면. 당사자·청구취지·청구원인을 기재하며 이로써 소송이 개시.' },
            { id: 'w-law11', term: '변론기일', definition: '법정에서 양 당사자가 주장·증거를 제출하고 판사가 심리하는 공개 기일.' },
            { id: 'w-law12', term: '강제집행', definition: '확정 판결 등 집행권원에 기해 국가가 강제력으로 채권자의 권리를 실현시키는 절차. 재산 압류·경매 등.' }
          ]
        },
        {
          id: 'st-law5', name: '상속·가족',
          words: [
            { id: 'w-law13', term: '법정상속분', definition: '유언 없이 사망 시 민법이 정한 상속 비율. 배우자 1.5, 자녀 각 1 등 관계에 따라 차등 배분.' },
            { id: 'w-law14', term: '유류분', definition: '유언에도 불구하고 상속인이 최소한 받을 수 있도록 법이 보장한 상속분. 침해 시 반환청구 가능.' },
            { id: 'w-law15', term: '협의분할', definition: '상속인 전원의 합의로 상속재산을 나누는 방법. 법정상속분과 다르게 분할 가능하며 협의서 작성 필요.' }
          ]
        }
      ]
    },
    {
      id: 'cat-med',
      name: '의료',
      stages: [
        {
          id: 'st-med1', name: '증상·진단',
          words: [
            { id: 'w-med1', term: '주호소(Chief Complaint)', definition: '환자가 진료를 받으러 온 주된 증상. 의무기록의 출발점으로 CC로 표기.' },
            { id: 'w-med2', term: '감별진단', definition: '비슷한 증상을 보이는 여러 질환 중 가능성 있는 질병을 나열하고 순서대로 배제해 최종 진단에 이르는 과정.' },
            { id: 'w-med3', term: '이학적 검사', definition: '의사가 청진·촉진·타진·시진으로 직접 신체를 살피는 진찰. 기구나 장비에 의존하지 않는 기본 진단 수단.' }
          ]
        },
        {
          id: 'st-med2', name: '검사',
          words: [
            { id: 'w-med4', term: 'CBC(전혈구 검사)', definition: '적혈구·백혈구·혈소판 수치를 측정하는 기본 혈액검사. 빈혈·감염·혈액 질환 스크리닝에 사용.' },
            { id: 'w-med5', term: '조직검사(Biopsy)', definition: '신체 조직의 일부를 채취해 병리 전문의가 현미경으로 세포를 분석하는 검사. 암 확진의 표준.' },
            { id: 'w-med6', term: '영상의학 검사', definition: 'X-ray·CT·MRI·초음파 등 영상 기기로 체내 구조를 시각화하는 검사군의 총칭.' }
          ]
        },
        {
          id: 'st-med3', name: '처방·약',
          words: [
            { id: 'w-med7', term: '제네릭(복제약)', definition: '오리지널 의약품의 특허 만료 후 동일 성분·함량으로 제조한 의약품. 생동성 시험으로 동등성 입증 필요.' },
            { id: 'w-med8', term: '약물 상호작용', definition: '두 가지 이상 약을 동시 복용 시 효과가 증강·감소되거나 부작용이 발생하는 현상.' },
            { id: 'w-med9', term: '용법·용량', definition: '약의 복용 방법(식전·식후·취침 전 등)과 1회 용량·1일 복용 횟수를 명시한 지시 사항.' }
          ]
        },
        {
          id: 'st-med4', name: '수술·시술',
          words: [
            { id: 'w-med10', term: '전신마취(GA)', definition: '약물로 의식·감각·근육을 모두 차단하는 마취. 마취과 전문의가 기도 확보 및 활력징후를 관리.' },
            { id: 'w-med11', term: '복강경 수술', definition: '복부에 소절개 후 카메라와 기구를 삽입해 모니터를 보며 시행하는 최소침습 수술. 회복이 빠름.' },
            { id: 'w-med12', term: '절제술(Resection)', definition: '병변 조직이나 장기의 일부 또는 전체를 외과적으로 제거하는 수술 행위의 총칭.' }
          ]
        },
        {
          id: 'st-med5', name: '보험·청구',
          words: [
            { id: 'w-med13', term: 'DRG(포괄수가제)', definition: '진단명에 따라 입원부터 퇴원까지 비용을 미리 정해 지급하는 건강보험 수가 방식. 과잉진료 억제 목적.' },
            { id: 'w-med14', term: '급여·비급여', definition: '건강보험이 적용(급여)되는 항목과 전액 본인 부담(비급여) 항목의 구분. 비급여 항목은 실손보험으로 보전 가능.' },
            { id: 'w-med15', term: '실손의료보험', definition: '실제 지출한 의료비를 약관 한도 내에서 돌려받는 보험. 급여·비급여 본인부담금 및 비급여를 보장.' }
          ]
        }
      ]
    },
    {
      id: 'cat-video',
      name: '영상/미디어 제작',
      stages: [
        {
          id: 'st-vid1', name: '기획·스크립트',
          words: [
            { id: 'w-vid1', term: '트리트먼트', definition: '영상의 전체 흐름과 연출 방향을 서술 형식으로 정리한 기획 문서. 정식 대본 이전 단계.' },
            { id: 'w-vid2', term: '콘티(콘티뉴이티)', definition: '장면 구성을 그림과 텍스트로 순서대로 표현한 시각화 기획안. 감독·촬영·편집팀의 공통 지침서.' },
            { id: 'w-vid3', term: '런닝타임(RT)', definition: '완성된 영상의 총 재생 시간. 납품 전 발주처 요구 사항에 맞게 준수해야 하는 핵심 스펙.' }
          ]
        },
        {
          id: 'st-vid2', name: '촬영',
          words: [
            { id: 'w-vid4', term: '프레임레이트(fps)', definition: '1초에 몇 장의 정지 이미지를 촬영·재생하는지 나타내는 단위. 24fps는 영화, 60fps는 스포츠·유튜브에 주로 사용.' },
            { id: 'w-vid5', term: '피사계심도(DoF)', definition: '사진·영상에서 초점이 맞아 선명하게 보이는 범위. 조리개를 열수록 심도가 얕아져 배경 흐림(보케) 효과 발생.' },
            { id: 'w-vid6', term: '셔터스피드', definition: '카메라 센서가 빛에 노출되는 시간. 프레임레이트의 2배 분의 1 값이 자연스러운 모션 블러를 만드는 180도 룰의 기준.' }
          ]
        },
        {
          id: 'st-vid3', name: '조명·음향',
          words: [
            { id: 'w-vid7', term: '3점 조명', definition: '키 라이트·필 라이트·백 라이트 세 광원으로 피사체를 입체적으로 표현하는 기본 조명 세팅.' },
            { id: 'w-vid8', term: 'ADR(대사 재녹음)', definition: '촬영 중 수음이 불량한 대사를 스튜디오에서 배우가 다시 녹음하는 작업. 더빙·더빙 후보정 포함.' },
            { id: 'w-vid9', term: '팬텀파워(+48V)', definition: 'XLR 케이블을 통해 콘덴서 마이크에 공급하는 48V 직류 전원. 믹서·인터페이스에서 활성화 필요.' }
          ]
        },
        {
          id: 'st-vid4', name: '편집',
          words: [
            { id: 'w-vid10', term: 'J/L 컷', definition: '오디오와 비디오의 전환 타이밍을 어긋나게 하는 편집 기법. 다음 장면 소리가 먼저 시작(J컷) 또는 화면이 먼저 전환(L컷).' },
            { id: 'w-vid11', term: '타임라인', definition: '편집 소프트웨어에서 영상·오디오 클립을 시간축에 배열하는 작업 공간. 트랙 개수와 순서가 최종 출력물 결정.' },
            { id: 'w-vid12', term: '프록시 편집', definition: '원본 고해상도 파일 대신 저해상도 프록시 파일로 편집 후 최종 출력 시 원본으로 재연결하는 방식. 시스템 부하 감소.' }
          ]
        },
        {
          id: 'st-vid5', name: '색보정·CG',
          words: [
            { id: 'w-vid13', term: 'LUT(룩업테이블)', definition: '입력 색상값을 원하는 출력 색상값으로 변환하는 색상 매핑 파일. 카메라 로그 감마를 표준 색공간으로 변환하거나 영화적 룩을 적용.' },
            { id: 'w-vid14', term: '크로마키(그린스크린)', definition: '특정 색상을 투명 처리하는 합성 기법. 초록(또는 파랑) 배경을 제거하고 원하는 배경으로 대체.' },
            { id: 'w-vid15', term: '모션 그래픽', definition: '그래픽 디자인 요소에 움직임을 부여한 영상 콘텐츠. 타이틀·인포그래픽·자막 애니메이션 등이 해당.' }
          ]
        },
        {
          id: 'st-vid6', name: '납품·송출',
          words: [
            { id: 'w-vid16', term: '코덱(Codec)', definition: '영상 데이터를 압축·복원하는 알고리즘. H.264·H.265(HEVC)·ProRes 등이 있으며 납품처 요건에 맞게 선택.' },
            { id: 'w-vid17', term: '비트레이트(Bitrate)', definition: '단위 시간당 처리되는 데이터 양(bps). 높을수록 화질이 좋아지나 파일 크기 증가. 플랫폼별 권장 값 존재.' },
            { id: 'w-vid18', term: '마스터 파일', definition: '최종 납품 또는 보관용으로 최고 품질로 출력한 원본 파일. 이후 다양한 포맷 파생의 기준본.' }
          ]
        }
      ]
    },
    {
      id: 'cat-fin',
      name: '금융',
      stages: [
        {
          id: 'st-fin1', name: '예금·적금',
          words: [
            { id: 'w-fin1', term: '복리', definition: '이자에 다시 이자가 붙는 구조. 기간이 길수록 단리 대비 수익 격차가 커지며 장기 투자의 핵심 원리.' },
            { id: 'w-fin2', term: '세전·세후 이자', definition: '이자 소득에는 15.4% 이자 소득세가 원천징수. 실제 수령액은 세후 금액으로, 상품 비교 시 세후 기준 확인 필요.' },
            { id: 'w-fin3', term: '예금자보호', definition: '금융기관 파산 시 예금보험공사가 원리금 합산 1인당 최대 5000만 원까지 보호하는 제도.' }
          ]
        },
        {
          id: 'st-fin2', name: '대출',
          words: [
            { id: 'w-fin4', term: 'DSR(총부채원리금상환비율)', definition: '연간 소득 대비 모든 대출의 원리금 상환액 비율. 대출 규제의 핵심 지표로 비율 초과 시 대출 제한.' },
            { id: 'w-fin5', term: 'LTV(담보인정비율)', definition: '담보 물건 가치 대비 대출 가능 금액의 비율. 주택담보대출에서 지역·규제에 따라 상한선 상이.' },
            { id: 'w-fin6', term: '중도상환수수료', definition: '대출 만기 전 조기 상환 시 은행에 납부하는 수수료. 통상 잔액의 1~2% 수준, 일정 기간 후 면제 상품도 있음.' }
          ]
        },
        {
          id: 'st-fin3', name: '투자·증권',
          words: [
            { id: 'w-fin7', term: 'PER(주가수익비율)', definition: '주가를 주당순이익(EPS)으로 나눈 값. 수치가 낮을수록 이익 대비 저평가 가능성. 동일 업종 내 상대 비교가 중요.' },
            { id: 'w-fin8', term: '공매도', definition: '보유하지 않은 주식을 빌려서 매도 후 주가 하락 시 싸게 매수해 갚아 차익을 얻는 투자 전략.' },
            { id: 'w-fin9', term: '배당수익률', definition: '주가 대비 연간 배당금 비율. 배당금 ÷ 주가 × 100으로 계산하며 안정적 현금흐름 투자의 판단 기준.' }
          ]
        },
        {
          id: 'st-fin4', name: '보험',
          words: [
            { id: 'w-fin10', term: '보장성 보험', definition: '사망·질병·재해 등 위험 보장이 목적인 보험. 만기 시 환급금이 없거나 적은 순수보장형과 환급형으로 나뉨.' },
            { id: 'w-fin11', term: '갱신형 보험', definition: '일정 기간마다 나이·손해율 반영해 보험료가 재산정되는 구조. 초기 보험료가 낮지만 장기적으로 증가.' },
            { id: 'w-fin12', term: '면책 기간', definition: '보험 가입 후 일정 기간 동안 특정 보장을 제공하지 않는 기간. 암 보험의 경우 통상 90일.' }
          ]
        },
        {
          id: 'st-fin5', name: '세금·절세',
          words: [
            { id: 'w-fin13', term: 'ISA(개인종합자산관리계좌)', definition: '예금·펀드·ETF·채권 등을 한 계좌에서 운용하며 이자·배당 소득에 비과세·분리과세 혜택을 주는 절세 계좌.' },
            { id: 'w-fin14', term: '세액공제', definition: '산출된 세금에서 직접 차감하는 혜택. 소득공제(과세표준 감소)와 달리 세금 자체를 줄이므로 절세 효과가 큼.' },
            { id: 'w-fin15', term: '종합소득세', definition: '이자·배당·사업·근로·연금·기타 소득을 합산해 매년 5월에 신고·납부하는 세금. 누진세율 6~45% 적용.' }
          ]
        }
      ]
    },
    {
      id: 'cat-it',
      name: 'IT 개발',
      stages: [
        {
          id: 'st-it1', name: '기획·설계',
          words: [
            { id: 'w-it1', term: '유저 스토리', definition: '사용자 관점에서 기능을 서술하는 요구사항 형식. "나는 [역할]로서 [기능]을 원한다. 왜냐하면 [이유]이기 때문이다" 구조.' },
            { id: 'w-it2', term: 'ERD(개체-관계 다이어그램)', definition: '데이터베이스의 테이블(엔티티)과 관계를 시각화한 설계 다이어그램. 개발 전 DB 구조 합의의 기준.' },
            { id: 'w-it3', term: '와이어프레임', definition: '색상·이미지 없이 레이아웃과 기능 배치만 표현한 UI 설계 초안. 개발 전 구조 검토 및 이해관계자 소통 용도.' }
          ]
        },
        {
          id: 'st-it2', name: '디자인·UI',
          words: [
            { id: 'w-it4', term: '디자인 시스템', definition: '버튼·타이포·컬러 등 UI 구성요소를 규칙화한 컴포넌트 모음. 제품 전반의 일관성 확보와 협업 효율을 높임.' },
            { id: 'w-it5', term: '접근성(a11y)', definition: '장애인·고령자 포함 모든 사용자가 서비스를 이용할 수 있도록 설계하는 원칙. WCAG 기준 준수 여부가 주요 지표.' },
            { id: 'w-it6', term: '반응형 디자인', definition: '화면 크기(모바일·태블릿·데스크톱)에 따라 레이아웃이 유동적으로 변하는 웹 디자인 방식.' }
          ]
        },
        {
          id: 'st-it3', name: '프론트엔드',
          words: [
            { id: 'w-it7', term: 'CSR / SSR', definition: 'CSR(클라이언트 사이드 렌더링)은 브라우저에서 JS로 화면을 그리고, SSR(서버 사이드 렌더링)은 서버에서 완성된 HTML을 내려보내는 방식. SEO·초기 로딩 속도에 영향.' },
            { id: 'w-it8', term: '번들링', definition: '여러 JS·CSS 파일을 하나(또는 소수)의 파일로 합치는 빌드 과정. Webpack·Vite 등이 대표 번들러.' },
            { id: 'w-it9', term: '하이드레이션', definition: 'SSR로 생성된 정적 HTML에 JS를 붙여 인터랙티브하게 만드는 과정. 이 시점 이후 이벤트 핸들러가 동작.' }
          ]
        },
        {
          id: 'st-it4', name: '백엔드',
          words: [
            { id: 'w-it10', term: 'RESTful API', definition: 'HTTP 메서드(GET·POST·PUT·DELETE)와 URL로 자원을 표현하는 API 설계 원칙. 무상태성·균일한 인터페이스가 핵심.' },
            { id: 'w-it11', term: '미들웨어', definition: '클라이언트 요청과 서버 응답 사이에서 인증·로깅·파싱 등을 처리하는 중간 소프트웨어 레이어.' },
            { id: 'w-it12', term: 'ORM(객체-관계 매핑)', definition: '객체지향 코드로 SQL 없이 데이터베이스를 조작할 수 있게 해주는 추상화 계층. Prisma·TypeORM 등이 대표.' }
          ]
        },
        {
          id: 'st-it5', name: '배포·운영',
          words: [
            { id: 'w-it13', term: 'CI/CD', definition: '코드 변경 시 자동 빌드·테스트(CI)와 프로덕션 자동 배포(CD)를 통합한 파이프라인. 배포 주기 단축과 인적 오류 감소.' },
            { id: 'w-it14', term: '컨테이너(Docker)', definition: '앱과 실행 환경을 이미지로 패키징해 어디서든 동일하게 실행되게 하는 가상화 기술. "내 로컬에선 됐는데" 문제 해소.' },
            { id: 'w-it15', term: '롤백', definition: '새 배포 버전에 문제가 생겼을 때 이전 안정 버전으로 즉시 되돌리는 조치. 다운타임 최소화를 위한 필수 운영 전략.' }
          ]
        }
      ]
    },
    {
      id: 'cat-car',
      name: '자동차',
      stages: [
        {
          id: 'st-car1', name: '구매·견적',
          words: [
            { id: 'w-car1', term: '출고가(MSRP)', definition: '제조사가 공식 책정한 차량 판매 기준가. 여기에 옵션·세금·등록비를 더한 금액이 실제 구매 비용.' },
            { id: 'w-car2', term: '할부원리금', definition: '차량 할부 시 매월 납부하는 원금과 이자의 합계. 할부 기간이 길수록 월 납입금은 줄지만 총 이자 비용 증가.' },
            { id: 'w-car3', term: '잔존가치(RV)', definition: '리스·장기렌트에서 계약 종료 시점의 차량 예상 잔여 가치. RV가 높을수록 월 납입금이 낮아짐.' }
          ]
        },
        {
          id: 'st-car2', name: '보험',
          words: [
            { id: 'w-car4', term: '자차담보(자기차량손해)', definition: '내 차가 사고·도난·자연재해 등으로 손상됐을 때 수리비를 보상하는 담보. 면책금(자기부담금) 설정 가능.' },
            { id: 'w-car5', term: '대인·대물 배상', definition: '대인은 사고로 타인에게 입힌 신체 피해, 대물은 재물 피해를 보상. 대인 무제한·대물 최소 2000만 원이 의무 가입 기준.' },
            { id: 'w-car6', term: '할증·할인 등급', definition: '사고 이력에 따라 보험료가 오르거나(할증) 내려가는(할인) 제도. 1~26등급으로 구분, 무사고 기간이 길수록 낮은 등급.' }
          ]
        },
        {
          id: 'st-car3', name: '정비·수리',
          words: [
            { id: 'w-car7', term: 'OBD-II 진단', definition: '차량 자기진단 포트에 스캐너를 연결해 ECU 오류 코드(DTC)를 읽어내는 전자 진단 방식. 경고등 원인 파악에 사용.' },
            { id: 'w-car8', term: '토크(Nm)', definition: '엔진이 회전축에 가하는 회전력. 높은 토크는 가속·견인력에 유리하며 저회전 토크가 높을수록 일상 주행에서 체감 성능 우수.' },
            { id: 'w-car9', term: '순정 부품', definition: '완성차 제조사가 인증한 정품 부품. 비순정(aftermarket) 대비 가격이 높지만 품질·보증 기간 면에서 안정적.' }
          ]
        },
        {
          id: 'st-car4', name: '튜닝',
          words: [
            { id: 'w-car10', term: 'ECU 튜닝(리맵핑)', definition: '엔진 제어 장치의 연료 분사·점화 시기·부스트 압력 값을 재프로그래밍해 출력·연비를 최적화하는 작업.' },
            { id: 'w-car11', term: '서스펜션 세팅', definition: '스프링·쇼크업소버·스태빌라이저 강성과 차고를 조정해 승차감과 코너링 성능 균형을 맞추는 세팅.' },
            { id: 'w-car12', term: '합법 튜닝 신고', definition: '국내에서 구조·장치를 변경한 튜닝은 교통안전공단의 검사를 받고 승인 후 자동차등록원부를 갱신해야 합법.' }
          ]
        },
        {
          id: 'st-car5', name: '사고 처리',
          words: [
            { id: 'w-car13', term: '과실 비율', definition: '사고 발생 시 양측의 책임 비중을 백분율로 산정한 값. 수리비·치료비 등 손해 분담의 기준이 됨.' },
            { id: 'w-car14', term: '전손 처리', definition: '수리비가 사고 직전 차량 시세의 일정 비율(통상 80~100%)을 초과할 때 차량 전부를 손해로 보고 시세 기준 보상하는 방식.' },
            { id: 'w-car15', term: '사고 기록 장치(EDR)', definition: '충돌 직전 속도·브레이크·에어백 작동 여부 등을 기록하는 차량 내 블랙박스 역할 장치. 과실 분쟁 시 증거 활용.' }
          ]
        }
      ]
    },
    {
      id: 'cat-realty',
      name: '부동산',
      stages: [
        {
          id: 'st-re1', name: '매매',
          words: [
            { id: 'w-re1', term: '계약금·중도금·잔금', definition: '부동산 매매 대금을 세 단계로 나눠 지급하는 관행. 계약금(통상 10%)은 계약 성립, 중도금은 중간 이행, 잔금은 소유권 이전 시 지급.' },
            { id: 'w-re2', term: '등기이전', definition: '매매 완료 후 부동산 소유권을 매도인에서 매수인으로 법적으로 이전하는 절차. 잔금일에 법무사를 통해 처리.' },
            { id: 'w-re3', term: '분양권 전매', definition: '아파트 청약 당첨 후 입주 전 계약상 지위를 제3자에게 양도하는 행위. 지역·시기에 따라 전매 제한 규정 적용.' }
          ]
        },
        {
          id: 'st-re2', name: '전·월세',
          words: [
            { id: 'w-re4', term: '확정일자', definition: '임대차 계약서에 공증기관이 날인해 계약 성립 일자를 공식 확인하는 제도. 우선변제권 취득의 필수 요건 중 하나.' },
            { id: 'w-re5', term: '임차권 등기명령', definition: '전세 계약 종료 후 보증금을 돌려받지 못한 경우 법원의 명령으로 등기부에 임차권을 기재하는 제도. 이사 후에도 우선변제권 유지.' },
            { id: 'w-re6', term: '전세권 설정', definition: '전세금을 지급하고 부동산에 전세권을 등기하는 물권 설정 행위. 확정일자보다 강력한 권리로 경매 신청도 가능.' }
          ]
        },
        {
          id: 'st-re3', name: '등기·서류',
          words: [
            { id: 'w-re7', term: '등기부등본(등기사항전부증명서)', definition: '표제부(물건 현황)·갑구(소유권)·을구(근저당 등 제한물권)로 구성된 부동산 권리 공시 문서. 거래 전 반드시 확인.' },
            { id: 'w-re8', term: '건축물대장', definition: '건물의 용도·면적·구조·층수 등 현황을 관리하는 공적 장부. 불법 증축·용도 변경 여부 확인 가능.' },
            { id: 'w-re9', term: '토지이용계획확인서', definition: '토지의 용도지역·지구·구역 지정 현황을 확인하는 문서. 해당 토지에서 가능한 건축 행위의 범위를 파악하는 데 필수.' }
          ]
        },
        {
          id: 'st-re4', name: '대출·담보',
          words: [
            { id: 'w-re10', term: '채권최고액', definition: '근저당 설정 시 등기부에 기재되는 담보 채권의 상한액. 통상 대출 원금의 120~130%로 설정.' },
            { id: 'w-re11', term: '방공제', definition: '경매 시 소액임차인 최우선변제금을 먼저 공제하고 남은 금액을 근저당권자에게 배분하는 방식. 대출 가능 금액 산정 시 반영.' },
            { id: 'w-re12', term: '보금자리론', definition: '한국주택금융공사에서 취급하는 장기 고정금리 주택담보대출. LTV·DTI 조건 충족 시 최장 50년 만기 선택 가능.' }
          ]
        },
        {
          id: 'st-re5', name: '세금',
          words: [
            { id: 'w-re13', term: '취득세', definition: '부동산 취득 시 1회 납부하는 지방세. 주택 가격·보유 주택 수에 따라 1~12% 세율 적용.' },
            { id: 'w-re14', term: '양도소득세', definition: '부동산 매각 시 양도차익(매도가 - 취득가 - 필요경비)에 부과되는 국세. 보유 기간·조정지역 여부에 따라 세율 상이.' },
            { id: 'w-re15', term: '종합부동산세(종부세)', definition: '일정 공시가격 초과 주택 보유자에게 부과하는 국세. 공시가격 합산액 기준 초과분에 누진 세율 적용.' }
          ]
        }
      ]
    },
    {
      id: 'cat-fashion',
      name: '패션/의류 제작',
      stages: [
        {
          id: 'st-fa1', name: '원단 선택',
          words: [
            { id: 'w-fa1', term: '번수(수)', definition: '실의 굵기를 나타내는 단위. 번수가 높을수록 실이 가늘고 원단이 얇아짐. 면 20수는 두꺼운 티셔츠, 40수는 얇은 셔츠에 사용.' },
            { id: 'w-fa2', term: '직물·편물 구분', definition: '직물은 날실과 씨실을 교차해 짠 원단(데님·옥스퍼드), 편물은 고리 연결 방식의 니트 원단. 신축성과 용도에서 차이.' },
            { id: 'w-fa3', term: '위킹(흡한속건)', definition: '땀을 표면으로 끌어올려 빠르게 증발시키는 기능. 폴리에스터 계열 기능성 원단의 핵심 특성.' }
          ]
        },
        {
          id: 'st-fa2', name: '패턴·재단',
          words: [
            { id: 'w-fa4', term: '그레이딩', definition: '기본 패턴(기준 사이즈)을 S·M·L 등 다양한 사이즈로 비례 확대·축소하는 작업.' },
            { id: 'w-fa5', term: '시접', definition: '봉제 시 실밥이 빠지지 않도록 패턴 재단선 바깥에 추가하는 여유분. 보통 1~1.5cm.' },
            { id: 'w-fa6', term: '마킹(배치도)', definition: '원단 손실을 최소화하기 위해 여러 패턴 조각을 원단 위에 최적으로 배치하는 설계 작업.' }
          ]
        },
        {
          id: 'st-fa3', name: '봉제',
          words: [
            { id: 'w-fa7', term: '오버록(인터로크)', definition: '원단 끝단이 풀리지 않도록 감싸 박으면서 자동으로 재단하는 봉제 방식. 니트류 마감에 필수.' },
            { id: 'w-fa8', term: '박음질 강도', definition: '단위 길이당 바늘땀 수(스티치/인치). 숫자가 높을수록 촘촘하며 봉제 강도 결정.' },
            { id: 'w-fa9', term: '임가공(아웃소싱)', definition: '봉제 공정을 외부 봉제 공장에 위탁하는 방식. 원단·부자재를 지급하고 가공비만 지불하는 구조.' }
          ]
        },
        {
          id: 'st-fa4', name: '염색·가공',
          words: [
            { id: 'w-fa10', term: '선염·후염', definition: '선염은 실이나 원단 상태에서 먼저 염색 후 봉제, 후염은 봉제 완성 후 완제품 상태로 염색. 후염은 균일한 색상 표현에 유리.' },
            { id: 'w-fa11', term: '워싱 가공', definition: '완성 의류를 세탁·효소 처리 등으로 빈티지 질감·수축 안정화·유연함을 부여하는 후가공.' },
            { id: 'w-fa12', term: 'DWR(발수가공)', definition: '원단 표면에 불소 계열 약품을 처리해 물방울이 맺혀 굴러내리도록 하는 기능성 가공. 세탁 시 효과 저하 가능.' }
          ]
        },
        {
          id: 'st-fa5', name: '라벨·태그',
          words: [
            { id: 'w-fa13', term: '케어 라벨', definition: '세탁 방법·건조 방법·다림질 온도 등을 국제 표준 기호로 표시해 의류 내부에 부착하는 관리 표시 라벨. 법적 부착 의무.' },
            { id: 'w-fa14', term: '원산지 표시', definition: '의류의 생산 국가를 소비자가 알 수 있도록 케어 라벨에 함께 표기하는 법적 의무 사항.' },
            { id: 'w-fa15', term: '행택(Hangtag)', definition: '판매 시 제품에 달아놓는 가격표 겸 브랜드 태그. 소재·사이즈·가격·바코드 등을 인쇄.' }
          ]
        }
      ]
    },
    {
      id: 'cat-music',
      name: '음악 제작',
      stages: [
        {
          id: 'st-mu1', name: '작곡·편곡',
          words: [
            { id: 'w-mu1', term: '코드 진행', definition: '화음을 시간 순서대로 배열한 음악의 화성적 구조. I-IV-V-I 같은 기능화성이 팝·록의 기반.' },
            { id: 'w-mu2', term: 'BPM(분당 박자 수)', definition: '1분에 반복되는 박자의 수. 템포를 수치로 표현하며 장르·분위기의 기준이 됨. 일반 팝은 90~130 BPM 범위.' },
            { id: 'w-mu3', term: '아웃트로', definition: '곡의 끝 부분. 점차 음량을 줄이는 페이드 아웃, 갑작스럽게 끝내는 콜드 엔딩 등 다양한 방식으로 마무리.' }
          ]
        },
        {
          id: 'st-mu2', name: '레코딩',
          words: [
            { id: 'w-mu4', term: '임피던스(Ω)', definition: '전기 신호의 흐름에 대한 저항값. 마이크·기타·앰프 등 장비 간 임피던스 매칭이 맞지 않으면 신호 손실·음색 변화 발생.' },
            { id: 'w-mu5', term: '팬텀파워(+48V)', definition: 'XLR 케이블을 통해 콘덴서 마이크에 공급하는 직류 전원. 오디오 인터페이스에서 활성화 필요. 다이나믹 마이크에는 불필요.' },
            { id: 'w-mu6', term: 'DI(다이렉트 인젝션)', definition: '기타·베이스 등 고임피던스 악기 신호를 밸런스 라인 레벨로 변환해 믹서에 직결하는 장치. 앰프 없이 클린 사운드 레코딩.' }
          ]
        },
        {
          id: 'st-mu3', name: '믹싱',
          words: [
            { id: 'w-mu7', term: 'EQ(이퀄라이저)', definition: '특정 주파수 대역의 음량을 높이거나 낮춰 각 트랙의 음색을 조정하는 프로세서. 트랙 간 주파수 충돌 해소에 핵심.' },
            { id: 'w-mu8', term: '컴프레서', definition: '설정 임계값 이상의 소리를 일정 비율로 압축해 다이나믹 레인지를 줄이는 프로세서. 소리의 균일함과 펀치감 조절.' },
            { id: 'w-mu9', term: '패닝', definition: '각 트랙의 소리를 스테레오 좌우 공간에 배치하는 작업. 악기를 입체적으로 분리해 공간감을 만드는 믹싱의 기본 요소.' }
          ]
        },
        {
          id: 'st-mu4', name: '마스터링',
          words: [
            { id: 'w-mu10', term: 'LUFS(라우드니스 단위)', definition: '스트리밍 플랫폼 표준 음량 기준 단위. 스포티파이·유튜브는 -14 LUFS를 기준으로 음원을 노멀라이즈.' },
            { id: 'w-mu11', term: '리미터', definition: '설정 최대 음압(True Peak) 이상으로 신호가 올라가지 않도록 차단하는 프로세서. 디지털 클리핑 방지.' },
            { id: 'w-mu12', term: '스테레오 와이드닝', definition: '모노 혹은 좁은 스테레오 신호의 좌우 폭을 확장하는 처리. 과도하면 모노 호환성 문제 발생.' }
          ]
        },
        {
          id: 'st-mu5', name: '유통·저작권',
          words: [
            { id: 'w-mu13', term: 'ISRC(국제표준녹음코드)', definition: '음원을 전 세계에서 고유하게 식별하는 12자리 코드. 스트리밍 수익 정산·저작인접권 관리의 기반.' },
            { id: 'w-mu14', term: '저작인접권', definition: '실연자(연주자·가수)와 음반 제작자에게 부여되는 권리. 저작권(작곡·작사)과 별도로 음원 수익을 배분받을 권리.' },
            { id: 'w-mu15', term: '기계적 복제권(Mechanical Rights)', definition: '악곡을 음반·음원으로 복제·배포할 때 작곡자에게 지급해야 하는 저작권료. 스트리밍 수익의 일부가 이 항목으로 분배.' }
          ]
        }
      ]
    },
    {
      id: 'cat-food',
      name: '요식업 창업',
      stages: [
        {
          id: 'st-fo1', name: '인허가·신고',
          words: [
            { id: 'w-fo1', term: '식품영업 허가·신고', definition: '음식점 운영 전 관할 구청에 제출하는 법적 행정 절차. 일반음식점·휴게음식점은 신고, 단란주점 등은 허가 대상.' },
            { id: 'w-fo2', term: 'HACCP(해썹)', definition: '식품 원재료부터 제조·유통·판매까지 각 단계에서 위해 요소를 분석·관리하는 식품 안전 관리 시스템.' },
            { id: 'w-fo3', term: '영업자 위생 교육', definition: '식품위생법에 따라 신규 영업자가 영업 시작 전, 기존 영업자가 매년 이수해야 하는 의무 교육.' }
          ]
        },
        {
          id: 'st-fo2', name: '주방 설비',
          words: [
            { id: 'w-fo4', term: '그리스 트랩(유수분리기)', definition: '싱크대 배수에서 기름·찌꺼기를 분리·포집하는 장치. 하수관 막힘과 환경 오염 방지를 위한 법적 설치 의무.' },
            { id: 'w-fo5', term: '후드 덕트', definition: '조리 시 발생하는 열기·연기·냄새를 외부로 배출하는 환기 시스템. 배출 풍량이 부족하면 작업 환경·소방 문제 발생.' },
            { id: 'w-fo6', term: '식품용 스테인리스(SUS304)', definition: '내식성·위생성이 우수해 주방 조리대·용기·집기에 사용하는 스테인리스 강종. 식품 접촉면에 법적 사용 권장.' }
          ]
        },
        {
          id: 'st-fo3', name: '식자재 유통',
          words: [
            { id: 'w-fo7', term: '콜드체인', definition: '식재료의 생산부터 판매까지 냉장·냉동 온도를 유지하며 유통하는 시스템. 체인이 끊기면 식품 안전 위험 발생.' },
            { id: 'w-fo8', term: 'FIFO(선입선출)', definition: '먼저 입고된 식자재를 먼저 사용하는 재고 관리 원칙. 식재료 유통기한 초과 및 폐기 손실 최소화를 위한 기본 룰.' },
            { id: 'w-fo9', term: '발주 단위(MOQ)', definition: '식자재 공급업체가 설정한 최소 주문 수량. MOQ 미만 주문 시 단가가 높아지거나 납품 거절될 수 있음.' }
          ]
        },
        {
          id: 'st-fo4', name: '메뉴 개발',
          words: [
            { id: 'w-fo10', term: '표준 레시피', definition: '메뉴 품질의 일관성을 위해 재료·계량·조리 순서를 문서화한 조리 기준서. 신규 직원 교육 및 원가 관리의 기준.' },
            { id: 'w-fo11', term: '원가율(F/C)', definition: '메뉴 판매가 대비 식재료비의 비율. 일반적으로 30~35%를 적정 수준으로 관리하며 메뉴 가격 책정의 핵심 지표.' },
            { id: 'w-fo12', term: '포션(Portion)', definition: '1인분 기준 식재료의 표준 중량·양. 포션 관리를 통해 원가율 안정화와 균일한 음식량 제공 가능.' }
          ]
        },
        {
          id: 'st-fo5', name: '위생·검수',
          words: [
            { id: 'w-fo13', term: '교차오염', definition: '날 식재료의 세균이 조리된 음식이나 조리 도구로 옮겨지는 현상. 도마·칼의 육류·채소 분리 사용으로 예방.' },
            { id: 'w-fo14', term: '검수 일지', definition: '납품 식재료의 온도·신선도·중량·유통기한을 입고 시점에 기록하는 문서. HACCP 인증 시 필수 관리 기록.' },
            { id: 'w-fo15', term: '온도 이력 관리', definition: '냉장·냉동 식재료의 보관 온도를 시간대별로 기록·모니터링하는 관리 방식. 자동 온도 로거 또는 IoT 센서로 관리.' }
          ]
        }
      ]
    },
    {
      id: 'cat-ad',
      name: '광고·마케팅',
      stages: [
        {
          id: 'st-ad1', name: '매체 기획',
          words: [
            { id: 'w-ad1', term: '미디어 믹스', definition: 'TV·디지털·옥외 등 복수의 광고 매체를 조합해 목표 도달 효율을 극대화하는 매체 전략.' },
            { id: 'w-ad2', term: 'GRP(시청률 합계)', definition: 'TV 광고에서 방영 기간 동안 누적된 시청률의 합. GRP 100은 타겟 집단 전체가 평균 1회 노출됐음을 의미.' },
            { id: 'w-ad3', term: '임프레션', definition: '광고가 사용자 화면에 노출된 총 횟수. 클릭 여부와 무관하며 인지도 캠페인의 성과 측정 기준.' }
          ]
        },
        {
          id: 'st-ad2', name: '소재 제작',
          words: [
            { id: 'w-ad4', term: '크리에이티브 브리프', definition: '광고 제작 방향을 압축한 핵심 기획서. 타겟·메시지·톤&매너·KPI를 한 장으로 요약해 제작팀과 공유.' },
            { id: 'w-ad5', term: 'CTA(행동 유도 문구)', definition: '사용자에게 특정 행동(구매·회원가입·다운로드 등)을 유도하는 광고 문구. 버튼 문구·카피의 전환율에 직접 영향.' },
            { id: 'w-ad6', term: 'A/B 테스트', definition: '두 가지 소재(A·B)를 동시에 집행해 클릭률·전환율을 비교 측정, 성과 우수 소재를 선택하는 최적화 방식.' }
          ]
        },
        {
          id: 'st-ad3', name: '매체 집행',
          words: [
            { id: 'w-ad7', term: 'CPM(1000회 노출당 비용)', definition: '광고 1000회 노출에 드는 비용. 인지도·도달 목적 캠페인의 효율 비교 지표.' },
            { id: 'w-ad8', term: 'CPC(클릭당 비용)', definition: '광고 클릭 1회에 지불하는 비용. 퍼포먼스 마케팅에서 트래픽·전환 최적화 캠페인의 핵심 입찰 단위.' },
            { id: 'w-ad9', term: '리타겟팅', definition: '자사 웹사이트나 앱을 방문한 사용자를 식별해 다른 매체에서 재노출하는 광고 방식. 구매 전환율 제고에 효과적.' }
          ]
        },
        {
          id: 'st-ad4', name: '성과 분석',
          words: [
            { id: 'w-ad10', term: 'ROAS(광고비 대비 매출)', definition: '광고 집행으로 발생한 매출을 광고비로 나눈 값. ROAS 300%는 광고비 1원당 3원의 매출을 의미.' },
            { id: 'w-ad11', term: 'CTR(클릭률)', definition: '광고 노출 대비 클릭 수의 비율. 소재·타겟팅의 관련성을 나타내는 지표로 CTR이 높을수록 효율적인 소재.' },
            { id: 'w-ad12', term: '어트리뷰션', definition: '전환(구매·가입 등)이 발생했을 때 어떤 광고 접점이 기여했는지 공헌도를 분배하는 분석 방법론.' }
          ]
        },
        {
          id: 'st-ad5', name: '정산·보고',
          words: [
            { id: 'w-ad13', term: '집행 보고서', definition: '캠페인 종료 후 노출·클릭·전환·비용 등 주요 수치를 정리해 광고주에게 제출하는 결과 보고 문서.' },
            { id: 'w-ad14', term: '대행 수수료(Agency Fee)', definition: '광고 기획·운영·보고 서비스에 대해 광고주가 대행사에 지급하는 수수료. 통상 매체비의 10~20% 또는 정액으로 책정.' },
            { id: 'w-ad15', term: '인보이스(Invoice)', definition: '광고 집행 후 대행사가 매체비·제작비·수수료를 항목별로 명시해 발행하는 세금계산서 전 단계 청구 문서.' }
          ]
        }
      ]
    },
    {
      id: 'cat-tax',
      name: '세무·회계',
      stages: [
        {
          id: 'st-tax1', name: '장부 기장',
          words: [
            { id: 'w-tax1', term: '복식부기', definition: '모든 거래를 차변과 대변 두 계정에 동시에 기록하는 회계 방식. 법인 및 일정 규모 이상 개인사업자의 법적 의무.' },
            { id: 'w-tax2', term: '손익계산서(P&L)', definition: '일정 기간 매출·비용·이익을 집계한 경영 성과 보고서. 영업이익·당기순이익이 핵심 지표.' },
            { id: 'w-tax3', term: '대차대조표(재무상태표)', definition: '특정 시점의 자산·부채·자본 잔액을 표시한 재무제표. 자산 = 부채 + 자본의 항등식이 성립.' }
          ]
        },
        {
          id: 'st-tax2', name: '급여·4대보험',
          words: [
            { id: 'w-tax4', term: '원천징수', definition: '급여 지급 시 소득세·지방소득세를 미리 공제하고 대신 납부하는 제도. 사업자는 매월 또는 반기별 신고·납부 의무.' },
            { id: 'w-tax5', term: '두루누리 지원', definition: '소규모 사업장(10인 미만)의 저임금 근로자에 대해 국가가 고용보험·국민연금 보험료 일부를 지원하는 제도.' },
            { id: 'w-tax6', term: '근로소득 간이세액표', definition: '월 급여 수준과 가족 수에 따라 원천징수할 소득세액을 사전에 계산해 국세청이 제공하는 표.' }
          ]
        },
        {
          id: 'st-tax3', name: '부가세',
          words: [
            { id: 'w-tax7', term: '매입세액공제', definition: '사업 관련 매입 세금계산서에 기재된 부가세를 매출 부가세에서 공제해 실제 납부세액을 줄이는 제도.' },
            { id: 'w-tax8', term: '영세율', definition: '수출 거래 등에 부가세율 0%를 적용해 사실상 면세 효과를 주는 제도. 매입세액 환급도 가능.' },
            { id: 'w-tax9', term: '과세표준', definition: '세금 계산의 기준이 되는 금액. 부가세에서는 공급가액(부가세 제외 금액)이 과세표준.' }
          ]
        },
        {
          id: 'st-tax4', name: '법인세·소득세',
          words: [
            { id: 'w-tax10', term: '손금산입', definition: '법인세 계산 시 비용으로 인정해 과세표준에서 차감하는 항목. 접대비·인건비 등 한도 초과분은 손금불산입.' },
            { id: 'w-tax11', term: '성실신고확인제', definition: '수입금액이 업종별 기준 이상인 개인사업자가 세무사에게 신고 내용의 적정성을 검증받는 제도. 누락 방지 목적.' },
            { id: 'w-tax12', term: '이월결손금', definition: '당해 연도에 발생한 결손금을 다음 연도 이후 소득에서 공제해 세금을 줄이는 제도. 법인은 15년간 이월 가능.' }
          ]
        },
        {
          id: 'st-tax5', name: '세무조사',
          words: [
            { id: 'w-tax13', term: '정기 세무조사', definition: '국세청이 납세 성실도 분석을 통해 주기적으로 선정해 실시하는 조사. 통상 5년 주기로 대규모 법인에 적용.' },
            { id: 'w-tax14', term: '수정신고', definition: '당초 신고한 세액이 과소 신고된 경우 스스로 고쳐 신고하는 절차. 자진 수정 시 가산세 감면 혜택.' },
            { id: 'w-tax15', term: '가산세', definition: '신고 불성실·납부 불성실 시 본세에 추가로 부과되는 세금. 무신고 20%, 납부 지연은 일 0.022% 가산.' }
          ]
        }
      ]
    }
  ]
};

// ── State ──────────────────────────────────────────────────────────────────
async function loadData() {
  try {
    const { data: row, error } = await supabase
      .from('app_data')
      .select('data')
      .eq('id', 'singleton')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (row) return row.data;
    // 첫 실행: 기본 데이터 삽입
    await supabase.from('app_data').insert({ id: 'singleton', data: DEFAULT_DATA });
    return structuredClone(DEFAULT_DATA);
  } catch (e) {
    console.error('loadData 실패, 로컬 기본값 사용:', e);
    return structuredClone(DEFAULT_DATA);
  }
}

let state = {
  data: null,
  view: 'home',
  categoryId: null,
  stageId: null,
  searchQuery: '',
  sortBy: 'alpha',
  allWordsFilterCat: null,
  allWordsSortBy: 'alpha',
};

function save() {
  supabase
    .from('app_data')
    .upsert({ id: 'singleton', data: state.data, updated_at: new Date().toISOString() })
    .then(({ error }) => { if (error) console.error('저장 실패:', error); });
}

function uid() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

// ── Navigation ─────────────────────────────────────────────────────────────
function goHome() {
  state.view = 'home';
  state.categoryId = null;
  state.stageId = null;
  state.searchQuery = '';
  render();
  window.scrollTo(0, 0);
}

function goAllWords() {
  state.view = 'all-words';
  state.searchQuery = '';
  state.allWordsFilterCat = null;
  render();
  window.scrollTo(0, 0);
}

function goCategory(catId) {
  const cat = state.data.categories.find(c => c.id === catId);
  if (!cat) return;
  cat.views = (cat.views ?? 0) + 1;
  save();
  state.view = 'category';
  state.categoryId = catId;
  state.stageId = cat.stages.length > 0 ? 'all' : null;
  render();
  window.scrollTo(0, 0);
}

function selectStage(stageId) {
  state.stageId = stageId;
  render();
  window.scrollTo(0, 0);
}

// ── Render helpers ──────────────────────────────────────────────────────────
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'class') {
      el.className = v;
    } else if (k === 'html') {
      el.innerHTML = v;
    } else {
      el.setAttribute(k, v);
    }
  }
  for (const child of children.flat()) {
    if (child == null) continue;
    el.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
}

// ── Render ──────────────────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  const headerActions = document.getElementById('header-actions');
  const headerNav = document.getElementById('header-nav');

  app.innerHTML = '';
  headerActions.innerHTML = '';

  headerNav.replaceChildren(
    h('div', { class: 'header-nav-tabs' },
      h('button', {
        class: 'header-nav-tab' + (['home', 'category'].includes(state.view) ? ' active' : ''),
        onClick: goHome
      }, '업계별 탐색'),
      h('button', {
        class: 'header-nav-tab' + (state.view === 'all-words' ? ' active' : ''),
        onClick: goAllWords
      }, '전체 단어')
    )
  );

  if (state.view === 'home') {
    headerActions.append(
      h('button', { class: 'btn btn-primary', onClick: openWordWizard }, '+ 용어 추가')
    );
    renderHome(app);
  } else if (state.view === 'all-words') {
    headerActions.append(
      h('button', { class: 'btn btn-primary', onClick: openWordWizard }, '+ 용어 추가')
    );
    renderAllWords(app);
  } else if (state.view === 'category') {
    renderCategory(app);
  }
}

function renderHome(container) {
  const cats = state.data.categories;
  const query = state.searchQuery.toLowerCase().trim();

  const SORTS = [
    { key: 'alpha',   label: '가나다순' },
    { key: 'popular', label: '인기순' },
    { key: 'recent',  label: '최신순' },
  ];

  const filtered = (query
    ? cats.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.stages.some(s =>
          s.name.toLowerCase().includes(query) ||
          s.words.some(w => w.term.toLowerCase().includes(query) || w.definition.toLowerCase().includes(query))
        )
      )
    : [...cats]
  ).sort((a, b) => {
    if (state.sortBy === 'alpha')   return a.name.localeCompare(b.name, 'ko');
    if (state.sortBy === 'popular') return (b.views ?? 0) - (a.views ?? 0);
    if (state.sortBy === 'recent')  return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
    return 0;
  });

  const buildGrid = () => {
    const grid = h('div', { class: 'categories-grid' });
    filtered.forEach(cat => {
      const totalWords = cat.stages.reduce((n, s) => n + s.words.length, 0);
      const stageFlow = h('div', { class: 'stage-flow' });
      if (cat.stages.length === 0) {
        stageFlow.append(h('span', { class: 'stage-flow-empty' }, '단계 없음'));
      } else {
        cat.stages.forEach(s => {
          const btn = h('button', { class: 'stage-pill-btn' }, s.name);
          btn.addEventListener('click', e => {
            e.stopPropagation();
            state.categoryId = cat.id;
            state.stageId = s.id;
            state.view = 'category';
            render();
            window.scrollTo(0, 0);
          });
          stageFlow.append(btn);
        });
      }
      const card = h('div', { class: 'category-card', onClick: () => goCategory(cat.id) },
        h('div', { class: 'category-card-name' }, cat.name),
        stageFlow,
        h('div', { class: 'category-card-meta' }, `단어 ${totalWords}개`)
      );
      grid.append(card);
    });
    return grid;
  };

  // 검색창이 이미 있으면 input을 건드리지 않고 grid만 교체
  if (container.querySelector('.search-bar')) {
    container.querySelector('.categories-grid')?.replaceWith(buildGrid());
    container.querySelectorAll('.sort-tab').forEach((btn, i) => {
      if (SORTS[i]) btn.className = 'sort-tab' + (state.sortBy === SORTS[i].key ? ' active' : '');
    });
    return;
  }

  // 최초 렌더: 전체 구성
  const inp = h('input', { type: 'text', placeholder: '카테고리 또는 단어 검색...', value: state.searchQuery });
  inp.addEventListener('input', () => {
    state.searchQuery = inp.value;
    renderHome(container);
  });

  const sortBar = h('div', { class: 'sort-bar' });
  SORTS.forEach(s => {
    sortBar.append(h('button',
      { class: 'sort-tab' + (state.sortBy === s.key ? ' active' : ''), onClick: () => { state.sortBy = s.key; renderHome(container); } },
      s.label
    ));
  });

  container.replaceChildren(
    h('div', { class: 'page-header' }, h('h1', { class: 'page-title' }, '업계별 탐색')),
    h('div', { class: 'search-bar' }, h('span', { class: 'search-icon' }, '🔍'), inp),
    sortBar,
    buildGrid()
  );
}

function renderAllWords(container) {
  const query = state.searchQuery.toLowerCase().trim();
  const filterCatId = state.allWordsFilterCat;

  let allWords = [];
  for (const cat of state.data.categories) {
    if (filterCatId && cat.id !== filterCatId) continue;
    for (const stage of cat.stages) {
      for (const word of stage.words) {
        allWords.push({ word, cat, stage });
      }
    }
  }
  if (query) {
    allWords = allWords.filter(({ word }) =>
      word.term.toLowerCase().includes(query) ||
      word.definition.toLowerCase().includes(query)
    );
  }
  if (state.allWordsSortBy === 'recent') {
    allWords.sort((a, b) => {
      const ta = parseInt(a.word.id.split('-')[1]) || 0;
      const tb = parseInt(b.word.id.split('-')[1]) || 0;
      return tb - ta;
    });
  } else if (state.allWordsSortBy === 'popular') {
    allWords.sort((a, b) => (b.word.views ?? 0) - (a.word.views ?? 0));
  } else {
    allWords.sort((a, b) => a.word.term.localeCompare(b.word.term, 'ko'));
  }

  const buildSortBar = () => {
    const bar = h('div', { class: 'sort-bar' });
    [{ key: 'alpha', label: '가나다순' }, { key: 'popular', label: '인기순' }, { key: 'recent', label: '최신순' }].forEach(s => {
      bar.append(h('button', {
        class: 'sort-tab' + (state.allWordsSortBy === s.key ? ' active' : ''),
        onClick: () => { state.allWordsSortBy = s.key; renderAllWords(container); }
      }, s.label));
    });
    return bar;
  };

  const buildFilterBar = () => {
    const bar = h('div', { class: 'all-words-filter-bar' });
    bar.append(h('button', {
      class: 'filter-chip' + (!filterCatId ? ' active' : ''),
      onClick: () => { state.allWordsFilterCat = null; renderAllWords(container); }
    }, '전체'));
    for (const cat of state.data.categories) {
      bar.append(h('button', {
        class: 'filter-chip' + (filterCatId === cat.id ? ' active' : ''),
        onClick: () => { state.allWordsFilterCat = cat.id; renderAllWords(container); }
      }, cat.name));
    }
    return bar;
  };

  const buildWordList = () => {
    const panel = h('div', { class: 'words-panel' });
    panel.append(
      h('div', { class: 'words-panel-header' },
        h('span', { class: 'words-panel-title' }, '단어 목록'),
        h('span', { class: 'words-count' }, `${allWords.length}개`)
      )
    );
    if (allWords.length === 0) {
      panel.append(emptyState('📭', '단어가 없습니다', query ? '검색어를 바꿔보세요' : '단어를 추가해 보세요'));
    } else {
      allWords.forEach(({ word, cat, stage }) => {
        panel.append(
          h('div', { class: 'word-item' },
            h('div', { style: 'display:flex;align-items:flex-start;justify-content:space-between;gap:12px' },
              h('div', { class: 'word-item-term', style: 'margin-bottom:0' }, word.term),
              h('div', { style: 'display:flex;gap:4px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end' },
                h('button', { class: 'tag tag-button', onClick: () => goCategory(cat.id) }, cat.name),
                h('span', { class: 'tag' }, stage.name)
              )
            ),
            h('div', { class: 'word-item-def', style: 'margin-top:4px' }, word.definition || '설명 없음')
          )
        );
      });
    }
    return panel;
  };

  if (container.querySelector('.search-bar')) {
    container.querySelector('.sort-bar')?.replaceWith(buildSortBar());
    container.querySelector('.all-words-filter-bar')?.replaceWith(buildFilterBar());
    container.querySelector('.words-panel')?.replaceWith(buildWordList());
    return;
  }

  const inp = h('input', { type: 'text', placeholder: '단어 검색...', value: state.searchQuery });
  inp.addEventListener('input', () => {
    state.searchQuery = inp.value;
    renderAllWords(container);
  });

  container.replaceChildren(
    h('div', { class: 'page-header' }, h('h1', { class: 'page-title' }, '전체 단어')),
    buildSortBar(),
    buildFilterBar(),
    h('div', { class: 'search-bar' }, h('span', { class: 'search-icon' }, '🔍'), inp),
    buildWordList()
  );
}

function renderCategory(container) {
  const cat = state.data.categories.find(c => c.id === state.categoryId);
  if (!cat) { goHome(); return; }

  const stage = cat.stages.find(s => s.id === state.stageId) ?? null;

  // Back button
  const backBtn = h('button', { class: 'back-btn', onClick: goHome }, '← 목록으로');

  // Page header
  const pageHeader = h('div', { class: 'page-header' },
    h('h1', { class: 'page-title' }, cat.name)
  );

  // Stage flow bar
  const flowBar = h('div', { class: 'stage-flow-bar' });
  if (cat.stages.length === 0) {
    flowBar.append(h('span', { class: 'stage-flow-empty' }, '단계가 없습니다. 단계를 추가해 보세요.'));
  } else {
    flowBar.append(h('button', {
      class: 'stage-tab' + (state.stageId === 'all' ? ' active' : ''),
      onClick: () => selectStage('all')
    }, '전체'));
    cat.stages.forEach(s => {
      const tab = h('button', { class: 'stage-tab' + (s.id === state.stageId ? ' active' : ''), onClick: () => selectStage(s.id) }, s.name);
      flowBar.append(tab);
    });
  }

  // Words panel
  const wordsPanel = h('div', { class: 'words-panel' });

  if (state.stageId === 'all') {
    const allCatWords = cat.stages.flatMap(s => s.words.map(w => ({ word: w, stage: s })));
    wordsPanel.append(h('div', { class: 'words-panel-header' },
      h('span', { class: 'words-panel-title' }, '전체'),
      h('span', { class: 'words-count' }, `${allCatWords.length}개`)
    ));
    if (allCatWords.length === 0) {
      wordsPanel.append(emptyState('📝', '아직 단어가 없습니다', '단어를 추가해 보세요'));
    } else {
      allCatWords.forEach(({ word: w, stage: s }) => {
        wordsPanel.append(
          h('div', { class: 'word-item' },
            h('div', { style: 'display:flex;align-items:flex-start;justify-content:space-between;gap:12px' },
              h('div', { class: 'word-item-term', style: 'margin-bottom:0' }, w.term),
              h('button', { class: 'tag tag-button', style: 'flex-shrink:0', onClick: () => selectStage(s.id) }, s.name)
            ),
            h('div', { class: 'word-item-def', style: 'margin-top:4px' }, w.definition || '설명 없음')
          )
        );
      });
    }
  } else if (!stage) {
    wordsPanel.append(emptyState('📂', '단계를 선택하세요', ''));
  } else {
    const panelHeader = h('div', { class: 'words-panel-header' },
      h('span', { class: 'words-panel-title' }, `${stage.name} 단어 목록`),
      h('span', { class: 'words-count' }, `${stage.words.length}개`)
    );
    wordsPanel.append(panelHeader);

    if (stage.words.length === 0) {
      wordsPanel.append(emptyState('📝', '아직 단어가 없습니다', '위의 [+ 용어 추가] 버튼으로 첫 단어를 등록해 보세요'));
    } else {
      stage.words.forEach(w => {
        const item = h('div', { class: 'word-item' },
          h('div', { class: 'word-item-term' }, w.term),
          h('div', { class: 'word-item-def' }, w.definition || '설명 없음')
        );
        wordsPanel.append(item);
      });
    }
  }

  container.replaceChildren(backBtn, pageHeader, flowBar, wordsPanel);
}

function emptyState(icon, title, sub) {
  return h('div', { class: 'empty-state' },
    h('div', { class: 'empty-icon' }, icon),
    h('div', { class: 'empty-title' }, title),
    sub ? h('div', { class: 'empty-sub' }, sub) : null
  );
}

// ── Modals ──────────────────────────────────────────────────────────────────
function openModal(content) {
  const root = document.getElementById('modal-root');
  const overlay = h('div', { class: 'modal-overlay', onClick: e => { if (e.target === overlay) closeModal(); } },
    h('div', { class: 'modal' }, ...content)
  );
  root.replaceChildren(overlay);
  // focus first input after paint
  requestAnimationFrame(() => root.querySelector('input, textarea')?.focus());
}

function closeModal() {
  document.getElementById('modal-root').innerHTML = '';
}

function openWordWizard() {
  let selectedCat = null;
  let selectedStage = null;

  function step1() {
    let newCatEl;
    const addCat = () => {
      const name = newCatEl.value.trim();
      if (!name) { newCatEl.focus(); return; }
      const cat = { id: uid(), name, stages: [] };
      state.data.categories.push(cat);
      save();
      selectedCat = cat;
      step2();
    };
    openModal([
      h('div', { class: 'modal-title' }, '용어 추가'),
      h('div', { class: 'form-group' },
        h('label', { class: 'form-label' }, '업계 선택'),
        state.data.categories.length > 0
          ? h('div', { style: 'max-height:200px;overflow-y:auto;margin-bottom:4px' },
              ...state.data.categories.map(cat =>
                h('button', {
                  class: 'btn btn-ghost',
                  style: 'width:100%;justify-content:flex-start;margin-bottom:6px',
                  onClick: () => { selectedCat = cat; step2(); }
                }, cat.name)
              )
            )
          : h('p', { style: 'color:var(--text-faint);font-size:13px;margin-bottom:8px' }, '아직 업계가 없습니다.')
      ),
      h('div', { class: 'form-group' },
        h('label', { class: 'form-label' }, '새 업계 추가'),
        h('div', { style: 'display:flex;gap:8px' },
          (newCatEl = h('input', { class: 'form-input', type: 'text', placeholder: '업계 이름 (예: IT, 패션, 건축...)' })),
          h('button', { class: 'btn btn-secondary', style: 'flex-shrink:0', onClick: addCat }, '추가')
        )
      ),
      h('div', { class: 'modal-actions' },
        h('button', { class: 'btn btn-ghost', onClick: closeModal }, '취소')
      )
    ]);
    newCatEl.addEventListener('keydown', e => { if (e.key === 'Enter') addCat(); });
  }

  function step2() {
    let newStageEl;
    const addStage = () => {
      const name = newStageEl.value.trim();
      if (!name) { newStageEl.focus(); return; }
      const stage = { id: uid(), name, words: [] };
      selectedCat.stages.push(stage);
      save();
      selectedStage = stage;
      step3();
    };
    openModal([
      h('div', { class: 'modal-title' }, selectedCat.name),
      h('div', { class: 'form-group' },
        h('label', { class: 'form-label' }, '카테고리 선택'),
        selectedCat.stages.length > 0
          ? h('div', { style: 'max-height:200px;overflow-y:auto;margin-bottom:4px' },
              ...selectedCat.stages.map(s =>
                h('button', {
                  class: 'btn btn-ghost',
                  style: 'width:100%;justify-content:flex-start;margin-bottom:6px',
                  onClick: () => { selectedStage = s; step3(); }
                }, s.name)
              )
            )
          : h('p', { style: 'color:var(--text-faint);font-size:13px;margin-bottom:8px' }, '아직 카테고리가 없습니다.')
      ),
      h('div', { class: 'form-group' },
        h('label', { class: 'form-label' }, '새 카테고리 추가'),
        h('div', { style: 'display:flex;gap:8px' },
          (newStageEl = h('input', { class: 'form-input', type: 'text', placeholder: '카테고리 이름 (예: 기획, 제작, 배포...)' })),
          h('button', { class: 'btn btn-secondary', style: 'flex-shrink:0', onClick: addStage }, '추가')
        )
      ),
      h('div', { class: 'modal-actions' },
        h('button', { class: 'btn btn-ghost', onClick: step1 }, '← 뒤로'),
        h('button', { class: 'btn btn-ghost', onClick: closeModal }, '취소')
      )
    ]);
    newStageEl.addEventListener('keydown', e => { if (e.key === 'Enter') addStage(); });
  }

  function step3() {
    let termEl, defEl, nicknameEl;
    const submit = () => {
      const term = termEl.value.trim();
      if (!term) { termEl.style.borderColor = 'var(--red)'; termEl.focus(); return; }
      if (!nicknameEl.value.trim()) { nicknameEl.style.borderColor = 'var(--red)'; nicknameEl.focus(); return; }
      const author = { nickname: nicknameEl.value.trim() };
      selectedStage.words.push({ id: uid(), term, definition: defEl.value.trim(), author });
      selectedCat.updatedAt = Date.now();
      save();
      closeModal();
      render();
    };
    openModal([
      h('div', { class: 'modal-title' }, '용어 추가'),
      h('p', { style: 'font-size:13px;color:var(--text-muted);margin:-14px 0 20px' }, `${selectedCat.name}  ›  ${selectedStage.name}`),
      h('div', { class: 'form-group' },
        h('label', { class: 'form-label' }, '용어'),
        (termEl = h('input', { class: 'form-input', type: 'text', placeholder: '용어를 입력하세요' }))
      ),
      h('div', { class: 'form-group' },
        h('label', { class: 'form-label' }, '설명 / 정의'),
        (defEl = h('textarea', { class: 'form-input', placeholder: '용어의 뜻이나 설명을 입력하세요' }))
      ),
      h('div', { class: 'form-group' },
        h('label', { class: 'form-label' }, '닉네임'),
        (nicknameEl = h('input', { class: 'form-input', type: 'text', placeholder: '예: 홍길동' }))
      ),
      h('div', { class: 'modal-actions' },
        h('button', { class: 'btn btn-ghost', onClick: step2 }, '← 뒤로'),
        h('button', { class: 'btn btn-ghost', onClick: closeModal }, '취소'),
        h('button', { class: 'btn btn-primary', onClick: submit }, '추가')
      )
    ]);
    termEl.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }

  step1();
}

// Add category
function openAddCategoryModal() {
  let nameEl;
  openModal([
    h('div', { class: 'modal-title' }, '새 카테고리 추가'),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '업계 / 카테고리 이름'),
      (nameEl = h('input', { class: 'form-input', type: 'text', placeholder: '예: 광고, IT, 패션, 건축, 영상...' }))
    ),
    h('div', { class: 'modal-actions' },
      h('button', { class: 'btn btn-ghost', onClick: closeModal }, '취소'),
      h('button', { class: 'btn btn-primary', onClick: () => addCategory(nameEl.value) }, '추가')
    )
  ]);
  nameEl.addEventListener('keydown', e => { if (e.key === 'Enter') addCategory(nameEl.value); });
}

function addCategory(name) {
  name = name.trim();
  if (!name) { shakeInput(); return; }
  const cat = { id: uid(), name, stages: [] };
  state.data.categories.push(cat);
  save();
  closeModal();
  goCategory(cat.id);
}

// Add stage
function openAddStageModal(catId) {
  let nameEl;
  openModal([
    h('div', { class: 'modal-title' }, '새 단계 추가'),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '단계 이름'),
      (nameEl = h('input', { class: 'form-input', type: 'text', placeholder: '예: 기획, 제작, 검수, 배포...' }))
    ),
    h('div', { class: 'modal-actions' },
      h('button', { class: 'btn btn-ghost', onClick: closeModal }, '취소'),
      h('button', { class: 'btn btn-primary', onClick: () => addStage(catId, nameEl.value) }, '추가')
    )
  ]);
  nameEl.addEventListener('keydown', e => { if (e.key === 'Enter') addStage(catId, nameEl.value); });
}

function addStage(catId, name) {
  name = name.trim();
  if (!name) { shakeInput(); return; }
  const cat = state.data.categories.find(c => c.id === catId);
  if (!cat) return;
  const stage = { id: uid(), name, words: [] };
  cat.stages.push(stage);
  state.stageId = stage.id;
  save();
  closeModal();
  render();
}

// Add word
function openAddWordModal(catId, stageId) {
  let termEl, defEl, nicknameEl;
  openModal([
    h('div', { class: 'modal-title' }, '새 용어 추가'),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '용어'),
      (termEl = h('input', { class: 'form-input', type: 'text', placeholder: '용어를 입력하세요' }))
    ),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '설명 / 정의'),
      (defEl = h('textarea', { class: 'form-input', placeholder: '용어의 뜻이나 설명을 입력하세요' }))
    ),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '닉네임'),
      (nicknameEl = h('input', { class: 'form-input', type: 'text', placeholder: '예: 홍길동' }))
    ),
    h('div', { class: 'modal-actions' },
      h('button', { class: 'btn btn-ghost', onClick: closeModal }, '취소'),
      h('button', { class: 'btn btn-primary', onClick: () => {
        if (!termEl.value.trim()) { termEl.style.borderColor = 'var(--red)'; termEl.focus(); return; }
        if (!nicknameEl.value.trim()) { nicknameEl.style.borderColor = 'var(--red)'; nicknameEl.focus(); return; }
        addWord(catId, stageId, termEl.value, defEl.value, nicknameEl.value);
      } }, '추가')
    )
  ]);
}

function addWord(catId, stageId, term, definition, nickname = '') {
  term = term.trim();
  if (!term) { shakeInput(); return; }
  const cat = state.data.categories.find(c => c.id === catId);
  const stage = cat?.stages.find(s => s.id === stageId);
  if (!stage) return;
  stage.words.push({ id: uid(), term, definition: definition.trim(), author: { nickname: nickname.trim() } });
  const cat2 = state.data.categories.find(c => c.id === catId);
  if (cat2) cat2.updatedAt = Date.now();
  save();
  closeModal();
  render();
}

// Shake animation for empty input feedback
function shakeInput() {
  const inp = document.querySelector('#modal-root .form-input');
  if (!inp) return;
  inp.style.borderColor = 'var(--red)';
  inp.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(0)' }
  ], { duration: 300 });
  inp.focus();
}

// ── Global keyboard shortcuts ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.getElementById('logo-btn').addEventListener('click', goHome);

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  // 로딩 표시
  document.getElementById('app').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text-faint);font-size:15px">불러오는 중...</div>';

  state.data = await loadData();
  render();

  // 다른 사용자가 데이터 변경하면 실시간 반영
  supabase
    .channel('app_data_changes')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_data', filter: 'id=eq.singleton' }, payload => {
      state.data = payload.new.data;
      render();
    })
    .subscribe();
}

init();

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
            { id: 'w-p3', term: '베다/빼다', definition: '남는 공간이 없도록 잉크를 100% 올리는 것, 농도나 명암없이 100% 잉크로 인쇄하는 부분' }
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
      name: '건설',
      stages: [
        {
          id: 'st-arch-work', name: '작업',
          words: [
            { id: 'w-arch1', term: '단도리', definition: '채비 또는 정리정돈. 현장에서 작업을 시작하기 전 준비하는 과정' },
            { id: 'w-arch2', term: '나라시', definition: '고르기. 땅바닥이나 모래 등을 평평하게 펴서 고르는 작업' },
            { id: 'w-arch3', term: '야리끼리', definition: '정해진 물량을 다 끝내면 그날 일을 마치는 능력제/도급 작업' },
            { id: 'w-arch4', term: '시마이', definition: '작업의 마감이나 끝' }
          ]
        },
        {
          id: 'st-arch-tools', name: '자재 및 공구',
          words: [
            { id: 'w-arch5', term: '다루끼 / 가꾸목', definition: "목재의 두께에 따른 각목으로, '다루끼'는 얇은 각목, '가꾸목'은 두꺼운 각목을 뜻함" },
            { id: 'w-arch6', term: '빠루', definition: '못을 뽑거나 물체를 뜯어낼 때 쓰는 쇠지레(노루발못뽑이)' },
            { id: 'w-arch7', term: '고데', definition: '미장 작업이나 퍼티를 바를 때 쓰는 흙손(헤라)' },
            { id: 'w-arch8', term: '도이시', definition: '그라인더 등에 장착해 사용하는 숫돌' },
            { id: 'w-arch9', term: '다마', definition: '둥근 형태의 구슬이나 전구, 볼트/너트의 규격(지름)' }
          ]
        },
        {
          id: 'st-arch-parts', name: '시공 부위 및 도면',
          words: [
            { id: 'w-arch10', term: '데스리', definition: '발코니나 베란다 등의 난간' },
            { id: 'w-arch11', term: '가구부찌', definition: '문틀이나 창문 주위의 틀인 문선' },
            { id: 'w-arch12', term: '메지', definition: '타일이나 벽돌 사이의 이음새인 줄눈' },
            { id: 'w-arch13', term: '우라', definition: '물건이나 작업의 뒤' }
          ]
        },
        {
          id: 'st-arch-site', name: '현장',
          words: [
            { id: 'w-arch14', term: '함바', definition: '건설 현장이나 공사장 안에 마련된 임시 간이 식당' }
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
      name: '방송',
      stages: [
        {
          id: 'st-broadcast-planning', name: '기획',
          words: [
            { id: 'w-vid1', term: '야마', definition: '이야기의 핵심, 주제, 가장 중요한 포인트', example: '이번 촬영분의 야마가 뭐야?' },
            { id: 'w-vid2', term: '니쥬', definition: '서사를 이해하기 위한 밑밥, 복선, 도입부', example: '니쥬 없이 훅 들어오네.' },
            { id: 'w-vid3', term: '오도시', definition: '클라이맥스, 감정이나 웃음이 가장 크게 터지는 지점', example: '여기가 오도시야.' },
            { id: 'w-vid4', term: '나래비', definition: '특별한 구조 없이 장면만 나열한 상태', example: '이건 그냥 나래비잖아.' },
            { id: 'w-vid5', term: '와꾸', definition: '이야기의 구조, 기획의 틀, 전체 프레임', example: '와꾸를 먼저 짜보자.' }
          ]
        },
        {
          id: 'st-broadcast-directing', name: '연출',
          words: [
            { id: 'w-vid6', term: '시바이', definition: '웃음 포인트나 재미 요소', example: '시바이가 너무 없는데?' },
            { id: 'w-vid7', term: '데꼬보꼬', definition: '장면에 재미나 변화를 주는 것', example: '데꼬보꼬가 좀 있어야 돼.' },
            { id: 'w-vid8', term: '니마이', definition: '진지하고 정공법적인 분위기', example: '여긴 니마이로 가야 돼.' },
            { id: 'w-vid9', term: '쌈마이', definition: '키치하고 B급스러운 분위기, 다소 저속한 웃음', example: '너무 쌈마이한데?' },
            { id: 'w-vid10', term: '바레', definition: '스포일러, 미리 드러나면 안 되는 정보', example: '결과 바레 안 나게 해.' }
          ]
        },
        {
          id: 'st-broadcast-shooting', name: '촬영',
          words: [
            { id: 'w-vid11', term: '데모찌', definition: '삼각대 없이 손으로 직접 들고 촬영하는 핸드헬드 촬영', example: '데모찌로 갈게.' },
            { id: 'w-vid12', term: '데마이/데마에', definition: '걸쳐 찍기. 카메라 가까이에 피사체를 두어 입체감을 만드는 촬영 기법. 또는 카메라 앵글 앞쪽에 걸리는 것', example: '소품을 데마이에 걸까요? / 데마에 하나 걸고 찍자.' }
          ]
        }
      ]
    },
    {
      id: 'cat-film',
      name: '영화',
      stages: [
        {
          id: 'st-film-shooting', name: '촬영',
          words: [
            { id: 'w-film1', term: '누끼', definition: '모아 찍기. 앵글이 같은 커트를 하나로 모아서 한꺼번에 촬영하는 것', example: '오늘 누끼 따자(몰아서 찍자)' },
            { id: 'w-film2', term: '데모찌', definition: '삼각대 없이 손으로 직접 들고 촬영하는 핸드헬드 촬영', example: '데모찌로 갈게.' },
            { id: 'w-film3', term: '데마이/데마에', definition: '걸쳐 찍기. 카메라 가까이에 피사체를 두어 입체감을 만드는 촬영 기법. 또는 카메라 앵글 앞쪽에 걸리는 것', example: '소품을 데마이에 걸까요? / 데마에 하나 걸고 찍자.' },
            { id: 'w-film4', term: '두레나시', definition: '재촬영' }
          ]
        },
        {
          id: 'st-film-site', name: '현장',
          words: [
            { id: 'w-film5', term: '시마이', definition: '작업의 마감이나 끝' },
            { id: 'w-film6', term: '니쥬', definition: '깔판, 마룻바닥. 바닥에 추가 단을 깔고, 그 위에 세트를 지을 때 바닥에 깔린 마루를 지칭함' },
            { id: 'w-film7', term: '데꼬보꼬', definition: '요철. 울퉁불퉁. 울룩불룩. 평평한 작업이 필요한 부분' },
            { id: 'w-film8', term: '바라시', definition: '촬영 종료 후 짐을 챙기는 것. 촬영장에서 철수하는 것' },
            { id: 'w-film9', term: '오사마이/오사마리', definition: '마지막 촬영' },
            { id: 'w-film10', term: '혼방', definition: '리허설이 아닌 실제 본 촬영 시작' },
            { id: 'w-film11', term: '히로시', definition: '앵글을 잡거나 배우의 동선을 미리 표시할 때 바닥에 붙이는 마킹(청테이프)' }
          ]
        },
        {
          id: 'st-film-actor', name: '배우',
          words: [
            { id: 'w-film12', term: '가께모치', definition: '배우나 감독이 동시에 두 개 이상의 작품에 참여하는 것.' },
            { id: 'w-film13', term: '가에다마', definition: '대역' },
            { id: 'w-film14', term: '니마이', definition: '주연급 연기자, 일류 배우' }
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
      name: 'IT',
      stages: [
        {
          id: 'st-it-work', name: '업무',
          words: [
            { id: 'w-it1', term: '킥오프(Kick-off)', definition: '시작', example: '킥오프는 4월 3일입니다.(첫 술을 뜨는 건 4월 3일입니다.)' },
            { id: 'w-it2', term: '애자일(Agile)', definition: '유연하고 반응성이 높은', example: '우리 조직은 애자일하게 운영할 거예요.' },
            { id: 'w-it3', term: '린(Lean)', definition: '불필요한 낭비 요소를 제거하고, 빠르고 효율적으로 실행하는 것', example: '이 작업은 린하게 시작해보시죠.' },
            { id: 'w-it4', term: '데일리 스크럼', definition: '일일 아침회의' },
            { id: 'w-it5', term: '스프린트', definition: '업무 기간 단위' }
          ]
        },
        {
          id: 'st-it-service', name: '서비스',
          words: [
            { id: 'w-it6', term: 'KPI(Key Performance Indicator)', definition: '성과측정방식' },
            { id: 'w-it7', term: '리텐션(Retention)', definition: '유지', example: '리텐션이 떨어진다.(사용자가 금방 이탈한다.)' },
            { id: 'w-it8', term: '페이드아웃(Phased-out/Faded-out)', definition: '특정 기술, 서비스, 하드웨어 또는 소프트웨어 기능의 지원 및 사용을 점진적으로 중단하고 퇴출시키는 과정', example: '이 서비스는 곧 페이드아웃 할 거예요.' }
          ]
        },
        {
          id: 'st-it-business', name: '사업',
          words: [
            { id: 'w-it9', term: '케파(Capacity)', definition: '작업 처리 능력, 수용량, 가용 가능한 리소스(자원), 여유.', example: '케파 충분해요?(리소스 충분해요?)' },
            { id: 'w-it10', term: '피봇(Pivot)', definition: '사업이나 제품의 핵심 방향을 전환하는 것', example: '사용자 반응을 분석해 보니 현재 모델로는 성장하기 어려워 보여서 사업 방향을 피봇하기로 결정했어요.' },
            { id: 'w-it11', term: '런웨이(Runway)', definition: '현재 보유한 현금으로 추가 투자나 수익 없이 회사를 운영할 수 있는 기간', example: '런웨이 5개월 남았어요.' }
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
      name: '광고',
      stages: [
        {
          id: 'st-ad-planning', name: '기획',
          words: [
            { id: 'w-ad1', term: '히뜩하다', definition: '기발하고 재미있는, 새롭고 신선한 것을 지칭할 때 사용' },
            { id: 'w-ad2', term: '와꾸', definition: '이야기의 구조, 기획의 틀, 전체 프레임', example: '와꾸를 먼저 짜보자.' },
            { id: 'w-ad3', term: '부러뜨리다', definition: '여러 가지 아이디어 중 최종안을 결정하다' }
          ]
        },
        {
          id: 'st-ad-production', name: '제작/편집',
          words: [
            { id: 'w-ad4', term: '바리치다', definition: 'Variation하다의 줄임말. 하나의 소재를 다양한 버전으로 만드는 것' },
            { id: 'w-ad5', term: '커트바리', definition: '콘티를 컷 바이 컷으로 나눠서 구성한다는 의미' },
            { id: 'w-ad6', term: '닦는다', definition: '영상의 색감이나 질감을 다듬거나, 아이디어를 더욱 개선한다는 뜻' },
            { id: 'w-ad7', term: '오사마이/오사마리', definition: '최종적인 정리 과정' }
          ]
        },
        {
          id: 'st-ad-design', name: '디자인/연출',
          words: [
            { id: 'w-ad8', term: '있어빌리티하다', definition: '있어 보인다 + Ability의 합성어. 광고주가 광고를 마음에 들어할 것 같다. 있어보이게 만든다.' },
            { id: 'w-ad9', term: '데꼬보꼬', definition: '장면에 재미나 변화를 주는 것', example: '데꼬보꼬가 좀 있어야 돼.' },
            { id: 'w-ad10', term: '히까리', definition: '빛. 보통 자막에 빛이 흐르는 듯한 효과를 줄 때 많이 사용', example: '엔딩 로고에 히까리 좀 주세요' },
            { id: 'w-ad11', term: '구다리', definition: '구역 혹은 영역', example: '거기 카피 구다리 좀 키워봐' }
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
const VIEW_STATE_KEY = 'fielddict:viewState';

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
  theme: localStorage.getItem('theme') || 'light',
};

function persistViewState() {
  localStorage.setItem(VIEW_STATE_KEY, JSON.stringify({
    view: state.view,
    categoryId: state.categoryId,
    stageId: state.stageId,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    allWordsFilterCat: state.allWordsFilterCat,
    allWordsSortBy: state.allWordsSortBy,
  }));
}

function restoreViewState() {
  try {
    const saved = JSON.parse(localStorage.getItem(VIEW_STATE_KEY));
    if (!saved || !['home', 'all-words', 'category'].includes(saved.view)) return;

    state.view = saved.view;
    state.categoryId = saved.categoryId ?? null;
    state.stageId = saved.stageId ?? null;
    state.searchQuery = saved.searchQuery ?? '';
    state.sortBy = saved.sortBy ?? 'alpha';
    state.allWordsFilterCat = saved.allWordsFilterCat ?? null;
    state.allWordsSortBy = saved.allWordsSortBy ?? 'alpha';

    if (state.view === 'category') {
      const cat = state.data.categories.find(c => c.id === state.categoryId);
      if (!cat) {
        state.view = 'home';
        state.categoryId = null;
        state.stageId = null;
      } else if (state.stageId !== 'all' && !cat.stages.some(s => s.id === state.stageId)) {
        state.stageId = cat.stages.length > 0 ? 'all' : null;
      }
    }

    if (state.allWordsFilterCat && !state.data.categories.some(c => c.id === state.allWordsFilterCat)) {
      state.allWordsFilterCat = null;
    }
  } catch {
    localStorage.removeItem(VIEW_STATE_KEY);
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', state.theme);
  applyTheme();
  render();
}

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

function goCategoryStage(catId, stageId) {
  const cat = state.data.categories.find(c => c.id === catId);
  if (!cat) return;
  cat.views = (cat.views ?? 0) + 1;
  save();
  state.view = 'category';
  state.categoryId = catId;
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

  persistViewState();
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

  headerActions.append(
    h('button', {
      class: 'btn btn-ghost theme-toggle',
      title: state.theme === 'dark' ? '라이트 모드' : '다크 모드',
      'aria-label': state.theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환',
      onClick: toggleTheme
    }, state.theme === 'dark' ? '☀' : '☾')
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
  persistViewState();
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
  persistViewState();
  const query = state.searchQuery.toLowerCase().trim();
  const filterCatId = state.allWordsFilterCat;

  let wordEntries = [];
  for (const cat of state.data.categories) {
    if (filterCatId && cat.id !== filterCatId) continue;
    for (const stage of cat.stages) {
      for (const word of stage.words) {
        wordEntries.push({ word, cat, stage });
      }
    }
  }
  if (query) {
    wordEntries = wordEntries.filter(({ word }) =>
      word.term.toLowerCase().includes(query) ||
      word.definition.toLowerCase().includes(query) ||
      (word.example ?? '').toLowerCase().includes(query)
    );
  }
  if (state.allWordsSortBy === 'recent') {
    wordEntries.sort((a, b) => {
      const ta = parseInt(a.word.id.split('-')[1]) || 0;
      const tb = parseInt(b.word.id.split('-')[1]) || 0;
      return tb - ta;
    });
  } else if (state.allWordsSortBy === 'popular') {
    wordEntries.sort((a, b) => (b.word.views ?? 0) - (a.word.views ?? 0));
  } else {
    wordEntries.sort((a, b) => a.word.term.localeCompare(b.word.term, 'ko'));
  }

  const groupedWords = [];
  const groupedByTerm = new Map();
  for (const entry of wordEntries) {
    const key = entry.word.term.trim().toLowerCase();
    const group = groupedByTerm.get(key);
    if (!group) {
      const nextGroup = {
        term: entry.word.term,
        senses: [{ word: entry.word, contexts: [{ cat: entry.cat, stage: entry.stage }] }]
      };
      groupedByTerm.set(key, nextGroup);
      groupedWords.push(nextGroup);
      continue;
    }
    const senseKey = `${entry.word.definition ?? ''}::${entry.word.example ?? ''}`.trim().toLowerCase();
    let sense = group.senses.find(item =>
      `${item.word.definition ?? ''}::${item.word.example ?? ''}`.trim().toLowerCase() === senseKey
    );
    if (!sense) {
      sense = { word: entry.word, contexts: [] };
      group.senses.push(sense);
    }
    if (!sense.contexts.some(context => context.cat.id === entry.cat.id && context.stage.id === entry.stage.id)) {
      sense.contexts.push({ cat: entry.cat, stage: entry.stage });
    }
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
        h('span', { class: 'words-count' }, `${groupedWords.length}개`)
      )
    );
    if (groupedWords.length === 0) {
      panel.append(emptyState('📭', '단어가 없습니다', query ? '검색어를 바꿔보세요' : '단어를 추가해 보세요'));
    } else {
      groupedWords.forEach(({ term, senses }) => {
        panel.append(
          h('div', { class: 'word-item' },
            h('div', { class: 'word-item-term', style: 'margin-bottom:0' }, term),
            senses.map(({ word, contexts }, senseIndex) =>
              h('div', { class: 'word-sense' },
                h('div', { class: 'word-sense-body' },
                  h('div', { class: 'word-item-def' }, (senses.length > 1 ? `${senseIndex + 1}. ` : '') + (word.definition || '설명 없음')),
                  wordExample(word)
                ),
                h('div', { class: 'word-sense-tags' },
                  contexts.flatMap(({ cat, stage }) =>
                    [
                      h('button', { class: 'tag tag-category tag-button', onClick: () => goCategory(cat.id) }, cat.name),
                      h('button', {
                        class: 'tag tag-stage tag-button',
                        title: `${cat.name} > ${stage.name}`,
                        onClick: () => goCategoryStage(cat.id, stage.id)
                      }, stage.name)
                    ]
                  )
                )
              )
            )
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

function wordExample(word) {
  return word.example
    ? h('div', { class: 'word-item-example' }, `"${word.example}"`)
    : null;
}

function renderCategory(container) {
  persistViewState();
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
    if (allCatWords.length === 0) {
      wordsPanel.append(emptyState('📝', '아직 단어가 없습니다', '단어를 추가해 보세요'));
    } else {
      allCatWords.forEach(({ word: w, stage: s }) => {
        wordsPanel.append(
          h('div', { class: 'word-item' },
            h('div', { style: 'display:flex;align-items:flex-start;justify-content:space-between;gap:12px' },
              h('div', { class: 'word-item-term', style: 'margin-bottom:0' }, w.term),
              h('button', { class: 'tag tag-stage tag-button', style: 'flex-shrink:0', onClick: () => selectStage(s.id) }, s.name)
            ),
            h('div', { class: 'word-item-def', style: 'margin-top:4px' }, w.definition || '설명 없음'),
            wordExample(w)
          )
        );
      });
    }
  } else if (!stage) {
    wordsPanel.append(emptyState('📂', '단계를 선택하세요', ''));
  } else {
    if (stage.words.length === 0) {
      wordsPanel.append(emptyState('📝', '아직 단어가 없습니다', '위의 [+ 용어 추가] 버튼으로 첫 단어를 등록해 보세요'));
    } else {
      stage.words.forEach(w => {
        const item = h('div', { class: 'word-item' },
          h('div', { class: 'word-item-term' }, w.term),
          h('div', { class: 'word-item-def' }, w.definition || '설명 없음'),
          wordExample(w)
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
  const NEW_CAT = '__new_category__';
  const NEW_STAGE = '__new_stage__';
  let catSelect, newCatGroup, newCatEl, stageSelect, newStageGroup, newStageEl, termEl, defEl, exampleEl, nicknameEl;

  const markInvalid = el => {
    el.style.borderColor = 'var(--red)';
    el.focus();
  };

  const selectedCategory = () => state.data.categories.find(c => c.id === catSelect.value);

  const updateNewFields = () => {
    const isNewCat = catSelect.value === NEW_CAT;
    const isNewStage = isNewCat || stageSelect.value === NEW_STAGE;
    if (newCatGroup) newCatGroup.style.display = isNewCat ? 'block' : 'none';
    if (newStageGroup) newStageGroup.style.display = isNewStage ? 'block' : 'none';
  };

  const refreshStageSelect = () => {
    const isNewCategory = catSelect.value === NEW_CAT;
    const cat = selectedCategory();

    stageSelect.replaceChildren();

    if (isNewCategory) {
      stageSelect.append(h('option', { value: NEW_STAGE }, '+ 새 카테고리 추가'));
      stageSelect.value = NEW_STAGE;
      stageSelect.setAttribute('disabled', 'true');
      updateNewFields();
      return;
    }

    if (!cat) {
      stageSelect.append(h('option', { value: '' }, '업계를 먼저 선택하세요'));
      stageSelect.setAttribute('disabled', 'true');
      updateNewFields();
      return;
    }

    stageSelect.removeAttribute('disabled');
    cat.stages.forEach(stage => {
      stageSelect.append(h('option', { value: stage.id }, stage.name));
    });
    stageSelect.append(h('option', { value: NEW_STAGE }, '+ 새 카테고리 추가'));

    if (cat.stages.length === 0) stageSelect.value = NEW_STAGE;
    updateNewFields();
  };

  const submit = () => {
    const isNewCat = catSelect.value === NEW_CAT;
    const isNewStage = isNewCat || stageSelect.value === NEW_STAGE;
    const newCatName = isNewCat ? newCatEl.value.trim() : '';
    const newStageName = isNewStage ? newStageEl.value.trim() : '';
    const term = termEl.value.trim();
    const nickname = nicknameEl.value.trim();

    let cat = isNewCat ? null : selectedCategory();
    if (!cat && !isNewCat) { markInvalid(catSelect); return; }
    if (isNewCat && !newCatName) { markInvalid(newCatEl); return; }
    if (!cat) {
      cat = { id: uid(), name: newCatName, stages: [] };
      state.data.categories.push(cat);
    }

    let stage = isNewStage ? null : cat.stages.find(s => s.id === stageSelect.value);
    if (!stage && !isNewStage) { markInvalid(stageSelect); return; }
    if (isNewStage && !newStageName) { markInvalid(newStageEl); return; }
    if (!stage) {
      stage = { id: uid(), name: newStageName, words: [] };
      cat.stages.push(stage);
    }

    if (!term) { markInvalid(termEl); return; }
    if (!nickname) { markInvalid(nicknameEl); return; }

    stage.words.push({ id: uid(), term, definition: defEl.value.trim(), example: exampleEl.value.trim(), author: { nickname } });
    cat.updatedAt = Date.now();
    save();
    closeModal();
    render();
  };

  catSelect = h('select', { class: 'form-input' },
    state.data.categories.length
      ? [
          ...state.data.categories.map(cat => h('option', { value: cat.id }, cat.name)),
          h('option', { value: NEW_CAT }, '+ 새 업계 추가')
        ]
      : h('option', { value: NEW_CAT }, '+ 새 업계 추가')
  );
  newCatEl = h('input', { class: 'form-input', type: 'text', placeholder: '새 업계 이름' });
  stageSelect = h('select', { class: 'form-input' });
  newStageEl = h('input', { class: 'form-input', type: 'text', placeholder: '새 카테고리 이름' });
  termEl = h('input', { class: 'form-input', type: 'text', placeholder: '용어를 입력하세요' });
  defEl = h('textarea', { class: 'form-input', placeholder: '용어의 뜻이나 설명을 입력하세요' });
  exampleEl = h('textarea', { class: 'form-input', placeholder: '예문을 입력하세요 (선택)' });
  nicknameEl = h('input', { class: 'form-input', type: 'text', placeholder: '예: 홍길동' });

  catSelect.addEventListener('change', refreshStageSelect);
  stageSelect.addEventListener('change', updateNewFields);
  termEl.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  nicknameEl.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

  refreshStageSelect();

  openModal([
    h('div', { class: 'modal-title' }, '용어 추가'),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '업계 선택'),
      catSelect
    ),
    (newCatGroup = h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '새 업계 이름'),
      newCatEl
    )),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '카테고리 선택'),
      stageSelect
    ),
    (newStageGroup = h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '새 카테고리 이름'),
      newStageEl
    )),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '용어'),
      termEl
    ),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '설명 / 정의'),
      defEl
    ),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '예문'),
      exampleEl
    ),
    h('div', { class: 'form-group' },
      h('label', { class: 'form-label' }, '닉네임'),
      nicknameEl
    ),
    h('div', { class: 'modal-actions' },
      h('button', { class: 'btn btn-ghost', onClick: closeModal }, '취소'),
      h('button', { class: 'btn btn-primary', onClick: submit }, '추가')
    )
  ]);
  updateNewFields();
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
  let termEl, defEl, exampleEl, nicknameEl;
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
      h('label', { class: 'form-label' }, '예문'),
      (exampleEl = h('textarea', { class: 'form-input', placeholder: '예문을 입력하세요 (선택)' }))
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
        addWord(catId, stageId, termEl.value, defEl.value, nicknameEl.value, exampleEl.value);
      } }, '추가')
    )
  ]);
}

function addWord(catId, stageId, term, definition, nickname = '', example = '') {
  term = term.trim();
  if (!term) { shakeInput(); return; }
  const cat = state.data.categories.find(c => c.id === catId);
  const stage = cat?.stages.find(s => s.id === stageId);
  if (!stage) return;
  stage.words.push({ id: uid(), term, definition: definition.trim(), example: example.trim(), author: { nickname: nickname.trim() } });
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
applyTheme();

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  // 로딩 표시
  document.getElementById('app').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text-faint);font-size:15px">불러오는 중...</div>';

  state.data = await loadData();
  restoreViewState();
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

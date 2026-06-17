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
            { id: 'w-p4', term: '하리꼬미', definition: '터잡기. 인쇄 전 인쇄면을 큰 용지에 배치하는 작업' },
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
      name: '법조계',
      stages: [
        {
          id: 'st-law-court', name: '법원',
          words: [
            { id: 'w-law1', term: '몸배석', definition: '다른 판사가 자리를 비웠을 때 대신 재판부에 들어가는 배석판사' },
            { id: 'w-law2', term: '장날', definition: '재판 기일이 잡혀 실제 재판이 열리는 날' },
            { id: 'w-law3', term: '납품', definition: '배석판사가 작성한 판결문 초안이나 검토 의견을 재판장에게 제출하는 것' },
            { id: 'w-law4', term: '벙커', definition: '매우 깐깐하고 엄격한 부장판사나 재판장' },
            { id: 'w-law5', term: '깡치(깡치사건)', definition: '기록이 많고 복잡하며 처리하기 어려운 사건' },
            { id: 'w-law6', term: '좌배석 / 우배석', definition: '재판장 왼쪽·오른쪽에 앉는 배석판사를 구분하는 말' }
          ]
        },
        {
          id: 'st-law-prosecution', name: '검찰',
          words: [
            { id: 'w-law7', term: '프로', definition: '검사들끼리 서로를 부르는 호칭. "○○프로"처럼 사용한다' },
            { id: 'w-law8', term: '회사', definition: '검찰 조직을 내부적으로 지칭하는 표현. "회사 입장에서는..."처럼 쓰인다' },
            { id: 'w-law9', term: '금초', definition: '갓 임용된 초임 검사' },
            { id: 'w-law10', term: '2학년 검사 / 3학년 검사', definition: '인사이동 횟수에 따라 경력을 구분하는 말' }
          ]
        },
        {
          id: 'st-law-firm', name: '로펌',
          words: [
            { id: 'w-law11', term: '변호사 쇼핑', definition: '의뢰인이 여러 변호사를 만나며 자신에게 유리한 사람을 찾는 행위' },
            { id: 'w-law12', term: '블랙', definition: '근무 환경이 좋지 않은 법률사무소' },
            { id: 'w-law13', term: '찍새', definition: '사건 수임 영업을 주로 하는 변호사' },
            { id: 'w-law14', term: '딱새', definition: '서면 작성이나 실무를 주로 담당하는 변호사' }
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
            { id: 'w-film9', term: '오사마리/오사마이', definition: '최종적인 정리 과정' },
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
      id: 'cat-press',
      name: '언론',
      stages: [
        {
          id: 'st-press-reporting', name: '취재/보도',
          words: [
            { id: 'w-press1', term: '물 먹었다', definition: '경쟁사에 특종 뺏김' },
            { id: 'w-press2', term: '킬(kill)', definition: '기사 송고 직전 취소' },
            { id: 'w-press3', term: '데스크 컷', definition: '편집장이 기사 삭제' },
            { id: 'w-press4', term: '라인 탔다', definition: '내부 승인 받음' }
          ]
        },
        {
          id: 'st-press-article', name: '기사',
          words: [
            { id: 'w-press5', term: '스트레이트', definition: '사실 전달 중심 기사' },
            { id: 'w-press6', term: '피처', definition: '심층·스토리형 기사' },
            { id: 'w-press7', term: '탑', definition: '지면/메인 최상단 기사' },
            { id: 'w-press8', term: '사이드', definition: '보조 기사' },
            { id: 'w-press9', term: '리드', definition: '기사 첫 문장' },
            { id: 'w-press10', term: '꼬리', definition: '기사 마지막 문장' }
          ]
        },
        {
          id: 'st-press-field', name: '취재 현장',
          words: [
            { id: 'w-press11', term: '온', definition: '온더레코드. 언론이나 공식적인 자리에서 발언자가 자신의 이름과 신분을 밝히고, 기록과 보도를 허락하여 공식적으로 하는 발언' },
            { id: 'w-press12', term: '오프', definition: '오프더레코드. 보도 금지, 비공개 발언' },
            { id: 'w-press13', term: '엠바고', definition: '보도 시점 제한' },
            { id: 'w-press14', term: '사쓰마와리(마와리)', definition: '수습기자들이 경찰서를 돌며 사건사고를 수집하는 것' },
            { id: 'w-press15', term: '하리꼬미', definition: '뻗치기. 잠행취재. 사건 현장에서 움직이지 않고 취재한다는 뜻' }
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
      id: 'cat-realty',
      name: '부동산',
      stages: [
        {
          id: 'st-realty-development', name: '개발/분양/투자',
          words: [
            { id: 'w-realty1', term: '깜깜이 분양', definition: '별다른 홍보 없이 진행하는 분양 방식' },
            { id: 'w-realty2', term: '뚜껑', definition: '토지 지분 없이 입주권이 나오는 무허가 건물' },
            { id: 'w-realty3', term: '피(P)', definition: '분양권에 붙은 프리미엄(웃돈)' },
            { id: 'w-realty4', term: '야장', definition: '청약 당첨자 발표일에 형성되는 거래 시장' },
            { id: 'w-realty5', term: '대장', definition: '해당 지역의 시세를 주도하는 대표 아파트' },
            { id: 'w-realty6', term: '상투', definition: '가격이 최고점에 도달한 상태 또는 최고가에 매수한 경우' },
            { id: 'w-realty7', term: '설거지', definition: '세력이 빠져나간 뒤 남은 물량을 일반 투자자가 떠안는 상황' }
          ]
        },
        {
          id: 'st-realty-brokerage', name: '중개/거래',
          words: [
            { id: 'w-realty8', term: '교통', definition: '여러 중개업소가 공동으로 거래를 성사시키는 것' },
            { id: 'w-realty9', term: '데두리', definition: '실제 가격보다 높게 불러 차익을 남기는 행위' },
            { id: 'w-realty10', term: '찍기', definition: '좋은 매물을 먼저 확보한 뒤 웃돈을 붙여 되파는 방식' }
          ]
        },
        {
          id: 'st-realty-field', name: '현장/업계 관행',
          words: [
            { id: 'w-realty11', term: '임장', definition: '매물이나 지역을 직접 방문해 조사하는 활동' },
            { id: 'w-realty12', term: '하시', definition: '즉시 입주 가능' },
            { id: 'w-realty13', term: '떴다방', definition: '분양 현장을 따라다니며 영업하는 이동식 불법 중개업소' },
            { id: 'w-realty14', term: '똠방', definition: '무허가 중개업자' }
          ]
        }
      ]
    },
    {
      id: 'cat-food',
      name: '요식업',
      stages: [
        {
          id: 'st-fo-kitchen', name: '주방 작업',
          words: [
            { id: 'w-fo1', term: 'Fire', definition: '해당 주문을 즉시 조리 시작하라는 지시' },
            { id: 'w-fo2', term: 'Run the dish', definition: '플레이팅이 끝난 음식을 홀로 내보내라는 의미' },
            { id: 'w-fo3', term: 'Mise (Mise en place)', definition: '영업 전에 재료와 도구를 미리 준비해 두는 작업' },
            { id: 'w-fo4', term: 'A la minute', definition: '주문이 들어온 후 즉석에서 조리하는 방식' },
            { id: 'w-fo5', term: '5 Out / 3 Out', definition: '몇 분 뒤에 음식이 나갈 예정인지 알리는 시간 콜' },
            { id: 'w-fo6', term: 'Short', definition: '접시 구성에서 뭔가 빠졌을 때 사용하는 말' },
            { id: 'w-fo7', term: 'Flash', definition: '고기 등을 잠깐 더 익히거나 데워 마무리하는 작업' },
            { id: 'w-fo8', term: 'Dupe', definition: '주문서를 복사하거나 중복 확인하는 것' },
            { id: 'w-fo9', term: '와까리 났다', definition: '소스가 유화가 안 되고 분리되었다는 뜻' },
            { id: 'w-fo10', term: '노바시 해라', definition: '소스를 풀거나 묽게 하다' },
            { id: 'w-fo11', term: '나라시', definition: '평평하게 펴다' },
            { id: 'w-fo12', term: '모리해라', definition: '한데 모아라. 플레이팅해야 할 접시가 많은 경우 한곳에 모아서 작업하는 것' },
            { id: 'w-fo13', term: '시마이', definition: '작업의 마감이나 끝' }
          ]
        },
        {
          id: 'st-fo-ops', name: '운영/인력',
          words: [
            { id: 'w-fo14', term: 'In the weeds / Weeded', definition: '주문이 몰려 정신없이 바쁜 상태' },
            { id: 'w-fo15', term: 'Dying on the pass', definition: '완성된 음식이 픽업되지 못하고 식어가는 상황' },
            { id: 'w-fo16', term: '시다하다', definition: '시다바리. 보조하다(하는 사람)' },
            { id: 'w-fo17', term: '나와바리', definition: '구역, 섹션, 파트' },
            { id: 'w-fo18', term: '곤조있네', definition: '텃세를 부리거나 자존심이 세고 개성이 강한 사람' }
          ]
        },
        {
          id: 'st-fo-guests', name: '고객/예약',
          words: [
            { id: 'w-fo19', term: 'PPX (Personne Extraordinaire)', definition: 'VIP와 비슷한 의미로 특별 대우 대상 손님' },
            { id: 'w-fo20', term: 'NPR (Nice People Get Rewarded)', definition: '단골이나 친분 있는 손님에게 서비스를 챙겨주라는 표시' },
            { id: 'w-fo21', term: 'Deuce', definition: '2인 테이블' },
            { id: 'w-fo22', term: '4-top / 12-top', definition: '4인석, 12인석 같은 단체 좌석 표현' }
          ]
        },
        {
          id: 'st-fo-stock', name: '재고/판매',
          words: [
            { id: 'w-fo23', term: "86'd (에이티식스드)", definition: '재료가 떨어져 더 이상 판매할 수 없는 상태' }
          ]
        },
        {
          id: 'st-fo-tools', name: '도구',
          words: [
            { id: 'w-fo24', term: '야스리', definition: '스틸(steel), 칼을 가는 긴 쇠 막대' },
            { id: 'w-fo25', term: '빵빵이', definition: '체, 스트레인, 채반' },
            { id: 'w-fo26', term: '빡빡이', definition: '주방 바닥 물기를 제거하는 끌게, 스크래퍼' },
            { id: 'w-fo27', term: 'The Rail / The Board', definition: '주문서가 걸리는 레일 또는 주문 관리 구역' },
            { id: 'w-fo28', term: '빠시', definition: '남은 자투리 재료(물건)들', example: '고기 빠시 남은 것들로 함박스테이크 만들면 돼' }
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
            { id: 'w-ad7', term: '오사마리/오사마이', definition: '최종적인 정리 과정' }
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
    }
  ]
};

// ── State ──────────────────────────────────────────────────────────────────
const VIEW_STATE_KEY = 'fielddict:viewState';
const LIKED_WORDS_KEY = 'fielddict:likedWords';

function loadLikedWords() {
  try {
    const saved = JSON.parse(localStorage.getItem(LIKED_WORDS_KEY));
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    localStorage.removeItem(LIKED_WORDS_KEY);
    return new Set();
  }
}

function saveLikedWords() {
  localStorage.setItem(LIKED_WORDS_KEY, JSON.stringify([...state.likedWordIds]));
}

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
  helpOpen: false,
  likedWordIds: loadLikedWords(),
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

function toggleHelpPopover(event) {
  event.stopPropagation();
  state.helpOpen = !state.helpOpen;
  render();
}

function save() {
  supabase
    .from('app_data')
    .upsert({ id: 'singleton', data: state.data, updated_at: new Date().toISOString() })
    .then(({ error }) => { if (error) console.error('저장 실패:', error); });
}

function getWordLikes(word) {
  return word.likes ?? 0;
}

function getWordsLikes(words) {
  return words.reduce((sum, word) => sum + getWordLikes(word), 0);
}

function getCategoryLikes(cat) {
  return cat.stages.reduce(
    (sum, stage) => sum + stage.words.reduce((wordSum, word) => wordSum + getWordLikes(word), 0),
    0
  );
}

function isWordLiked(word) {
  return state.likedWordIds.has(word.id);
}

function isWordsLiked(words) {
  return words.some(isWordLiked);
}

function likeWords(words, event) {
  event.stopPropagation();
  if (words.length === 0) return;
  const likedWords = words.filter(isWordLiked);
  if (likedWords.length > 0) {
    likedWords.forEach(word => {
      word.likes = Math.max(0, getWordLikes(word) - 1);
      state.likedWordIds.delete(word.id);
    });
  } else {
    words[0].likes = getWordLikes(words[0]) + 1;
    state.likedWordIds.add(words[0].id);
  }
  saveLikedWords();
  save();
  render();
}

function likeButton(words) {
  const wordList = Array.isArray(words) ? words : [words];
  const liked = isWordsLiked(wordList);
  return h('button', {
    class: 'like-button' + (liked ? ' active' : ''),
    title: liked ? '좋아요 취소' : '좋아요',
    'aria-label': `좋아요 ${getWordsLikes(wordList)}개`,
    'aria-pressed': String(liked),
    onClick: event => likeWords(wordList, event)
  }, '👍', h('span', { class: 'like-count' }, String(getWordsLikes(wordList))));
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
    }, state.theme === 'dark' ? '☀' : '☾'),
    h('div', { class: 'help-popover-wrap' },
      h('button', {
        class: 'btn btn-ghost help-toggle',
        title: '도움말',
        'aria-label': '웹사이트 도움말 보기',
        'aria-expanded': String(state.helpOpen),
        onClick: toggleHelpPopover
      }, 'i'),
      state.helpOpen ? h('div', { class: 'help-popover', role: 'dialog', 'aria-label': '웹사이트 도움말' },
        h('div', { class: 'help-popover-title' }, '업계 은어 사전 안내'),
        h('p', { class: 'help-popover-text' },
          '업계 은어, 전문 용어, 약어 등 업계 밖에서는 접하기 어려운 언어를 모아둔 오픈 사전입니다. 누구나 다양한 분야의 전문 용어를 쉽게 찾아보고 배울 수 있습니다. 닉네임만 입력하면 새로운 용어를 직접 추가하고 공유할 수 있습니다.'
        )
      ) : null
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
  persistViewState();
  const cats = state.data.categories;
  const query = state.searchQuery.toLowerCase().trim();
  const totalCategories = cats.length;
  const totalStages = cats.reduce((count, cat) => count + cat.stages.length, 0);
  const totalWords = cats.reduce(
    (count, cat) => count + cat.stages.reduce((stageCount, stage) => stageCount + stage.words.length, 0),
    0
  );

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
    if (state.sortBy === 'popular') return getCategoryLikes(b) - getCategoryLikes(a);
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
    h('div', { class: 'page-header' },
      h('h1', { class: 'page-title' }, '업계별 탐색'),
      h('div', { class: 'home-summary' },
        h('span', { class: 'summary-stat' }, `업계 ${totalCategories}개`),
        h('span', { class: 'summary-stat' }, `소카테고리 ${totalStages}개`),
        h('span', { class: 'summary-stat' }, `단어 ${totalWords}개`)
      )
    ),
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
    wordEntries.sort((a, b) => getWordLikes(b.word) - getWordLikes(a.word));
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
        senses: [{ word: entry.word, words: [entry.word], contexts: [{ cat: entry.cat, stage: entry.stage }] }]
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
      sense = { word: entry.word, words: [], contexts: [] };
      group.senses.push(sense);
    }
    if (!sense.words.includes(entry.word)) sense.words.push(entry.word);
    if (!sense.contexts.some(context => context.cat.id === entry.cat.id && context.stage.id === entry.stage.id)) {
      sense.contexts.push({ cat: entry.cat, stage: entry.stage });
    }
  }
  if (state.allWordsSortBy === 'popular') {
    groupedWords.sort((a, b) =>
      getWordsLikes(b.senses.flatMap(sense => sense.words)) - getWordsLikes(a.senses.flatMap(sense => sense.words))
    );
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
        const groupWords = senses.flatMap(sense => sense.words);
        panel.append(
          h('div', { class: 'word-item' },
            h('div', { class: 'word-item-head' },
              h('div', { class: 'word-item-term', style: 'margin-bottom:0' }, term),
              likeButton(groupWords)
            ),
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
            h('div', { class: 'word-item-head' },
              h('div', { class: 'word-item-term', style: 'margin-bottom:0' }, w.term),
              h('div', { class: 'word-item-actions' },
                likeButton(w),
                h('button', { class: 'tag tag-stage tag-button', style: 'flex-shrink:0', onClick: () => selectStage(s.id) }, s.name)
              )
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
          h('div', { class: 'word-item-head' },
            h('div', { class: 'word-item-term', style: 'margin-bottom:0' }, w.term),
            likeButton(w)
          ),
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
  if (e.key !== 'Escape') return;
  closeModal();
  if (state.helpOpen) {
    state.helpOpen = false;
    render();
  }
});

document.addEventListener('click', e => {
  if (!state.helpOpen || e.target.closest('.help-popover-wrap')) return;
  state.helpOpen = false;
  render();
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

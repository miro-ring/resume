import type { Project } from '../../types';

export const projects: Project[] = [
	{
		name: '홍익대 영어영문학과 졸업',
		period: {
			start: '2015-03',
			end: '2021-02'
		},
		description: [
			'문학이 좋아 들어간 학교에서는 극복할 수 없는 격차만을 경험했습니다.',
			'이대로는 안 되겠다 싶어 듣게 된 C프로그래밍 수업에서 처음으로 같은 출발선에서 경쟁하는 재미를 느꼈습니다.',
			'컴퓨터구조 시험을 보고 나온 순간에는 나의 선택이 옳았음을 확신했습니다.',
			'내 머릿속에 겨우 올려놓은 것들을 쏟아내는 시간이 아닌, 머릿속 깊숙이 있는 것들을 꺼내야만 하는 시간이었습니다.',
			'이 재미와 기쁨에 이끌려 컴퓨터공학을 공부했습니다.',
			'다만 굳이 학위까지는 필요하지 않아, 졸업 프로젝트만 남은 시점에서 영문학도로의 졸업을 선택했습니다. (1년도 채 지나기 전에 이 선택에 대해 후회합니다.)'
		]
	},
	{
		name: '카카오에서의 시작',
		period: {
			start: '2021-09',
			end: '2021-11'
		},
		description: ['입사 과정 및 소회?'],
		techStack: ['HTML', 'CSS']
	},
	{
		name: '카카오 전자증명서 키패드 위에 버튼',
		period: {
			start: '2022-03',
			end: '2024-09'
		},
		description: ['키패드 위에 버튼 하나를 올리기 까지 필요했던 일들 정리'],
		techStack: ['React', 'TypeScript']
	},
	{
		name: 'YAPP 20기 FE 개발',
		period: {
			start: '2022-04',
			end: '2022-08'
		},
		description: [
			'단순한 호기심으로 시작했던 동아리에서의 이야기과 이곳에서 만나 지금까지 이어지고 있는 인연들'
		],
		techStack: ['React', 'TypeScript']
	},
	{
		name: '카카오 웹뷰 디버거 (버거킹) 개발',
		period: {
			start: '2022-12',
			end: '진행 중'
		},
		description: ['우리가 가진 불편함을 해소했던 첫 프로젝트'],
		techStack: ['React', 'TypeScript']
	},
	{
		name: '카카오 전자문서 Pull To Refresh 개발',
		period: {
			start: '2023-03',
			end: '진행 중'
		},
		description: [
			"더 좋은 UX를 제공하기 위한 노력들. 하지만 알고 보면 안드로이드 사용자가 훨씬 많은데, '나'를 기준으로한 편협한 사고를 가지고 있었다."
		],
		techStack: ['React', 'TypeScript']
	},
	{
		name: 'YAPP 23기 FE 개발',
		period: {
			start: '2023-12',
			end: '2024-03'
		},
		description: [
			'나는 잘 하고 있는가. 나는 잘 성장하고 있는가. 에 대한 의문에서 시작했던 프로젝트. 가장 아쉬우면서도 미안했던 시간. 나를 우러러보는 대학생 개발자와, 더 나은 실력을 가지고 있는 대학생 개발자를 우러러보는 나 사이에서의 괴리감',
			'부끄러운 사람이 되지 않기 위해서는 더 많은 것들을 해야만 한다 느꼈던 순간'
		],
		techStack: ['React', 'TypeScript']
	},
	{
		name: '카카오 지갑파트너센터 FE 개발',
		period: {
			start: '2024-06',
			end: '진행 중'
		},
		description: [
			'많은 인원 변동 속에서 다양한 사람들과 새롭게 협엽해볼 수 있었던 경험. 굉장히 집중해서 업무를 진행했던 시기였다.',
			'지금까지 해왔던 프로젝트에 비해 사용자가 적은 편이어서 오히려 다양한 도전들을 쉽게 제안하고 해볼 수 있었다.'
		],
		techStack: ['React', 'TypeScript']
	},
	{
		name: '카카오 Jira 관리 도구 (Jiffy) 개발',
		period: {
			start: '2024-09',
			end: '진행 중'
		},
		description: [
			'머릿속에 있던 생각을 미루고 미루고 미루다... 시작한 프로젝트. 큰 오너십이 오히려 프로젝트에 해를 끼치는 경우가 있음을 깨달음. 프로젝트에 내가 소유한 모든 것들을 쏟되, 그 자체를 소유하려해서는 안 된다.'
		],
		techStack: ['React', 'TypeScript']
	}
];

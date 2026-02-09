import type { Project } from '../../types';

export const projects: Project[] = [
	{
		name: '홍익대 영어영문학과 졸업',
		period: {
			start: '2015-03',
			end: '2021-02'
		},
		description: [
			'2년간은 술만 마심',
			'이후 2년간은 본 전공을 버리고, 컴퓨터공학 수업을 집중적으로 수강함',
			'학위까지는 필요없다고 판단하여, 본 전공인 영어영문학과를 졸업함'
		]
	},
	{
		name: 'N Tech Service 마크업 개발 인턴',
		period: {
			start: '2021-09',
			end: '2021-11'
		},
		description: ['마크업 개발에 대한 인턴 과정을 진행함'],
		techStack: ['HTML', 'CSS']
	},
	{
		name: '카카오 전자증명서 FE 개발',
		period: {
			start: '2022-11',
			end: '2024-09'
		},
		description: ['내용 추가 중'],
		techStack: ['React', 'TypeScript']
	},
	{
		name: '카카오 웹뷰 디버거 (버거킹) 개발',
		period: {
			start: '2022-12',
			end: '진행 중'
		},
		description: ['내용 추가 중'],
		techStack: ['React', 'TypeScript']
	},
	{
		name: '카카오 전자문서 FE 개발',
		period: {
			start: '2023-03',
			end: '진행 중'
		},
		description: ['내용 추가 중'],
		techStack: ['React', 'TypeScript']
	},
	{
		name: '카카오 지갑파트너센터 FE 개발',
		period: {
			start: '2024-06',
			end: '진행 중'
		},
		description: ['내용 추가 중'],
		techStack: ['React', 'TypeScript']
	},
	{
		name: '카카오 Jira 관리 도구 (Jiffy) 개발',
		period: {
			start: '2024-09',
			end: '진행 중'
		},
		description: ['Jira 이슈 관리를 위한 내부 도구 개발'],
		techStack: ['React', 'TypeScript']
	},
	{
		name: 'YAPP 20기 FE 개발',
		period: {
			start: '2022-04',
			end: '2022-08'
		},
		description: ['내용 추가 중'],
		techStack: ['React', 'TypeScript']
	},
	{
		name: 'YAPP 23기 FE 개발',
		period: {
			start: '2023-12',
			end: '2024-03'
		},
		description: ['내용 추가 중'],
		techStack: ['React', 'TypeScript']
	}
];

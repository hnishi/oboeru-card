export const sampleFlashcards = [
  {
    id: "card-1",
    question: "Pega Platform とは何か？",
    answer:
      "ローコード開発プラットフォームで、ビジネスプロセス管理（BPM）とカスタマーエンゲージメントを実現するためのツール",
    explanation:
      "Pega Platformは、ビジネスプロセスの自動化、アプリケーション開発、CRMなどの機能を提供する統合プラットフォームです。",
    groupId: "group-pega-csa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "card-2",
    question: "Case Management とは？",
    answer:
      "ビジネスプロセスを管理・追跡するための機能で、作業の進捗状況や関連データを一元管理する仕組み",
    explanation:
      "Case Managementは、Pegaの中核機能の1つで、複雑なビジネスプロセスを効率的に管理することができます。",
    groupId: "group-pega-csa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sampleGroups = [
  {
    id: "group-pega-csa",
    name: "Pega Certified System Architect",
    totalCards: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sampleProgress = {
  userId: "user-1",
  cardProgress: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

# 技術仕様書

## 1. 技術スタック

### 1.1 フロントエンド

- React Native: 0.76.7
- Expo: 52.0.40
- TypeScript: 5.3.3

### 1.2 状態管理

```typescript
// グローバル状態管理
interface GlobalState {
  theme: "light" | "dark" | "system";
  settings: AppSettings;
  studyProgress: StudyProgress;
}

// ローカルストレージ
interface StorageKeys {
  CARDS: "@oboeru-card/flashcards";
  GROUPS: "@oboeru-card/groups";
  PROGRESS: "@oboeru-card/progress";
  SETTINGS: "@oboeru-card/settings";
}
```

### 1.3 依存ライブラリ

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/stack": "^6.x",
    "react-native-reanimated": "^3.x",
    "react-native-gesture-handler": "^2.x",
    "react-native-safe-area-context": "^4.x",
    "@react-native-async-storage/async-storage": "^1.x",
    "react-native-paper": "^5.x"
  }
}
```

## 2. アプリケーションアーキテクチャ

### 2.1 ディレクトリ構造

```
src/
├── components/          # 再利用可能なUIコンポーネント
├── screens/            # 画面コンポーネント
├── hooks/              # カスタムフック
├── contexts/           # Reactコンテキスト
├── services/           # ビジネスロジック
├── types/              # 型定義
├── utils/              # ユーティリティ関数
├── constants/          # 定数
└── assets/            # 静的リソース
```

### 2.2 コンポーネント設計

#### プレゼンテーショナルコンポーネント

```typescript
// 例：カードコンポーネント
interface CardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
}

// 例：進捗バーコンポーネント
interface ProgressBarProps {
  progress: number;
  total: number;
  color?: string;
}
```

#### コンテナコンポーネント

```typescript
// 例：カード学習画面
interface CardStudyContainerProps {
  categoryId: string;
  onComplete: (results: StudyResults) => void;
}
```

### 2.3 状態管理パターン

```typescript
// グローバルコンテキスト
const AppContext = createContext<{
  state: GlobalState;
  dispatch: Dispatch<AppAction>;
}>({});

// Reducer
type AppAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "UPDATE_PROGRESS"; payload: Progress }
  | { type: "UPDATE_SETTINGS"; payload: Partial<AppSettings> };
```

## 3. データフロー

### 3.1 ストレージ操作

```typescript
class StorageService {
  static async saveProgress(progress: Progress): Promise<void>;
  static async loadProgress(): Promise<Progress>;
  static async clearProgress(): Promise<void>;
  static async saveSettings(settings: AppSettings): Promise<void>;
  static async loadSettings(): Promise<AppSettings>;
}
```

### 3.2 キャッシュ戦略

```typescript
interface CacheConfig {
  maxAge: number; // キャッシュの有効期限（ミリ秒）
  maxItems: number; // キャッシュに保持する最大アイテム数
  version: string; // キャッシュバージョン
}

class CacheManager {
  static async set(key: string, value: any): Promise<void>;
  static async get<T>(key: string): Promise<T | null>;
  static async clear(): Promise<void>;
}
```

## 4. エラー処理

### 4.1 エラー型定義

```typescript
enum ErrorCode {
  STORAGE_ERROR = "STORAGE_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

interface AppError {
  code: ErrorCode;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
}
```

### 4.2 エラーハンドリング

```typescript
class ErrorHandler {
  static handle(error: AppError): void {
    switch (error.code) {
      case ErrorCode.STORAGE_ERROR:
        // ストレージエラーの処理
        break;
      case ErrorCode.VALIDATION_ERROR:
        // バリデーションエラーの処理
        break;
      default:
        // その他のエラー処理
        break;
    }
  }
}
```

## 5. パフォーマンス最適化

### 5.1 メモ化戦略

```typescript
// コンポーネントメモ化
const MemoizedCard = React.memo(Card, (prev, next) => {
  return prev.question === next.question && prev.isFlipped === next.isFlipped;
});

// 値のメモ化
const useMemoizedValue = <T>(value: T): T => {
  return useMemo(() => value, [value]);
};
```

### 5.2 レンダリング最適化

```typescript
// 仮想化リスト
interface VirtualizedListProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  itemHeight: number;
  windowSize?: number;
}
```

## 6. セキュリティ考慮事項

### 6.1 データ保護

- AsyncStorage の暗号化
- センシティブデータの安全な処理
- アプリケーションの状態保護

### 6.2 入力バリデーション

```typescript
interface ValidationRule {
  type: "required" | "maxLength" | "pattern";
  value?: number | RegExp;
  message: string;
}

class Validator {
  static validate(value: unknown, rules: ValidationRule[]): string[];
}
```

## 7. テスト戦略

### 7.1 単体テスト

```typescript
// Jestによるテスト例
describe("CardComponent", () => {
  it("should flip when tapped", () => {
    // テストケース
  });
});
```

### 7.2 統合テスト

```typescript
// React Native Testing Libraryによるテスト例
describe("CardStudyScreen", () => {
  it("should navigate to results when completed", () => {
    // テストケース
  });
});
```

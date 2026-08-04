export const DEFAULT_CHAT_MODEL = "llama-3.3-70b-versatile";

export const titleModel = {
  description: "Fast small model for title generation",
  id: "llama-3.1-8b-instant",
  name: "Llama 3.1 8B Instant",
  provider: "groq",
};

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: ModelCapabilities;
  reasoningEffort?: "none" | "minimal" | "low" | "medium" | "high";
};

export const chatModels: ChatModel[] = [
  {
    capabilities: { reasoning: false, tools: true, vision: false },
    description: "Fast, capable general-purpose model (Groq free tier)",
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "groq",
  },
  {
    capabilities: { reasoning: true, tools: true, vision: true },
    description: "Understands uploaded images, good for vision tasks",
    id: "qwen/qwen3.6-27b",
    name: "Qwen3.6 27B (Vision)",
    provider: "groq",
  },
];

export function getCapabilities(): Promise<Record<string, ModelCapabilities>> {
  return Promise.resolve(
    Object.fromEntries(chatModels.map((m) => [m.id, m.capabilities]))
  );
}

export const isDemo = process.env.IS_DEMO === "1";

export type GatewayModelWithCapabilities = ChatModel;

export function getAllGatewayModels(): Promise<GatewayModelWithCapabilities[]> {
  return Promise.resolve(chatModels);
}

export function getActiveModels(): ChatModel[] {
  return chatModels;
}

export const allowedModelIds = new Set(chatModels.map((m) => m.id));

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);

export type ModelAvailability = "healthy" | "impacted" | "unknown";

export function getModelAvailability(
  _modelId: string
): Promise<ModelAvailability> {
  return Promise.resolve("healthy");
}

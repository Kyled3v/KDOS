/**
 * ModelProvider.ts
 *
 * Location: src/core/models/ModelProvider.ts
 *
 * ModelProvider is the abstraction boundary between KDOS and whatever
 * local AI runtime actually serves models — Ollama today, potentially
 * LM Studio, LocalAI, llama.cpp, or something else tomorrow. KDOS
 * never talks to a runtime directly; it only ever talks to a
 * ModelProvider implementation through this interface.
 *
 * This file defines the contract only. No concrete provider (Ollama
 * or otherwise) is implemented here.
 */

import type { Model } from './Model'

/**
 * A single chat message in a generation request.
 */
export interface ModelMessage {
  readonly role: 'system' | 'user' | 'assistant'
  readonly content: string
}

/**
 * A request to generate a response from a specific model.
 */
export interface ModelGenerationRequest {
  readonly modelId: string
  readonly messages: ModelMessage[]
  readonly temperature?: number
}

/**
 * The result of a generation request.
 */
export interface ModelGenerationResponse {
  readonly content: string
  readonly modelId: string
  readonly provider: string
}

/**
 * The contract every AI runtime integration must implement to be
 * usable by KDOS. ModelManager depends only on this interface, never
 * on a concrete runtime.
 */
export interface ModelProvider {
  /**
   * The provider's own name (e.g. "ollama", "lmstudio"), used for
   * identification and logging.
   */
  readonly name: string

  /**
   * Installs a model into the underlying runtime, making it available
   * for generation.
   *
   * @param modelId - The id of the model to install.
   * @returns The installed Model's up-to-date record.
   */
  installModel(modelId: string): Promise<Model>

  /**
   * Removes a previously installed model from the underlying runtime.
   *
   * @param modelId - The id of the model to remove.
   */
  removeModel(modelId: string): Promise<void>

  /**
   * Lists every model the underlying runtime currently knows about,
   * installed or otherwise.
   *
   * @returns The runtime's known Models.
   */
  listModels(): Promise<Model[]>

  /**
   * Generates a response from a specific model via the underlying
   * runtime.
   *
   * @param request - The generation request.
   * @returns The generation result.
   */
  generate(request: ModelGenerationRequest): Promise<ModelGenerationResponse>

  /**
   * Checks whether the underlying runtime is reachable and healthy.
   *
   * @returns true if the runtime responded successfully.
   */
  healthCheck(): Promise<boolean>
}
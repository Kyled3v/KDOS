/**
 * OpenRouterProvider.ts
 *
 * Location: src/core/workforce/gateway/OpenRouterProvider.ts
 *
 * OpenRouterProvider is the ONLY class in KDOS responsible for
 * communicating with OpenRouter. It sends chat completion requests
 * via fetch() and returns the assistant's message content, throwing
 * descriptive errors on any failure.
 *
 * This class performs no reasoning, no task orchestration, and no
 * employee logic — it is a thin, strongly-typed transport layer over
 * the OpenRouter chat completions API.
 */

/**
 * A single chat message, matching the OpenRouter/OpenAI-style
 * chat completions message shape.
 */
export interface ChatMessage {
  readonly role: 'system' | 'user' | 'assistant'
  readonly content: string
}

/**
 * The request body sent to OpenRouter's chat completions endpoint.
 */
interface OpenRouterRequestBody {
  readonly model: string
  readonly messages: ChatMessage[]
  readonly temperature: number
}

/**
 * A single choice returned by OpenRouter's chat completions endpoint.
 */
interface OpenRouterChoice {
  readonly message?: {
    readonly content?: string
  }
}

/**
 * The successful response shape returned by OpenRouter's chat
 * completions endpoint.
 */
interface OpenRouterSuccessResponse {
  readonly choices?: OpenRouterChoice[]
}

/**
 * The error shape OpenRouter returns in its response body when a
 * request fails.
 */
interface OpenRouterErrorResponse {
  readonly error?: {
    readonly message?: string
  }
}

/**
 * The OpenRouter chat completions endpoint.
 */
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

/**
 * Default model used when OPENROUTER_MODEL is not set in the
 * environment. This is the only model name permitted to be
 * hardcoded in this file.
 */
const DEFAULT_MODEL = 'moonshotai/kimi-k2'

/**
 * Fixed sampling temperature for all requests made through this
 * provider.
 */
const REQUEST_TEMPERATURE = 0.2

/**
 * OpenRouterProvider
 *
 * Single responsibility: send chat messages to OpenRouter and return
 * the assistant's reply as a plain string.
 *
 * This class:
 *   - Reads OPENROUTER_API_KEY and OPENROUTER_MODEL from environment
 *     variables at call time (never hardcoded).
 *   - Falls back to "moonshotai/kimi-k2" when OPENROUTER_MODEL is
 *     unset.
 *   - Throws a descriptive Error, including HTTP status code, status
 *     text, and any message OpenRouter returned, whenever the request
 *     fails.
 *   - Throws "OPENROUTER_API_KEY is missing." when no API key is
 *     configured.
 *   - Uses no `any` types.
 */
export class OpenRouterProvider {
  /**
   * Sends a list of chat messages to OpenRouter and returns the
   * assistant's reply content.
   *
   * @param messages - The conversation to send, in chat message
   *        order.
   * @returns The assistant's reply message content.
   * @throws Error if OPENROUTER_API_KEY is missing, if the HTTP
   *         request fails, if OpenRouter returns a non-OK status, or
   *         if the response contains no usable message content.
   */
  public async complete(messages: ChatMessage[]): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is missing.')
    }

    const response = await this.sendRequest(apiKey, model, messages)
    return this.extractContent(response)
  }

  /**
   * Performs the actual fetch() call to OpenRouter and returns the
   * parsed successful response body. Throws a descriptive Error if
   * the HTTP call fails outright or if OpenRouter responds with a
   * non-OK status.
   */
  private async sendRequest(
    apiKey: string,
    model: string,
    messages: ChatMessage[]
  ): Promise<OpenRouterSuccessResponse> {
    const body: OpenRouterRequestBody = {
      model,
      messages,
      temperature: REQUEST_TEMPERATURE,
    }

    let response: Response

    try {
      response = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'KDOS',
        },
        body: JSON.stringify(body),
      })
    } catch (networkError) {
      const reason =
        networkError instanceof Error ? networkError.message : String(networkError)
      throw new Error(`OpenRouterProvider: network request failed: ${reason}`)
    }

    if (!response.ok) {
      const returnedMessage = await this.extractErrorMessage(response)
      throw new Error(
        `OpenRouterProvider: request failed with status ${response.status} (${response.statusText}): ${returnedMessage}`
      )
    }

    return this.parseSuccessBody(response)
  }

  /**
   * Parses a successful response body as JSON, guarding against a
   * response that claims success but returns invalid or unparsable
   * JSON.
   */
  private async parseSuccessBody(response: Response): Promise<OpenRouterSuccessResponse> {
    try {
      return (await response.json()) as OpenRouterSuccessResponse
    } catch (parseError) {
      const reason = parseError instanceof Error ? parseError.message : String(parseError)
      throw new Error(
        `OpenRouterProvider: failed to parse successful response body as JSON: ${reason}`
      )
    }
  }

  /**
   * Attempts to extract a human-readable error message from a failed
   * response body, falling back to raw text or a generic notice if
   * the body cannot be parsed as JSON or is empty.
   */
  private async extractErrorMessage(response: Response): Promise<string> {
    let rawText: string

    try {
      rawText = await response.text()
    } catch {
      return 'no response body available'
    }

    if (!rawText) {
      return 'no response body returned'
    }

    try {
      const parsed = JSON.parse(rawText) as OpenRouterErrorResponse
      return parsed.error?.message ?? rawText
    } catch {
      return rawText
    }
  }

  /**
   * Extracts the assistant's message content from a successful
   * OpenRouter response, throwing a descriptive Error if the
   * response contains no usable choice or content.
   */
  private extractContent(response: OpenRouterSuccessResponse): string {
    const content = response.choices?.[0]?.message?.content

    if (typeof content !== 'string' || content.length === 0) {
      throw new Error(
        'OpenRouterProvider: response succeeded but contained no assistant message content.'
      )
    }

    return content
  }
}
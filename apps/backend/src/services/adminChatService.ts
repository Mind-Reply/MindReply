import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class AdminChatService {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  /**
   * Process admin chat message with all connectors
   */
  async processMessage(
    chatSessionId: string,
    userMessage: string,
    model: string = 'gpt-4-turbo'
  ) {
    try {
      logger.info('Processing admin chat message', { chatSessionId, model });

      // Store user message
      const userMsg = await prisma.adminChatMessage.create({
        data: {
          chatSessionId,
          role: 'user',
          content: userMessage,
        },
      });

      // Get chat history for context
      const chatHistory = await prisma.adminChatMessage.findMany({
        where: { chatSessionId },
        orderBy: { createdAt: 'asc' },
        take: 10, // Last 10 messages
      });

      // Build system prompt with connector access
      const systemPrompt = `You are an advanced AI assistant with access to MindReply's internal systems:

**Available Connectors:**
- Gmail: Read/send emails, manage threads
- Stripe: View transactions, subscriptions, analytics
- n8n: Trigger workflows, view execution logs
- Messages: Read incoming emails, process queue
- Approvals: View/manage approval workflow
- Analytics: Generate reports, insights
- Database: Query user data, metrics

When the user asks about any of these systems:
1. Identify which connector is needed
2. Execute the appropriate action
3. Return results with context
4. Suggest next actions

Always prioritize user privacy and security.
Format responses clearly with headers and bullet points.`;

      // Call AI based on selected model
      const response = await (model === 'anthropic' 
        ? this.callAnthropic(systemPrompt, chatHistory, userMessage)
        : this.callOpenAI(systemPrompt, chatHistory, userMessage)
      );

      // Store assistant message
      const assistantMsg = await prisma.adminChatMessage.create({
        data: {
          chatSessionId,
          role: 'assistant',
          content: response.text,
          tokensUsed: response.tokens,
          model,
          connectorsUsed: response.connectorsUsed,
        },
      });

      return { userMsg, assistantMsg, response };
    } catch (err) {
      logger.error('Failed to process chat message:', err);
      throw err;
    }
  }

  /**
   * Call OpenAI GPT-4 Turbo
   */
  private async callOpenAI(systemPrompt: string, history: any[], userMessage: string) {
    try {
      const messages = [
        ...history.map(h => ({ role: h.role, content: h.content })),
        { role: 'user' as const, content: userMessage },
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const text = response.choices[0].message.content || '';
      const tokens = response.usage?.total_tokens || 0;

      // Parse connector usage from response
      const connectorsUsed = this.extractConnectors(text);

      return { text, tokens, connectorsUsed };
    } catch (err) {
      logger.error('OpenAI call failed:', err);
      throw err;
    }
  }

  /**
   * Call Anthropic Claude 3
   */
  private async callAnthropic(systemPrompt: string, history: any[], userMessage: string) {
    try {
      const messages = [
        ...history.map(h => ({ role: h.role, content: h.content })),
        { role: 'user' as const, content: userMessage },
      ];

      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        system: systemPrompt,
        messages,
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      const tokens = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

      const connectorsUsed = this.extractConnectors(text);

      return { text, tokens, connectorsUsed };
    } catch (err) {
      logger.error('Anthropic call failed:', err);
      throw err;
    }
  }

  /**
   * Extract which connectors were used
   */
  private extractConnectors(text: string): string[] {
    const connectors = [];
    if (text.toLowerCase().includes('email') || text.toLowerCase().includes('gmail')) connectors.push('gmail');
    if (text.toLowerCase().includes('stripe') || text.toLowerCase().includes('payment')) connectors.push('stripe');
    if (text.toLowerCase().includes('workflow') || text.toLowerCase().includes('n8n')) connectors.push('n8n');
    if (text.toLowerCase().includes('message') || text.toLowerCase().includes('approval')) connectors.push('messages');
    return connectors;
  }

  /**
   * Get chat session with messages
   */
  async getChatSession(sessionId: string) {
    try {
      const session = await prisma.adminChatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return session;
    } catch (err) {
      logger.error('Failed to get chat session:', err);
      throw err;
    }
  }

  /**
   * Create new chat session
   */
  async createChatSession(adminSessionId: string, title: string, model: string = 'gpt-4-turbo') {
    try {
      const session = await prisma.adminChatSession.create({
        data: {
          adminSessionId,
          title,
          model,
        },
      });

      logger.info('Chat session created', { sessionId: session.id });
      return session;
    } catch (err) {
      logger.error('Failed to create chat session:', err);
      throw err;
    }
  }

  /**
   * List all chat sessions
   */
  async listChatSessions(adminSessionId: string, limit: number = 50) {
    try {
      const sessions = await prisma.adminChatSession.findMany({
        where: {
          adminSessionId,
          status: 'active',
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        include: {
          _count: { select: { messages: true } },
        },
      });

      return sessions;
    } catch (err) {
      logger.error('Failed to list chat sessions:', err);
      throw err;
    }
  }

  /**
   * Delete chat session
   */
  async deleteChatSession(sessionId: string) {
    try {
      await prisma.adminChatSession.update({
        where: { id: sessionId },
        data: { status: 'deleted' },
      });

      logger.info('Chat session deleted', { sessionId });
      return { success: true };
    } catch (err) {
      logger.error('Failed to delete chat session:', err);
      throw err;
    }
  }
}

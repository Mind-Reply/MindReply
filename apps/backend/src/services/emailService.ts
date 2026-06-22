import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

export class EmailService {
  private gmail: any;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.gmail = google.gmail({ version: 'v1', auth: this.getAuthClient() });
  }

  private getAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: this.accessToken });
    return oauth2Client;
  }

  /**
   * Fetch unread messages from Gmail
   */
  async fetchUnreadMessages(limit: number = 10) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        maxResults: limit,
      });

      const messages = response.data.messages || [];
      const results = [];

      for (const msg of messages) {
        const full = await this.gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });

        const headers = full.data.payload.headers;
        const from = headers.find((h: any) => h.name === 'From')?.value || '';
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';

        const body = this.getMessageBody(full.data);

        results.push({
          gmailMessageId: msg.id,
          from,
          subject,
          body,
          timestamp: full.data.internalDate,
        });
      }

      logger.info(`Fetched ${results.length} unread messages`);
      return results;
    } catch (err) {
      logger.error('Failed to fetch Gmail messages:', err);
      throw err;
    }
  }

  /**
   * Extract message body from Gmail payload
   */
  private getMessageBody(message: any): string {
    if (message.payload.parts) {
      const textPart = message.payload.parts.find((p: any) => p.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        return Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    } else if (message.payload.body?.data) {
      return Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
    }
    return '';
  }

  /**
   * Send email reply via Gmail API
   */
  async sendReply(toEmail: string, subject: string, body: string) {
    try {
      const message = {
        to: toEmail,
        subject,
        text: body,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      };

      const rawMessage = this.createRawMessage(message);

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawMessage,
        },
      });

      logger.info('Email sent via Gmail API', { toEmail, subject });
      return { gmailMessageId: response.data.id };
    } catch (err) {
      logger.error('Failed to send email:', err);
      throw err;
    }
  }

  /**
   * Create raw RFC 5322 message
   */
  private createRawMessage(message: any): string {
    const headers = [
      `To: ${message.to}`,
      `Subject: ${message.subject}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
    ];

    const raw = headers.join('\r\n') + '\r\n\r\n' + message.text;
    return Buffer.from(raw).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }

  /**
   * Get email thread
   */
  async getThread(threadId: string) {
    try {
      const response = await this.gmail.users.threads.get({
        userId: 'me',
        id: threadId,
        format: 'full',
      });

      return response.data.messages.map((msg: any) => ({
        id: msg.id,
        from: msg.payload.headers.find((h: any) => h.name === 'From')?.value,
        subject: msg.payload.headers.find((h: any) => h.name === 'Subject')?.value,
        body: this.getMessageBody(msg),
        timestamp: msg.internalDate,
      }));
    } catch (err) {
      logger.error('Failed to get thread:', err);
      throw err;
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string) {
    try {
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          removeLabelIds: ['UNREAD'],
        },
      });

      logger.info('Message marked as read', { messageId });
    } catch (err) {
      logger.error('Failed to mark message as read:', err);
      throw err;
    }
  }
}

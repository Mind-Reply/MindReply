import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface AdminWSMessage {
  type: 'message' | 'ping' | 'auth';
  data?: any;
  token?: string;
  adminId?: string;
}

interface AuthenticatedSocket extends WebSocket {
  adminId?: string;
  adminEmail?: string;
  isAlive?: boolean;
}

export class AdminWebSocketServer {
  private wss: WebSocket.Server;
  private connectedClients: Map<string, AuthenticatedSocket[]> = new Map();

  constructor(server: any) {
    this.wss = new WebSocket.Server({ server });
    this.setupWSS();
  }

  private setupWSS() {
    this.wss.on('connection', (ws: AuthenticatedSocket) => {
      logger.info('WebSocket client connected');

      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', (data: string) => {
        try {
          const message: AdminWSMessage = JSON.parse(data);
          this.handleMessage(ws, message);
        } catch (err) {
          logger.error('WebSocket message error:', err);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        if (ws.adminId) {
          const clients = this.connectedClients.get(ws.adminId);
          if (clients) {
            this.connectedClients.set(
              ws.adminId,
              clients.filter(c => c !== ws)
            );
          }
        }
        logger.info('WebSocket client disconnected');
      });

      ws.on('error', (err) => {
        logger.error('WebSocket error:', err);
      });
    });

    // Heartbeat
    const heartbeat = setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedSocket) => {
        if (!ws.isAlive) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => clearInterval(heartbeat));
  }

  private async handleMessage(ws: AuthenticatedSocket, message: AdminWSMessage) {
    switch (message.type) {
      case 'auth':
        await this.handleAuth(ws, message);
        break;
      case 'message':
        await this.handleChatMessage(ws, message);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      default:
        logger.warn('Unknown message type:', message.type);
    }
  }

  private async handleAuth(ws: AuthenticatedSocket, message: AdminWSMessage) {
    try {
      const { token, adminId } = message;
      if (!token || !adminId) {
        ws.send(JSON.stringify({ error: 'Auth failed: missing credentials' }));
        return;
      }

      // Verify token
      const admin = await prisma.adminSession.findUnique({ where: { id: adminId } });
      if (!admin) {
        ws.send(JSON.stringify({ error: 'Admin not found' }));
        return;
      }

      try {
        const decoded = jwt.verify(token, admin.jwtSecret) as any;
        ws.adminId = adminId;
        ws.adminEmail = decoded.email;

        // Add to connected clients
        const clients = this.connectedClients.get(adminId) || [];
        clients.push(ws);
        this.connectedClients.set(adminId, clients);

        ws.send(JSON.stringify({ type: 'authenticated', adminId, email: decoded.email }));
        logger.info('Admin authenticated via WebSocket', { adminId });
      } catch (err) {
        logger.warn('WebSocket token verification failed:', err);
        ws.send(JSON.stringify({ error: 'Invalid token' }));
      }
    } catch (err) {
      logger.error('Auth error:', err);
      ws.send(JSON.stringify({ error: 'Authentication failed' }));
    }
  }

  private async handleChatMessage(ws: AuthenticatedSocket, message: AdminWSMessage) {
    if (!ws.adminId) {
      ws.send(JSON.stringify({ error: 'Not authenticated' }));
      return;
    }

    try {
      const { data } = message;
      // Chat message handling happens via REST API
      // WebSocket is primarily for real-time updates
      logger.info('Chat message received via WS', { adminId: ws.adminId });
    } catch (err) {
      logger.error('Chat message error:', err);
      ws.send(JSON.stringify({ error: 'Failed to process chat message' }));
    }
  }

  /**
   * Broadcast real-time update to admin
   */
  public broadcastToAdmin(adminId: string, event: string, data: any) {
    const clients = this.connectedClients.get(adminId);
    if (clients && clients.length > 0) {
      const message = JSON.stringify({ type: 'update', event, data });
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }
}

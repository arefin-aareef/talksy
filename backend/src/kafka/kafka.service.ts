import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isConnected = false;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'chat-app',
      brokers: this.configService
        .get('KAFKA_BROKERS', 'localhost:9092')
        .split(','),
      retry: {
        retries: 3, // Reduced retries
        initialRetryTime: 300,
      },
      connectionTimeout: 10000, // Add connection timeout
      requestTimeout: 30000, // Add request timeout
    });

    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
      retry: {
        retries: 3,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: 'chat-consumer-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      maxWaitTimeInMs: 5000,
      retry: {
        retries: 3,
      },
    });
  }

  async onModuleInit() {
    try {
      // Add delay to ensure Kafka is fully ready
      await this.delay(2000);

      console.log('Connecting to Kafka...');
      await this.producer.connect();
      console.log('Producer connected');

      await this.consumer.connect();
      console.log('Consumer connected');

      // Subscribe to topics with better error handling
      await this.consumer.subscribe({
        topics: ['chat-messages', 'user-events', 'analytics'],
        fromBeginning: false,
      });
      console.log('Subscribed to topics');

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          await this.handleMessage(topic, message);
        },
      });

      this.isConnected = true;
      console.log('Kafka service connected and consuming messages');
    } catch (error) {
      console.error('Failed to connect to Kafka:', error.message);
      // Don't throw error - let app continue without Kafka
    }
  }

  async onModuleDestroy() {
    try {
      if (this.isConnected) {
        await this.producer.disconnect();
        await this.consumer.disconnect();
        console.log('Kafka service disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting from Kafka:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    if (!this.isConnected) {
      console.warn(`Kafka not connected, skipping message to ${topic}`);
      return;
    }

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: message.messageId || message.userId || Date.now().toString(),
            value: JSON.stringify(message),
            timestamp: Date.now().toString(),
          },
        ],
      });
    } catch (error) {
      console.error(
        `Error sending message to Kafka topic ${topic}:`,
        error.message,
      );
    }
  }

  async sendBatch(topic: string, messages: any[]): Promise<void> {
    if (!this.isConnected) {
      console.warn(`Kafka not connected, skipping batch to ${topic}`);
      return;
    }

    try {
      const kafkaMessages = messages.map((message, index) => ({
        key: message.messageId || message.userId || `${Date.now()}-${index}`,
        value: JSON.stringify(message),
        timestamp: Date.now().toString(),
      }));

      await this.producer.send({
        topic,
        messages: kafkaMessages,
      });
    } catch (error) {
      console.error(
        `Error sending batch messages to Kafka topic ${topic}:`,
        error.message,
      );
    }
  }

  private async handleMessage(
    topic: string,
    message: KafkaMessage,
  ): Promise<void> {
    try {
      const data = JSON.parse(message.value?.toString() || '{}');

      switch (topic) {
        case 'chat-messages':
          await this.handleChatMessage(data);
          break;
        case 'user-events':
          await this.handleUserEvent(data);
          break;
        case 'analytics':
          await this.handleAnalytics(data);
          break;
        default:
          console.log(`Received message from unknown topic: ${topic}`, data);
      }
    } catch (error) {
      console.error(`Error handling message from topic ${topic}:`, error);
    }
  }

  private async handleChatMessage(data: any): Promise<void> {
    console.log('Processing chat message:', data);
  }

  private async handleUserEvent(data: any): Promise<void> {
    console.log('Processing user event:', data);
  }

  private async handleAnalytics(data: any): Promise<void> {
    console.log('Processing analytics:', data);
  }

  async sendUserEvent(
    event: string,
    userId: string,
    data?: any,
  ): Promise<void> {
    await this.sendMessage('user-events', {
      event,
      userId,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  async sendAnalytics(event: string, data: any): Promise<void> {
    await this.sendMessage('analytics', {
      event,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }
}

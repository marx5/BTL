import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService {
  private readonly client: mqtt.MqttClient;

  constructor() {
    const protocol = 'wss';
    const host = '1c0787fe98d845fea408181bfc94d923.s1.eu.hivemq.cloud';
    const port = '8884';
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const connectUrl = `${protocol}://${host}:${port}/mqtt`;
    console.log('Connecting to', connectUrl);

    this.client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: 'vanvu',
      password: 'E!hU2TJUGSSJjqb',
      reconnectPeriod: 1000,
      rejectUnauthorized: true,
    });

    this.client.on('connect', () => {
      console.log('Connected to mqttbroker');
    });

    this.client.on('error', (error) => {
      console.error('MQTT connection failed', error);
    });
  }

  publish(topic: string, message: string) {
    this.client.publish(topic, message, {}, (error) => {
      if (error) {
        console.error('Publish failed', error);
      }
    });
  }

  subscribe(topic: string, callback: (topic: string, payload: Buffer) => void) {
    this.client.subscribe(topic, (error) => {
      if (error) {
        console.error('Subscription failed', error);
      }
    });

    this.client.on('message', callback);
  }
}

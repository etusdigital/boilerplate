import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

/**
 * Global events module.
 * Configures the NestJS event emitter for domain events.
 */
@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Use wildcard for flexible event listening
      wildcard: true,
      // Delimiter for namespaced events (e.g., 'entity.created')
      delimiter: '.',
      // Emit events asynchronously for better performance
      newListener: false,
      removeListener: false,
      // Max listeners (increase if you have many listeners)
      maxListeners: 20,
      // Show verbose memory leak warnings
      verboseMemoryLeak: true,
      // Ignore errors to prevent unhandled rejections
      ignoreErrors: false,
    }),
  ],
  exports: [EventEmitterModule],
})
export class EventsModule {}

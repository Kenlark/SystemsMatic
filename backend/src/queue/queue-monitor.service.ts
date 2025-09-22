import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueMonitorService {
  constructor(@InjectQueue('reminders') private readonly queue: Queue) {}

  async getQueueStats() {
    try {
      const waiting = await this.queue.getWaiting();
      const active = await this.queue.getActive();
      const completed = await this.queue.getCompleted();
      const failed = await this.queue.getFailed();

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        total:
          waiting.length + active.length + completed.length + failed.length,
        memoryUsage: {
          waiting: this.estimateMemoryUsage(waiting),
          active: this.estimateMemoryUsage(active),
          completed: this.estimateMemoryUsage(completed),
          failed: this.estimateMemoryUsage(failed),
        },
      };
    } catch (error) {
      return {
        error: 'Impossible de récupérer les statistiques de la queue',
        details: error.message,
      };
    }
  }

  private estimateMemoryUsage(jobs: any[]): number {
    // Estimation : ~150 bytes par job
    return jobs.length * 150;
  }

  async getQueueHealth() {
    const stats = await this.getQueueStats();

    if (stats.error) {
      return {
        status: 'error',
        message: stats.error,
        details: stats.details,
      };
    }

    const totalMemory =
      stats.memoryUsage.waiting +
      stats.memoryUsage.active +
      stats.memoryUsage.completed +
      stats.memoryUsage.failed;

    return {
      status: 'healthy',
      stats,
      memoryUsage: {
        total: totalMemory,
        totalMB: (totalMemory / 1024 / 1024).toFixed(2),
        limit: '25 MB',
        usagePercent: ((totalMemory / (25 * 1024 * 1024)) * 100).toFixed(2),
      },
    };
  }
}

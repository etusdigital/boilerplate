import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;
  let dbIndicator: jest.Mocked<TypeOrmHealthIndicator>;
  let memoryIndicator: jest.Mocked<MemoryHealthIndicator>;
  let diskIndicator: jest.Mocked<DiskHealthIndicator>;

  const mockHealthyResult: HealthCheckResult = {
    status: 'ok',
    info: {
      database: { status: 'up' },
    },
    error: {},
    details: {
      database: { status: 'up' },
    },
  };

  const mockUnhealthyResult: HealthCheckResult = {
    status: 'error',
    info: {},
    error: {
      database: { status: 'down', message: 'Connection failed' },
    },
    details: {
      database: { status: 'down', message: 'Connection failed' },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn(),
            checkRSS: jest.fn(),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get(HealthCheckService);
    dbIndicator = module.get(TypeOrmHealthIndicator);
    memoryIndicator = module.get(MemoryHealthIndicator);
    diskIndicator = module.get(DiskHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return healthy status when all checks pass', async () => {
      healthCheckService.check.mockResolvedValue(mockHealthyResult);

      const result = await controller.check();

      expect(result).toEqual(mockHealthyResult);
      expect(healthCheckService.check).toHaveBeenCalled();
    });

    it('should call health check with database, heap, and RSS checks', async () => {
      healthCheckService.check.mockResolvedValue(mockHealthyResult);

      await controller.check();

      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function), // database ping check
        expect.any(Function), // memory heap check
        expect.any(Function), // memory RSS check
      ]);
    });

    it('should execute database ping check', async () => {
      const mockPingResult = { database: { status: 'up' } };
      dbIndicator.pingCheck.mockResolvedValue(mockPingResult as any);

      healthCheckService.check.mockImplementation(async (indicators) => {
        // Execute each indicator function
        for (const indicator of indicators) {
          await indicator();
        }
        return mockHealthyResult;
      });

      await controller.check();

      expect(dbIndicator.pingCheck).toHaveBeenCalledWith('database');
    });

    it('should execute memory heap check with 150MB threshold', async () => {
      const mockMemoryResult = { memory_heap: { status: 'up' } };
      memoryIndicator.checkHeap.mockResolvedValue(mockMemoryResult as any);

      healthCheckService.check.mockImplementation(async (indicators) => {
        for (const indicator of indicators) {
          await indicator();
        }
        return mockHealthyResult;
      });

      await controller.check();

      expect(memoryIndicator.checkHeap).toHaveBeenCalledWith(
        'memory_heap',
        150 * 1024 * 1024,
      );
    });

    it('should execute memory RSS check with 300MB threshold', async () => {
      const mockMemoryResult = { memory_rss: { status: 'up' } };
      memoryIndicator.checkRSS.mockResolvedValue(mockMemoryResult as any);

      healthCheckService.check.mockImplementation(async (indicators) => {
        for (const indicator of indicators) {
          await indicator();
        }
        return mockHealthyResult;
      });

      await controller.check();

      expect(memoryIndicator.checkRSS).toHaveBeenCalledWith(
        'memory_rss',
        300 * 1024 * 1024,
      );
    });

    it('should return error status when database fails', async () => {
      healthCheckService.check.mockResolvedValue(mockUnhealthyResult);

      const result = await controller.check();

      expect(result.status).toBe('error');
      expect(result.error).toHaveProperty('database');
    });
  });

  describe('readiness', () => {
    it('should return healthy status when database is ready', async () => {
      healthCheckService.check.mockResolvedValue(mockHealthyResult);

      const result = await controller.readiness();

      expect(result).toEqual(mockHealthyResult);
      expect(healthCheckService.check).toHaveBeenCalled();
    });

    it('should only check database for readiness', async () => {
      healthCheckService.check.mockResolvedValue(mockHealthyResult);

      await controller.readiness();

      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function), // Only database ping check
      ]);
    });

    it('should execute database ping check', async () => {
      dbIndicator.pingCheck.mockResolvedValue({ database: { status: 'up' } } as any);

      healthCheckService.check.mockImplementation(async (indicators) => {
        for (const indicator of indicators) {
          await indicator();
        }
        return mockHealthyResult;
      });

      await controller.readiness();

      expect(dbIndicator.pingCheck).toHaveBeenCalledWith('database');
    });

    it('should return error when database is not ready', async () => {
      healthCheckService.check.mockResolvedValue(mockUnhealthyResult);

      const result = await controller.readiness();

      expect(result.status).toBe('error');
    });
  });

  describe('liveness', () => {
    it('should return healthy status when service is alive', async () => {
      healthCheckService.check.mockResolvedValue(mockHealthyResult);

      const result = await controller.liveness();

      expect(result).toEqual(mockHealthyResult);
    });

    it('should only check memory heap for liveness', async () => {
      healthCheckService.check.mockResolvedValue(mockHealthyResult);

      await controller.liveness();

      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function), // Only memory heap check
      ]);
    });

    it('should check memory heap with 500MB threshold for liveness', async () => {
      memoryIndicator.checkHeap.mockResolvedValue({
        memory_heap: { status: 'up' },
      } as any);

      healthCheckService.check.mockImplementation(async (indicators) => {
        for (const indicator of indicators) {
          await indicator();
        }
        return mockHealthyResult;
      });

      await controller.liveness();

      expect(memoryIndicator.checkHeap).toHaveBeenCalledWith(
        'memory_heap',
        500 * 1024 * 1024,
      );
    });

    it('should return error when memory exceeds liveness threshold', async () => {
      const memoryErrorResult: HealthCheckResult = {
        status: 'error',
        info: {},
        error: {
          memory_heap: { status: 'down', message: 'Used heap exceeds threshold' },
        },
        details: {
          memory_heap: { status: 'down', message: 'Used heap exceeds threshold' },
        },
      };

      healthCheckService.check.mockResolvedValue(memoryErrorResult);

      const result = await controller.liveness();

      expect(result.status).toBe('error');
    });
  });
});

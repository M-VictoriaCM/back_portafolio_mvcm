import { BaseService } from '../BaseService';
import { Model, ModelStatic } from 'sequelize';

// Mock de modelo de Sequelize
class MockModel extends Model {
  declare id: string;
  declare name: string;
  declare userId: string;
}

// Mock de métodos estáticos de Sequelize
const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindByPk = jest.fn();
const mockFindOne = jest.fn();
const mockCount = jest.fn();
const mockUpdate = jest.fn();
const mockDestroy = jest.fn();

// Service de prueba que extiende BaseService
class TestService extends BaseService<MockModel> {
  constructor(model: ModelStatic<MockModel>) {
    super(model);
  }
}

describe('BaseService', () => {
  let service: TestService;
  let mockModelStatic: ModelStatic<MockModel>;

  beforeEach(() => {
    // Resetear mocks antes de cada test
    jest.clearAllMocks();
    
    // Crear mock del modelo
    mockModelStatic = {
      create: mockCreate,
      findAll: mockFindAll,
      findByPk: mockFindByPk,
      findOne: mockFindOne,
      count: mockCount,
    } as any;

    service = new TestService(mockModelStatic);
  });

  describe('create', () => {
    it('debería crear un nuevo registro con userId', async () => {
      const mockData = { name: 'Test' };
      const mockUserId = 'user-123';
      const mockCreated = { id: '1', name: 'Test', userId: mockUserId };

      mockCreate.mockResolvedValue(mockCreated);

      const result = await service.create(mockData, mockUserId);

      expect(mockCreate).toHaveBeenCalledWith({
        ...mockData,
        userId: mockUserId
      });
      expect(result).toEqual(mockCreated);
    });
  });

  describe('getAll', () => {
    it('debería obtener todos los registros', async () => {
      const mockRecords = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' }
      ];

      mockFindAll.mockResolvedValue(mockRecords);

      const result = await service.getAll();

      expect(mockFindAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockRecords);
    });

    it('debería aceptar opciones de Sequelize', async () => {
      const options = { where: { active: true }, order: [['name', 'ASC']] };
      mockFindAll.mockResolvedValue([]);

      await service.getAll(options as any);

      expect(mockFindAll).toHaveBeenCalledWith(options);
    });
  });

  describe('getById', () => {
    it('debería obtener un registro por ID', async () => {
      const mockId = 'test-id';
      const mockRecord = { id: mockId, name: 'Test' };

      mockFindByPk.mockResolvedValue(mockRecord);

      const result = await service.getById(mockId);

      expect(mockFindByPk).toHaveBeenCalledWith(mockId, undefined);
      expect(result).toEqual(mockRecord);
    });

    it('debería retornar null si no encuentra el registro', async () => {
      mockFindByPk.mockResolvedValue(null);

      const result = await service.getById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('debería buscar un registro con condiciones', async () => {
      const mockWhere = { name: 'Test' };
      const mockRecord = { id: '1', name: 'Test' };

      mockFindOne.mockResolvedValue(mockRecord);

      const result = await service.findOne(mockWhere);

      expect(mockFindOne).toHaveBeenCalledWith({ where: mockWhere });
      expect(result).toEqual(mockRecord);
    });
  });

  describe('update', () => {
    it('debería actualizar un registro existente', async () => {
      const mockId = 'test-id';
      const mockUserId = 'user-123';
      const mockData = { name: 'Updated' };
      const mockRecord = {
        id: mockId,
        name: 'Old Name',
        update: mockUpdate
      };

      mockFindOne.mockResolvedValue(mockRecord);
      mockUpdate.mockResolvedValue({ ...mockRecord, ...mockData });

      const result = await service.update(mockId, mockData as any, mockUserId);

      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: mockId, userId: mockUserId }
      });
      expect(mockUpdate).toHaveBeenCalledWith(mockData);
      expect(result).toBeDefined();
    });

    it('debería retornar null si no encuentra el registro', async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await service.update('non-existent', { name: 'Test' } as any, 'user-123');

      expect(result).toBeNull();
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('debería eliminar un registro existente', async () => {
      const mockId = 'test-id';
      const mockUserId = 'user-123';
      const mockRecord = {
        id: mockId,
        destroy: mockDestroy
      };

      mockFindOne.mockResolvedValue(mockRecord);
      mockDestroy.mockResolvedValue(undefined);

      const result = await service.delete(mockId, mockUserId);

      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: mockId, userId: mockUserId }
      });
      expect(mockDestroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('debería retornar null si no encuentra el registro', async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await service.delete('non-existent', 'user-123');

      expect(result).toBeNull();
      expect(mockDestroy).not.toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('debería contar registros sin condiciones', async () => {
      mockCount.mockResolvedValue(5);

      const result = await service.count();

      expect(mockCount).toHaveBeenCalledWith({ where: undefined });
      expect(result).toBe(5);
    });

    it('debería contar registros con condiciones', async () => {
      const mockWhere = { active: true };
      mockCount.mockResolvedValue(3);

      const result = await service.count(mockWhere);

      expect(mockCount).toHaveBeenCalledWith({ where: mockWhere });
      expect(result).toBe(3);
    });
  });

  describe('exists', () => {
    it('debería retornar true si existen registros', async () => {
      mockCount.mockResolvedValue(1);

      const result = await service.exists({ name: 'Test' });

      expect(result).toBe(true);
    });

    it('debería retornar false si no existen registros', async () => {
      mockCount.mockResolvedValue(0);

      const result = await service.exists({ name: 'Non-existent' });

      expect(result).toBe(false);
    });
  });
});

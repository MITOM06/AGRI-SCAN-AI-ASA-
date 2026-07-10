import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, Payment } from '@agri-scan/database';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const modelMock = {}; // Mongoose model mock — đủ để DI resolve
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: modelMock },
        { provide: getModelToken(Payment.name), useValue: modelMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

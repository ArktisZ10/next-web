import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  BoardgameModel,
  insertBoardgame,
  getBoardgames,
  updateBoardgame,
  deleteBoardgame
} from './Boardgame';
import { dbConnect } from '../mongoose';

let mongoServer: MongoMemoryServer;

describe('Boardgame Collection Structure', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    process.env.VERCEL_ENV = 'test';
    
    await dbConnect();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await BoardgameModel.deleteMany({});
  });

  it('should insert a new boardgame', async () => {
    const game = {
      name: 'Settlers of Catan',
      minPlayers: 3,
      maxPlayers: 4,
      publisher: 'Kosmos',
    };

    const inserted = await insertBoardgame(game);
    
    expect(inserted).toHaveProperty('_id');
    expect(inserted.name).toBe('Settlers of Catan');
    expect(inserted.minPlayers).toBe(3);
  });

  it('should get a list of formatted boardgames sorted by name', async () => {
    await insertBoardgame({ name: 'Zombicide', minPlayers: 1, maxPlayers: 6 });
    await insertBoardgame({ name: 'Catan', minPlayers: 3, maxPlayers: 4 });
    await insertBoardgame({ name: 'Ticket to Ride', minPlayers: 2, maxPlayers: 5 });

    const games = await getBoardgames();
    
    expect(games).toHaveLength(3);
    expect(games[0].name).toBe('Catan');
    expect(games[1].name).toBe('Ticket to Ride');
    expect(games[2].name).toBe('Zombicide'); // Alphabetical sort check
    
    // Check type mapping to BoardgameEntity (no _id, has id)
    expect(games[0]).not.toHaveProperty('_id');
    expect(games[0]).toHaveProperty('id');
    expect(typeof games[0].id).toBe('string');
  });

  it('should update an existing boardgame', async () => {
    const inserted = await insertBoardgame({ name: 'Catan', minPlayers: 3 });
    const id = inserted._id.toString();

    const updated = await updateBoardgame(id, { name: 'Catan (Updated)', maxPlayers: 6 });
    
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe('Catan (Updated)');
    expect(updated?.maxPlayers).toBe(6);
    expect(updated?.minPlayers).toBe(3); // Should retain old properties
  });

  it('should delete a boardgame', async () => {
    const inserted = await insertBoardgame({ name: 'To Be Deleted' });
    const id = inserted._id.toString();

    let games = await getBoardgames();
    expect(games).toHaveLength(1);

    await deleteBoardgame(id);

    games = await getBoardgames();
    expect(games).toHaveLength(0);
  });
});

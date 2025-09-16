import { DataSource, EntitySchema, EntitySchemaOptions, In } from "typeorm";

interface Base {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends Base {
  name: string;
  address?: string;
  avatar?: string;
}

export interface Win extends Base {
  winner: string;
}

const Base: EntitySchemaOptions<Base>['columns'] = {
  id: {
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  },
  createdAt: {
    type: 'datetime',
    createDate: true,
  },
  updatedAt: {
    type: 'datetime',
    updateDate: true,
  },
};

export const User = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  columns: {
    ...Base,
    name: {
      type: 'text',
      unique: true,
      nullable: false,
    },
    address: {
      type: 'text',
      unique: true,
      nullable: true,
    },
    avatar: {
      type: 'text',
      nullable: true,
    },
  },
});

export const Win = new EntitySchema<Win>({
  name: 'Win',
  tableName: 'wins',
  columns: {
    ...Base,
    winner: {
      type: 'uuid',
      nullable: false
    }
  }
});

export const db = new DataSource({
  type: 'sqlite',
  database: './data/db.sqlite',
  entities: [User, Win]
});

await db.initialize();
await db.synchronize();

const users = db.getRepository(User);
const wins = db.getRepository(Win);

export async function createOrUpdateUser(name: string, address?: string, avatar?: string) {
  var user: User | null = null;

  if (address) {
    user = await users.findOneBy({ address });

    if (!user)
      user = await users.findOneBy({ name });

  } else {
    user = await users.findOneBy({ name });
  }

  if (!user)
    user = users.create({ name, address, avatar });

  user.name = name;
  if (address) user.address = address;
  if (avatar) user.avatar = avatar;

  await users.save(user);
  return user;
}

export async function fetchUsersByIds(ids: string[]) {
  return await users.findBy({ id: In(ids) });
}

export async function insertWin(winner: string) {
  const win = wins.create({ winner });
  await wins.save(win);
}

export async function getLeaderBoard() {
  const qb = wins
    .createQueryBuilder("win")
    .select("win.winner", "winnerId")
    .addSelect("COUNT(*)", "winsCount")
    .groupBy("win.winner")
    .orderBy("winsCount", "DESC")
    .limit(10);

  const rawResults = await qb.getRawMany<{
    winnerId: string;
    winsCount: string;
  }>();

  const topWinnersIds = rawResults.map(r => r.winnerId);
  const usersList: Record<string, User> = {};

  for (const user of await users.findBy({ id: In(topWinnersIds) })) {
    usersList[user.id] = user;
  }

  return rawResults.map(r => {
    return ({
      id: r.winnerId,
      name: usersList[r.winnerId].name,
      address: usersList[r.winnerId].address,
      avatar: usersList[r.winnerId].avatar,
      count: Number(r.winsCount),
    });
  });
}
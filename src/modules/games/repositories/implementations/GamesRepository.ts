import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("LOWER(games.title) LIKE LOWER(:titleSearch)", {
        titleSearch: `%${param}%`,
      })
      .getMany();
    // query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT (*) FROM games"); // raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const { users } = await this.repository
      .createQueryBuilder("games")
      .innerJoinAndSelect("games.users", "users")
      .where("games.id = :id", { id })
      .getOneOrFail();
    // query builder

    return users;
  }
}

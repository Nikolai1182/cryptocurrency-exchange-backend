import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WatchList } from './models/watchlist.model';
import { CreateAssetResponse } from './response';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(WatchList) private readonly watchListRepo: typeof WatchList,
  ) {}

  async createAsset(user, dto): Promise<CreateAssetResponse> {
    try {
      const watchlist = {
        user: user.id,
        name: dto.name,
        assetId: dto.assetId,
      };
      await this.watchListRepo.create(watchlist);
      return watchlist;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async deleteAsset(userId: number, assetId: string): Promise<boolean> {
    try {
      await this.watchListRepo.destroy({
        where: { id: assetId, user: userId },
      });
      return true;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

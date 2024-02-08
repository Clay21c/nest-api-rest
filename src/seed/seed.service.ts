import { Injectable } from '@nestjs/common';
import { PokemonResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly axiosAdapter: AxiosAdapter,
  ) {}

  async executedSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.axiosAdapter.get<PokemonResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=100`,
    );
    // const insertPromisesArray = [];
    const pokemontoInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');

      const no: number = +segments[segments.length - 2];
      // const pokemon = await this.pokemonModel.create({ name, no });

      pokemontoInsert.push({ name, no });

      // insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    });
    await this.pokemonModel.insertMany(pokemontoInsert);
    // const newArray = await Promise.all(insertPromisesArray);
    return `Seed Executed`;
  }
}

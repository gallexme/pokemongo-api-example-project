import PokeAPI from 'pokemongo-api';
import env from 'node-env-file'

env(__dirname + '/.env');

var username = 'USER'
var password =  'PASS'
var provider = 'ptc'
var lat = 40.759211
var lng = -73.984472


const Poke = new PokeAPI()

async function init() {

  //set player location
  Poke.player.location = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
  }

  //login
  const api = await Poke.login(username, password, provider)

  // just update the profile...
  let player = await Poke.GetPlayer()

  // get map objects..
  while( true ){
    let cells = await Poke.GetMapObjects()
    for(let cell of cells) {

      // catchable pokemons from here?
      for (let pokemon of cell.catchable_pokemons) {
        // await pokemon.encounterAndCatch().catch(err => console.log(err))
      }

      // wild pokemons
      for (let pokemon of cell.wild_pokemons) {
        // we have wild pokemons, you cannot catch these..
      }

      // forts
      for (let fort of cell.forts) {
        // Only do things close to you
        if(fort.withinRange){
          // Collect pokestop rewards
          if (fort.isCheckpoint && !fort.cooldown) {
            await fort.search()
          }

          if(fort.isGym) {
            // Set a pokemon here if it's your team and there are spots open
          }
        }
      }
    }

    //just walk a little (1 - 15 meters..)
    await Poke.player.walkAround()

    await new Promise(resolve => setTimeout(resolve, 3000))
  }
}

init().catch(console.log)

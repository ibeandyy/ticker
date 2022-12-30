import { providers, Contract } from "ethers";
import { ActivityType, Client, IntentsBitField } from "discord.js";
import { TOKEN, LP_ADDRESS, CHAINLINK_ADDRESS, PROVIDER } from "./config.json";
import cnvabi from "./abis/cnvlp.json";
import lpabi from "./abis/chainlink.json";
import wait from "wait";

const client = new Client({
  intents: IntentsBitField.Flags.Guilds,
});
const provider = new providers.JsonRpcProvider(PROVIDER);
const cnvContract = new Contract(LP_ADDRESS, lpabi, provider);
const lpContract = new Contract(CHAINLINK_ADDRESS, cnvabi, provider);
const main = async () => {
  await client.login(TOKEN);
  console.log("Logged in!");
  while (true) {
    const daiPrice = (await lpContract.latestAnswer()) / 1e8;
    const [cnvReserves, daiReserves] = await cnvContract.getReserves();
    const priceInUsdInDollars = (
      (daiPrice * daiReserves) /
      cnvReserves
    ).toFixed(2);

    client.user.setActivity(`CNV: $${priceInUsdInDollars}`, {
      type: ActivityType.Watching,
    });
    await wait(10000);
  }
};
main();

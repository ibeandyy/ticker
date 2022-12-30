import { providers, Contract } from "ethers";
import { ActivityType, Client, IntentsBitField } from "discord.js";
import { TOKEN, LP_ADDRESS, CHAINLINK_ADDRESS, PROVIDER } from "./config.json";
import cnvABI from "./abis/cnvlp.json";
import chainlinkABI from "./abis/chainlink.json";
import wait from "wait";

const client = new Client({
  intents: IntentsBitField.Flags.Guilds,
});
const provider = new providers.JsonRpcProvider(PROVIDER);
const cnvContract = new Contract(LP_ADDRESS, cnvABI, provider);
const daiContract = new Contract(CHAINLINK_ADDRESS, chainlinkABI, provider);
const main = async () => {
  await client.login(TOKEN);
  console.log("Logged in!");
  while (true) {
    try {
      const daiPrice = (await daiContract.latestAnswer()) / 1e8;
      const [cnvReserves, daiReserves] = await cnvContract.getReserves();
      const priceInUsdInDollars = (
        (daiPrice * daiReserves) /
        cnvReserves
      ).toFixed(2);

      client.user.setActivity(`CNV: $${priceInUsdInDollars}`, {
        type: ActivityType.Watching,
      });
      await wait(100000);
    } catch (e) {
      console.log(e);
    }
  }
};
main();

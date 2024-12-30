import * as tsj from "npm:ts-json-schema-generator@^2.3.0";
import { resolve } from "jsr:@std/path@^1.0.2";
import { privateKeyToAccount } from "npm:viem@^2.21.7/accounts";
import { assertJsonSchema, isHex } from "../../utils.ts";
import { HttpTransport, WalletClient } from "../../../index.ts";

const TEST_PRIVATE_KEY = Deno.args[0];
const TEST_SUB_ACCOUNT_ADDRESS = "0xcb3f0bd249a89e45e86a44bcfc7113e4ffe84cd1";
if (!isHex(TEST_PRIVATE_KEY)) {
    throw new Error(`Expected a hex string, but got ${typeof TEST_PRIVATE_KEY}`);
}

Deno.test("subAccountTransfer", async (t) => {
    // Create TypeScript type schemas
    const tsjSchemaGenerator = tsj.createGenerator({ path: resolve("./index.ts"), skipTypeCheck: true });
    const schema = tsjSchemaGenerator.createSchema("SuccessResponse");

    // Create client
    const account = privateKeyToAccount(TEST_PRIVATE_KEY);
    const transport = new HttpTransport({ url: "https://api.hyperliquid-testnet.xyz" });
    const walletClient = new WalletClient({ wallet: account, transport, isTestnet: true });

    // Test
    await t.step("deposit to sub account", async () => {
        const result = await walletClient.subAccountTransfer({
            subAccountUser: TEST_SUB_ACCOUNT_ADDRESS,
            isDeposit: true,
            usd: 1,
        });
        assertJsonSchema(schema, result);
    });
    await t.step("withdraw from sub account", async () => {
        const result = await walletClient.subAccountTransfer({
            subAccountUser: TEST_SUB_ACCOUNT_ADDRESS,
            isDeposit: false,
            usd: 1,
        });
        assertJsonSchema(schema, result);
    });
});

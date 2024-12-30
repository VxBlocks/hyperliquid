import * as tsj from "npm:ts-json-schema-generator@^2.3.0";
import { resolve } from "jsr:@std/path@^1.0.2";
import { assert, assertGreater } from "jsr:@std/assert@^1.0.9";
import { HttpTransport, PublicClient } from "../../../index.ts";
import { assertJsonSchema } from "../../utils.ts";

const USER_ADDRESS = "0x563C175E6f11582f65D6d9E360A618699DEe14a9";

Deno.test("userFills", async (t) => {
    // Create TypeScript type schemas
    const tsjSchemaGenerator = tsj.createGenerator({ path: resolve("./index.ts"), skipTypeCheck: true });
    const schema = tsjSchemaGenerator.createSchema("UserFill");

    // Create client
    const transport = new HttpTransport({ url: "https://api.hyperliquid-testnet.xyz" });
    const client = new PublicClient({ transport });

    //Test
    await t.step("required parameters", async (t) => {
        const data = await client.userFills({ user: USER_ADDRESS });

        assertGreater(data.length, 0, "Unable to fully validate the type due to an empty array");
        data.forEach((item) => assertJsonSchema(schema, item));

        await t.step("side", async (t) => {
            await t.step("some should be B", () => assert(data.some((item) => item.side === "B")));
            await t.step("some should be A", () => assert(data.some((item) => item.side === "A")));
        });

        await t.step("cloid", async (t) => {
            await t.step("some should be string", () => assert(data.some((item) => typeof item.cloid === "string")));
            await t.step("some should be defined", () => assert(data.some((item) => item.cloid)));
        });

        await t.step("liquidation", async (t) => {
            await t.step("some should be undefined", () => assert(data.some((item) => item.liquidation === undefined)));
            await t.step("some should be defined", () => assert(data.some((item) => item.liquidation !== undefined)));
        });
    });

    await t.step("required parameters + aggregateByTime", async (t) => {
        const data = await client.userFills({ user: USER_ADDRESS, aggregateByTime: true });

        assertGreater(data.length, 0, "Unable to fully validate the type due to an empty array");
        data.forEach((item) => assertJsonSchema(schema, item));

        await t.step("side", async (t) => {
            await t.step("some should be B", () => assert(data.some((item) => item.side === "B")));
            await t.step("some should be A", () => assert(data.some((item) => item.side === "A")));
        });

        await t.step("cloid", async (t) => {
            await t.step(
                "some should be string",
                () => assert(data.some((item) => typeof item.cloid === "string")),
            );
            await t.step("some should be defined", () => assert(data.some((item) => item.cloid)));
        });

        await t.step("liquidation", async (t) => {
            await t.step(
                "some should be undefined",
                () => assert(data.some((item) => item.liquidation === undefined)),
            );
            await t.step(
                "some should be defined",
                () => assert(data.some((item) => item.liquidation !== undefined)),
            );
        });
    });
});

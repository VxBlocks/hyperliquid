import { parser, TwapSliceFill, UserTwapSliceFillsByTimeRequest } from "@nktkas/hyperliquid/schemas";
import * as v from "valibot";
import { schemaCoverage } from "../../_utils/schema_coverage.ts";
import { runTest } from "./_t.ts";

runTest({
    name: "userTwapSliceFillsByTime",
    codeTestFn: async (_t, client) => {
        const data = await Promise.all([
            client.userTwapSliceFillsByTime({
                user: "0x563C175E6f11582f65D6d9E360A618699DEe14a9",
                startTime: Date.now() - 1000 * 60 * 60 * 24 * 365,
            }),
        ]);
        schemaCoverage(v.array(TwapSliceFill), data, {
            ignoreBranches: {
                "#/items/properties/fill/properties/twapId": [0],
            },
        });
    },
    cliTestFn: async (_t, runCommand) => {
        const data = await runCommand([
            "info",
            "userTwapSliceFillsByTime",
            "--user",
            "0x563C175E6f11582f65D6d9E360A618699DEe14a9",
            "--startTime",
            "1725991238683",
        ]);
        parser(UserTwapSliceFillsByTimeRequest)(JSON.parse(data));
    },
});

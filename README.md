
# Comet Migrator

The Comet Migrator is a Compound v3 Operator and Extension for migrating a position from Compound v2 and other DeFi protocols to Compound v3. The "Operator" is a smart contract which interacts with the Compound v3 Protocol on behalf of a user who approves the migrator. The "Extension" is a front-end integration into the Compound v3 interface. The Operator code is built on [Foundry](https://book.getfoundry.sh/), and the Extension code is built on [React](https://reactjs.org/) using [Vite](https://vitejs.dev/).

## Getting Started

First, [install Foundry](https://book.getfoundry.sh/getting-started/installation) and NodeJS 18+ and [yarn](https://yarnpkg.com/). 

You can build the Compound Migrator Operator smart contract by running:

```
yarn forge:build
```

And you can build the Compound Migrator Extension by running:

```
yarn web:build
```

For the development experience, we recommend using the [Playground](#The-Playground) as described below.

### The Playground

For development, we will use a fork of mainnet, as opposed to developing on a test-net. You can deploy the Migrator to a fork of mainnet, run that in a stand-alone development experience, and attach MetaMask to that fork to interact with the extension. This requires a small amount of set-up, but it makes it significantly easier to test interactions with third-party protocols like using Uniswap swaps, flash loans, Compound v2 and Compound v3, all in one experience without needing the protocols to exist for the same assets on the same oft deprecated test-nets.

Starting the playground (i.e. running Anvil to fork main-net and deploying the necessary contracts):

```
yarn forge:playground
```

Next, we'll need to make sure MetaMask is set-up to talk to this network. Follow [these steps](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC) to add a custom network `http://localhost:8545`.

⚠️ Note: it's possible you already have such a network set-up. If so, you may want to ensure the chain id is `1`. Go into MetaMask -> Settings -> Networks -> Localhost 8545 and then you should see a screen that has `Chain ID: #`. It should be `1`, and if it is not, change it to `1` and hit Save.

Next, start the standalone dev experience by running:

```
yarn web:dev
```

This should spawn a web server at an address such as http://localhost:5183. Visit that page and you should be running in the playground.

A few notes:

 * Any changes to web source code should auto-reload.
 * If you want to change the smart contract code, you'll need to kill and restart `yarn forge:playground`.
 * The standalone development experience is not the primary usage of the extension. See [Webb3](https://github.com/compound-finance/webb3) for details on running as an embedded extension.

To run this in embedded mode (see Embedding below), you should run the following command in Webb3:

```sh
# in webb3/
VITE_WEBB3_MAINNET_URL=http://localhost:8545 VITE_COMET_MIGRATOR_SOURCE=http://localhost:5183/embedded.html yarn dev
```

## Comet Migrator Operator

The Comet Migrator Operator code lives in `src/CometMigrator.sol`. Note: we use a large amount of vendoring to pull in Uniswap, Compound v2 and Compound v3 source files. We use [vendoza](https://github.com/hayesgm/vendoza) to track the diffs.

The [Comet Migrator Spec](./SPEC.md) contains the full spec on the specifics of the migrator code.

Note: `script/copy-abi.sh` is currently used to sync the ABI from the `CometMigrator.sol` to `abis/CometMigrator.ts` for use in the Extension. We may want to find a simpler system for this at some point.

## Deploying

### Build and Deploying Operator

To deploy the operator, first build it:

```
yarn forge:build
```

Next, you can deploy it:

```
# TODO
```

### Build and Deploying Extension

First, build the dist for the extension:

```
yarn web:build
```

Next, make it available for the Webb3...

```
TODO
```

## Embedding

You can run [Webb3](https://github.com/compound-finance/webb3) locally with a local version of the extension running. First, run this extension:

```sh
# in comet-migrator/
yarn web:dev
```

Take a note of the port (it should be 5183). Then run Webb3 with the following env var set:

```sh
# in webb3/
VITE_COMET_MIGRATOR_SOURCE=http://localhost:5183/embedded.html yarn dev
```

When the extension loads at [http://localhost:5173](http://localhost:5173), it should load this local extension, instead of the production version.

If you are using the playground, you should also make sure Webb3 uses that URL for reading from the chain:

```sh
# in webb3/
VITE_WEBB3_MAINNET_URL=http://localhost:8545 VITE_COMET_MIGRATOR_SOURCE=http://localhost:5183/embedded.html yarn dev
```

## Contributing

TODO

## License

TODO

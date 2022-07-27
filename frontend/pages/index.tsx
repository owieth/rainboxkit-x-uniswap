import { Button, Container, Grid, Text } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SwapWidget } from '@uniswap/widgets';
import '@uniswap/widgets/fonts.css';
import { ethers } from "ethers";
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import Web3Modal from "web3modal";

const providerOptions = {
  walletlink: {
    package: '', // Required
    options: {
      appName: "Web 3 Modal Demo", // Required
      infuraId: process.env.INFURA_KEY // Required unless you provide a JSON RPC url; see `rpc` below
    }
  },
  walletconnect: {
    package: '', // required
    options: {
      infuraId: process.env.INFURA_KEY // required
    }
  }
}

let web3Modal: Web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    providerOptions, // required
  })
}

const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Rainbowkit
  const { data: signer } = useSigner()
  const { address } = useAccount()

  // Web3Modal
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState("");


  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      setProvider(provider);
      if (accounts) setAccount(accounts[0]);
    } catch (error) {
      console.error(error)
    }
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    setAccount("");
  };

  const renderUniswapWidgetRainbow = () => {
    return (
      <Grid.Container gap={2}>
        <Grid xs={6}>
          <SwapWidget
            provider={signer?.provider as ethers.providers.JsonRpcProvider}
          />
        </Grid>
      </Grid.Container>
    )
  }

  const renderUniswapWidgetWeb3Modal = () => {
    return (
      <Grid.Container gap={2}>
        <Grid xs={6}>
          <SwapWidget
            provider={provider}
          />
        </Grid>
      </Grid.Container>
    )
  }

  return (
    <>
      <Container display='flex' justify='center' style={{ height: '100vh' }} gap={5}>
        <Grid.Container gap={2} alignItems='center'>
          <Grid xs={9}>
            <Text h1>🌈 Rainbowkit 🤝 Uniswap 🦄</Text>
          </Grid>
          <Grid xs={3} justify='flex-end'>
            <ConnectButton />
          </Grid>
        </Grid.Container>

        <Grid.Container gap={2} alignItems='center'>
          <Grid xs={9}>
            <Text h1>👛 Web3Modal 🤝 Uniswap 🦄</Text>
          </Grid>
          <Grid xs={3} justify='flex-end'>
            {!account ? (
              <Button onClick={connectWallet}>Connect Wallet</Button>
            ) : (
              <Button onClick={disconnect}>Disconnect</Button>
            )}
          </Grid>
        </Grid.Container>

        <>
          {mounted && address && renderUniswapWidgetRainbow()}
          {mounted && account && renderUniswapWidgetWeb3Modal()}
        </>
      </Container>
    </>
  )
}

export default Home

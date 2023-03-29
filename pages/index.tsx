import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { OOTest } from '../components/OOTest';

const Home: NextPage = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>
      <OOTest />
    </>
  );
};

export default Home;

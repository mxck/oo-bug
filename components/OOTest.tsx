import { useState } from 'react';
import { useProvider, useQuery } from 'wagmi';

interface OpenOceanQuote {
  inAmount: string;
  outAmount: string;
  data: string;
}
const AMOUNT = '0.001';
const RAW_AMOUNT = '1000000000000000';
const ADDRESS = '0x6Fa3F05a2D746d6c170b4723f577E284610Cc1e5';

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre
      style={{
        maxWidth: 600,
        overflowY: 'scroll',
        padding: 16,
        backgroundColor: '#eee',
      }}
    >
      {children}
    </pre>
  );
}

export function OOTest(): JSX.Element {
  const provider = useProvider({
    chainId: 56,
  });

  const [withReferrer, setWithReferer] = useState(false);

  const { data, isLoading } = useQuery(
    ['oo', withReferrer ? 'withReferrer' : 'noReferrer'],
    async () => {
      const url = new URL(
        `https://hk-open-api.openocean.finance/v3/bsc/swap_quote`
      );
      url.searchParams.set(
        'inTokenAddress',
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      );
      url.searchParams.set(
        'outTokenAddress',
        '0x55d398326f99059fF775485246999027B3197955'
      );
      url.searchParams.set('amount', '0.001000000000000000');
      url.searchParams.set('gasPrice', '5');
      url.searchParams.set('slippage', '1');
      url.searchParams.set('account', ADDRESS);
      if (withReferrer) {
        url.searchParams.set(
          'referrer',
          '0x3254aE00947e44B7fD03F50b93B9acFEd59F9620'
        );
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const json = await response.json();

      const ooData: OpenOceanQuote = json.data;

      let estimateResult: string;
      try {
        const estimate = await provider.estimateGas({
          data: ooData.data,
          from: ADDRESS,
          to: '0x6352a56caadc4f1e25cd6c75970fa768a3304e64',
          value: RAW_AMOUNT,
        });
        estimateResult = JSON.stringify(estimate, undefined, 2);
      } catch (error) {
        estimateResult = JSON.stringify(error, undefined, 2);
      }

      return { ooData, estimateResult, url: url.toString() };
    },
    { cacheTime: 0 }
  );

  return (
    <div>
      Amount to send: {AMOUNT} BNB ({RAW_AMOUNT})<br />
      <input
        type="checkbox"
        checked={withReferrer}
        onChange={() => setWithReferer(!withReferrer)}
      />
      <label htmlFor="withReferrer">
        With referrer (0x3254aE00947e44B7fD03F50b93B9acFEd59F9620)
      </label>
      <br />
      URL:
      <Code>{data?.url}</Code>
      <br />
      OpenOcean Quote Response:
      <Code>
        {isLoading ? 'Loading...' : JSON.stringify(data?.ooData, undefined, 2)}
      </Code>
      Estimate gas:
      <Code>{isLoading ? 'Loading...' : data?.estimateResult}</Code>
    </div>
  );
}

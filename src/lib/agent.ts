import type { BearishPoint, BullishPoint, FinanceReport } from '../types/finance';

const KNOWN: Record<
  string,
  { companyName: string; segment: string; bull: string; bear: string }
> = {
  UMC: {
    companyName: 'United Microelectronics',
    segment: 'foundry / mature nodes',
    bull: 'UMC benefits when customers diversify from leading-edge squeezes and value stable capacity for analog, PMIC, and MCU flows.',
    bear: 'Pricing power is cyclical; when utilization dips, margin pressure can arrive quickly in mature-node competition.',
  },
  GFS: {
    companyName: 'GlobalFoundries',
    segment: 'specialty & differentiated foundry',
    bull: 'Long-term agreements and specialty processes can create stickier demand than commodity leading-edge races.',
    bear: 'Heavy capex requirements and customer concentration can swing results when a key program pushes out.',
  },
  MU: {
    companyName: 'Micron Technology',
    segment: 'memory (DRAM / NAND)',
    bull: 'Memory is structurally levered to AI server build-outs and enterprise refresh cycles when supply discipline holds.',
    bear: 'Memory remains brutally cyclical; oversupply episodes can erase operating leverage faster than equity models assume.',
  },
  AMD: {
    companyName: 'Advanced Micro Devices',
    segment: 'CPUs, GPUs, custom silicon',
    bull: 'A broad data-center roadmap plus gaming/embedded optionality can compound if share gains persist.',
    bear: 'Competition in AI accelerators and hyperscaler insourcing adds execution risk and pricing uncertainty.',
  },
  NVDA: {
    companyName: 'NVIDIA',
    segment: 'AI accelerators / full-stack platform',
    bull: 'CUDA ecosystem depth and platform bundling create durable advantages when AI infrastructure spend keeps growing.',
    bear: 'Valuation embeds exceptional continuity; any growth air-pocket or customer optimization wave can re-rate the multiple swiftly.',
  },
  TSM: {
    companyName: 'Taiwan Semiconductor',
    segment: 'leading-edge & advanced packaging foundry',
    bull: 'Process leadership and scale make TSM the default bottleneck beneficiary when leading-edge content rises.',
    bear: 'Geopolitical and concentration risk never fully go away; CapEx cycles can pressure returns at the margin.',
  },
  SNDK: {
    companyName: 'Sandisk',
    segment: 'flash storage solutions',
    bull: 'Spin/remix narratives can unlock focus on high-growth retail and OEM flash if product cadence and channel execution hold.',
    bear: 'Consumer storage competes on price; NAND cycles and brand churn can sap gross margin faster than hoped.',
  },
  WDC: {
    companyName: 'Western Digital',
    segment: 'HDDs + NAND / storage platforms',
    bull: 'Nearline HDD demand tied to hyperscale archives can stabilize cash generation if mix shifts toward enterprise.',
    bear: 'NAND exposure and cyclical components still matter; integration risk and capex can swing segment margins.',
  },
  STX: {
    companyName: 'Seagate Technology',
    segment: 'mass-capacity HDDs',
    bull: 'AI and cloud archive workloads increase exabyte demand; density roadmap improvements support ASP stability.',
    bear: 'Customer concentration and pricing dynamics in a consolidating buyer base can pressure revenue visibility.',
  },
};

function buildPoints(
  ticker: string,
  meta: { companyName: string; segment: string; bull: string; bear: string }
): { bullish: BullishPoint[]; bearish: BearishPoint[] } {
  const t = ticker.toUpperCase();
  return {
    bullish: [
      {
        title: 'Demand angle',
        detail: meta.bull,
      },
      {
        title: 'Strategic footprint',
        detail: `${meta.companyName} maps closely to ${meta.segment} cycles—worth monitoring utilization commentary and customer mix.`,
      },
      {
        title: 'Innovation optionality',
        detail: `If ${t} executes on the next roadmap milestone, product cycles could support incremental share—mock modeling only.`,
      },
    ],
    bearish: [
      {
        title: 'Cycle exposure',
        detail: meta.bear,
      },
      {
        title: 'Execution & timing',
        detail:
          'Launch slips, yield issues, or inventory corrections are common industry risks—scenario planning should stress-test margins.',
      },
      {
        title: 'Macro sensitivity',
        detail:
          'Rates, China demand, and enterprise capex can move the group together; idiosyncratic proof points still matter.',
      },
    ],
  };
}

export function runFinanceAgent(ticker: string): Promise<FinanceReport> {
  const normalized = ticker.trim().toUpperCase() || 'TICKER';
  const meta =
    KNOWN[normalized] ?? {
      companyName: `${normalized} (generic profile)`,
      segment: 'semiconductor / technology',
      bull: `${normalized} may benefit if industry demand remains constructive and the company maintains operational momentum—this is illustrative text only.`,
      bear: 'Without company-specific diligence, generic risks include competition, cyclicality, and execution on the roadmap—placeholder analysis.',
    };

  const { bullish, bearish } = buildPoints(normalized, meta);

  return new Promise((resolve) => {
    setTimeout(() => {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const report: FinanceReport = {
        id,
        ticker: normalized,
        companyName: meta.companyName,
        title: `Mock diligence brief: ${normalized}`,
        summary: [
          `Prototype-only snapshot for ${normalized} (${meta.companyName}).`,
          `Focus area: ${meta.segment}.`,
          'Numbers, price targets, and recommendations are intentionally omitted. Treat all outputs as fictional scaffolding for UI testing.',
        ].join(' '),
        bullishPoints: bullish,
        bearishPoints: bearish,
        risks: [
          'This report is generated by a mock agent for demonstration. It is not investment advice or a solicitation.',
          'Real analysis requires filings, channel checks, and model assumptions validated against your process.',
          'Semiconductor and storage names remain highly correlated to macro conditions, rates, and end-market inventory.',
        ],
        createdAt,
      };
      resolve(report);
    }, 1000);
  });
}

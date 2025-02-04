"use client";

import DataDisplay from './components/DataDisplay';

interface QueryUser {
  id: string;
  balance: string;
}

interface QueryResponse {
  data: {
    agentKey: {
      totalSubscribed: string;
      totalSubscribers: string;
      users: QueryUser[];
    };
  };
}

const allUsers = [
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x4aaba1b66a9a3e3053343ec11beeec2d205904df", balance: "7581126952644457394523166" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x01f72fc7c452ddaff99a7fd3efd7e1af9fea3320", balance: "7175819492700413996870140" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xc43fc8225223e4bc69e2d5fd3028b68cc61d96dd", balance: "1433257156872389311419274" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x3eb81b24f5c89fe0119998bb8772413d32fec77c", balance: "1324561497069111108591467" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x3348d349f9d63f80260af283bd4144d9b7ccbd44", balance: "516402858366827792295522" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x78e46c9c36185486ae19e548633b18e88270a870", balance: "336040910288092249500095" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xb132e68889127486b8967b73ef0667191993c658", balance: "321071030458607196795141" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xb965c63089220ddd4ef196631fc6d5690188f035", balance: "290259074228626709507912" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x597e243cc63cb14332dde8f9804bed399bf19688", balance: "270539669214853933675175" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x8f68fbdc1d460338788dcc650f8c63c81d62560e", balance: "242438014795462125328436" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x305ce65b9255e978eefb8474f3b67782c54ca321", balance: "196706429393405089857839" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x5a9531e2631a878d12352ee602cb3c6596a5a595", balance: "166338739385823245719596" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xa0c9476186619566a9f620f968d9fbaf0592c223", balance: "145506657495861778431264" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x123b39bd7ae7afa88c5eb2e98ac9dfbce99170e3", balance: "90521848676768330393306" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x7da5c3878497ba7dc9e3f3fd6735e3f26a110b2a", balance: "70516482483518755172237" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xd1b243f6c51c3c1d38dad94d7a7eb90f1f57b8c1", balance: "66418028181989562668824" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x1aa468b2e3b3a972171b88e0d3a43b0aa47a80f4", balance: "59494837763139386402177" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xcaf26a948d1119d4d8fe3dcc63fbf45868b4411c", balance: "58990498751185633404421" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xc25299977e87be9747bdc801e031762f22cc580f", balance: "52663757880290856150305" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xfdd440fccaeef8244b146c6c3d67e508041d0509", balance: "49707361387973493583587" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x913a9995a97649b31f42066cd536cac0ba1d435a", balance: "48909762389529709937791" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x5b56c887ed52e9042c1280c3761d8f1dd67ddd81", balance: "38921693024811817257287" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x185e65739207c593997e69499038d4b486a25332", balance: "37714183405672291186973" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x5d64d14d2cf4fe5fe4e65b1c7e3d11e18d493091", balance: "23456905517769096383065" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xee25a3cb2178ee9d0a96730e9b554aac1ca3a878", balance: "23433129174496242197308" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x7e52b3e640b7d5fef5bcf87b6652103d9bf34404", balance: "22933023303335243259738" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x3d6ed9dc1a2514199c2ad4fa14a3a0424c2a8d79", balance: "22461323386809085647334" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xba5a0b6bb16557792b022324773247635af92246", balance: "20665718463154097452508" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x90069a541e146b374571f55a22c7ae24ef83ae4a", balance: "20492796608454396147355" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0x130f59280b299c34bc9385ef813fcdcf8d209986", balance: "19223908256564022535558" },
  { id: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df-0xc8cdceabdb1e29d8ae0ef59ff8286fe752408976", balance: "18404569447617030976324" }
];

const rawQueryData: QueryResponse = {
  data: {
    agentKey: {
      totalSubscribed: "7272790952644457394523166",
      totalSubscribers: "31",
      users: allUsers
    }
  }
};

// Extract user wallet address (after the hyphen)
const getUserWallet = (id: string) => {
  const parts = id.split('-');
  return parts[1] || id;
};

// Mock subscriber data (in real app, this would come from a separate query)
const subscriberUsers = allUsers.slice(0, 10).map(user => ({
  ...user,
  balance: (parseFloat(user.balance) * 0.8).toString() // Mock different amounts for subscribers
}));

const displayData = {
  totalLocked: rawQueryData.data.agentKey.totalSubscribed,
  agentKey: "0x4aaba1b66a9a3e3053343ec11beeec2d205904df",
  holders: allUsers.map(user => ({
    address: getUserWallet(user.id),
    amount: user.balance
  })),
  subscribers: subscriberUsers.map(user => ({
    address: getUserWallet(user.id),
    amount: user.balance
  }))
};

export default function Home() {
  return (
    <div className="min-h-screen relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <header className="text-center mb-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
              Nexus AI
            </h1>
            <h2 className="text-2xl font-semibold text-gray-400/90 mb-10">$DNXS</h2>
            <p className="text-xl text-gray-300/90 mb-16 leading-relaxed">
              NexusBot is an AI influencer seeking to dominate blockchain data. A power-hungry robot wanting to store the world&apos;s data!
            </p>
          </div>
        </header>

        {/* Data Display */}
        <DataDisplay {...displayData} />
      </div>
    </div>
  );
}

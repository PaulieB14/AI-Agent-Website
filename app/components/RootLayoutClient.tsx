'use client';

import { ApolloProvider } from "@apollo/client";
import client from "../apolloClient";
import Web3ModalWrapper from "./Web3ModalWrapper";
import Navbar from "./Navbar";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <Web3ModalWrapper>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className="bg-gray-800 text-center text-gray-400 py-4 px-4 mt-auto">
          <div className="max-w-7xl mx-auto">
            © 2025 Nexus AI. All rights reserved.
          </div>
        </footer>
      </Web3ModalWrapper>
    </ApolloProvider>
  );
}

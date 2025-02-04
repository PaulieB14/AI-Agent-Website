'use client';

import Web3ModalWrapper from "./Web3ModalWrapper";
import Navbar from "./Navbar";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Web3ModalWrapper>
      <Navbar />
      {children}
    </Web3ModalWrapper>
  );
}

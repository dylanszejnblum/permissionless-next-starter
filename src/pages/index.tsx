"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSmartAccountContext } from "@/context/SmartAccountContext";
import { useState } from "react";
import Head from "next/head";

import SendTransactionButton from "@/components/send-transaction-modal";
import QrCodeModal from "@/components/qrcode-modal";
const Dashboard = () => {
  const [localPrivateKey, setLocalPrivateKey] = useState<string>("");
  const {
    generatePrivateKeys,
    smartAddress,
    Eoa,
    privateKey,
    createKernelAccount,
    mintErc721,
    selectedAccount,
    importPrivateKeyToAccount,
    createSimpleAccount,
    createSafeAccount,
    getSmartAccountBalance,
    balance,
    createBiconomyAccount,
  } = useSmartAccountContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPrivateKey(e.target.value);
  };
  return (
    <>
      <Head>
        <title> Starter Kit</title>
      </Head>
      <div className=" flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Playground</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
            <Card className="md:col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Eoa Setup</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => {
                      generatePrivateKeys();
                    }}
                  >
                    Generate Private Key
                  </Button>
                  <span className="font-bold tracking-tight break-all">
                    Your EOA Address : {Eoa}
                  </span>
                  <span className="font-bold tracking-tight break-all">
                    EOA Private key {privateKey}
                  </span>

                  <Input
                    type="text"
                    placeholder="Paste Private key"
                    value={localPrivateKey}
                    onChange={handleInputChange}
                  />
                  <Button
                    onClick={() => {
                      importPrivateKeyToAccount(localPrivateKey);
                    }}
                  >
                    Set custom Private key
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Faucet</CardTitle>
                <CardDescription>
                  You are currently connected to Polygon Mumbai Testnet for
                  testnet matic and tokens please refer to the following faucet
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2">
                  <a href="https://mumbaifaucet.com/" className="w-full">
                    <Button variant="outline" className="w-full">
                      Alchemy Faucet
                    </Button>
                  </a>
                  <a
                    href="https://faucet.polygon.technology/"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      Polygon Faucet
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-6">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Smart Account Client</CardTitle>
                <CardDescription>
                  {" "}
                  Selected account:
                  <span className="font-bold text-xl text-purple-500">
                    {" "}
                    {selectedAccount}{" "}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <span className=" font-bold tracking-tight">
                  Select the account type
                </span>
                <Button
                  onClick={() => {
                    createSimpleAccount();
                  }}
                >
                  Simple Account
                </Button>
                <Button
                  className="bg-blue-500"
                  onClick={() => {
                    createKernelAccount();
                  }}
                >
                  Kernel Account
                </Button>
                <Button
                  onClick={() => {
                    createSafeAccount();
                  }}
                  className="bg-green-500"
                >
                  Safe Account
                </Button>
                <Button
                  onClick={() => {
                    createBiconomyAccount();
                  }}
                  className="bg-red-500"
                >
                  Biconomy Account
                </Button>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Smart Account Actions Actions</CardTitle>
                <CardDescription>
                  Available actions for your smart account
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <span className="font-bold tracking-tight break-all">
                  Account address: {smartAddress}
                </span>
                <span className=" font-bold tracking-tight">
                  Current Balance: {balance}
                </span>

                <Button
                  onClick={() => {
                    getSmartAccountBalance();
                  }}
                >
                  Get Balance
                </Button>
                <QrCodeModal />

                <SendTransactionButton />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

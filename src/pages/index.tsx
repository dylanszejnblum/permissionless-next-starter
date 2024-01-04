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
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    setIsMinting(true);
    try {
      await mintErc721();
    } catch (error) {
      console.error(error);
    }
    setIsMinting(false);
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
                <Button onClick={handleMint}>
                  {isMinting ? (
                    <>
                      {" "}
                      <div className="flex justify-center items-center">
                        <svg
                          aria-hidden="true"
                          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-white fill-purple-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    </>
                  ) : (
                    "Mint ERC-721"
                  )}
                </Button>
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

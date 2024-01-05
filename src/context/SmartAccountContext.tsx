import {
  createSmartAccountClient,
  walletClientToCustomSigner,
} from "permissionless";
import {
  SmartAccountSigner,
  signerToBiconomySmartAccount,
  signerToEcdsaKernelSmartAccount,
  signerToSafeSmartAccount,
  signerToSimpleSmartAccount,
} from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import React, { ReactNode, useContext, useState, useEffect } from "react";
import {
  createPublicClient,
  formatEther,
  http,
  BaseError,
  ContractFunctionRevertedError,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { useWalletClient } from "wagmi";
import { toast } from "sonner";
import { contract } from "@/utils/contract";

// Context
export const SmartAccountContext = React.createContext({
  privateKey: "",
  Eoa: "",
  smartAddress: "",
  selectedAccount: "",
  kernelAccountAddress: "",
  balance: "",
  smartAccountClient: null,
  generatePrivateKeys: async () => {},
  createSimpleAccount: async () => {},
  createKernelAccount: async () => {},
  createSafeAccount: async () => {},
  createBiconomyAccount: async () => {},
  getSmartAccountBalance: async () => {},
  mintErc721: async () => {},
  importPrivateKeyToAccount: async (_importedPrivateKey: string) => {},
  sendUserOp: async (_data: string) => {},
});

// Provider Props Type
interface SmartAccountProviderProps {
  children: ReactNode;
}

type SmartAccountClientType = any;

// Provider
export const SmartAccountProvider: React.FC<SmartAccountProviderProps> = ({
  children,
}) => {
  const { data: walletClient } = useWalletClient();
  const [privateKey, setPrivateKey] = useState<string>("");
  const [Eoa, setEoa] = useState<string>("");
  const [account, setAccount] = useState<SmartAccountSigner<
    "privateKey" | "custom",
    `0x${string}`
  > | null>(null);

  const [smartAddress, setSmartAddress] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [kernelAccountAddress, setKernelAccountAddress] = useState("");
  const [smartAccountClient, setSmartAccountClient] =
    useState<SmartAccountClientType | null>(null);
  const [balance, setBalance] = useState("");

  const paymasterClient = createPimlicoPaymasterClient({
    transport: http(
      `https://api.pimlico.io/v2/mumbai/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
    ),
  });

  const bundlerClient = createPimlicoBundlerClient({
    transport: http(
      `https://api.pimlico.io/v1/mumbai/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
    ),
  });

  const publicClient = createPublicClient({
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });

  useEffect(() => {
    // Set Eoa to walletClient.account.address or a default value
    const address = walletClient?.account?.address || "";
    setEoa(address);
  }, [walletClient]);

  useEffect(() => {
    if (walletClient) {
      // If walletClient is available and has an account, update the account state
      const customSigner: SmartAccountSigner<"custom"> =
        walletClientToCustomSigner(walletClient);
      setAccount(customSigner);
    } else {
      // Handle the scenario where walletClient or walletClient.account is not available
      // This could be setting the account to null or some other appropriate action
      setAccount(null);
    }
  }, [walletClient]); // The effect depends on walletClient
  const generatePrivateKeys = async () => {
    const ownerPrivateKey = generatePrivateKey();
    setPrivateKey(ownerPrivateKey);
    const account = privateKeyToAccount(ownerPrivateKey);
    // Cast account to the expected type
    const customAccount = account as unknown as SmartAccountSigner<"custom">;
    setAccount(customAccount);
    setEoa(account.address);
  };

  const importPrivateKeyToAccount = async (importedPrivateKey: string) => {
    const formattedPrivateKey = `${importedPrivateKey}` as `0x${string}`;
    setPrivateKey(formattedPrivateKey);
    const account = privateKeyToAccount(formattedPrivateKey);
    setAccount(account);
    setEoa(account.address);
  };

  const createSimpleAccount = async () => {
    const simpleAccount = await signerToSimpleSmartAccount(publicClient, {
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      signer: account as SmartAccountSigner<
        "privateKey" | "custom",
        `0x${string}`
      >,
      factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454",
    });
    console.log(simpleAccount);
    setKernelAccountAddress(simpleAccount.address);
    setSelectedAccount("Simple Account");

    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      chain: polygonMumbai,
      transport: http(
        `https://api.pimlico.io/v1/mumbai/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
      ),
      sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
    });

    setSmartAccountClient(smartAccountClient);
    setSmartAddress(simpleAccount.address);
  };
  const createKernelAccount = async () => {
    const kernelAccount = await signerToEcdsaKernelSmartAccount(publicClient, {
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      signer: account as SmartAccountSigner<
        "privateKey" | "custom",
        `0x${string}`
      >,
      index: 0n,
    });

    setKernelAccountAddress(kernelAccount.address);
    setSelectedAccount("Kernel Account");

    const smartAccountClient = createSmartAccountClient({
      account: kernelAccount,
      chain: polygonMumbai,
      transport: http(
        `https://api.pimlico.io/v1/mumbai/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
      ),
      sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
    });

    setSmartAccountClient(smartAccountClient);
    setSmartAddress(kernelAccount.address);
  };
  const createSafeAccount = async () => {
    const safeAccount = await signerToSafeSmartAccount(publicClient, {
      signer: account as SmartAccountSigner<
        "privateKey" | "custom",
        `0x${string}`
      >,
      safeVersion: "1.4.1",
      entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
      saltNonce: 0n, // optional
    });

    setSelectedAccount("Safe Account");

    const smartAccountClient = createSmartAccountClient({
      account: safeAccount,
      chain: polygonMumbai,
      transport: http(
        `https://api.pimlico.io/v1/mumbai/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
      ),
      sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
    });

    setSmartAccountClient(smartAccountClient);
    setSmartAddress(safeAccount.address);
  };

  const createBiconomyAccount = async () => {
    try {
      const biconomyAccount = await signerToBiconomySmartAccount(publicClient, {
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        signer: account as SmartAccountSigner<
          "privateKey" | "custom",
          `0x${string}`
        >,
      });

      setKernelAccountAddress(biconomyAccount.address);
      setSelectedAccount("Biconomy Account");

      const smartAccountClient = createSmartAccountClient({
        account: biconomyAccount,
        chain: polygonMumbai,
        transport: http(
          `https://api.pimlico.io/v1/mumbai/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
        ),
        sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
      });

      setSmartAccountClient(smartAccountClient);
      setSmartAddress(biconomyAccount.address);
    } catch (error) {
      console.log(error);
    }
  };

  const getSmartAccountBalance = async () => {
    try {
      const balance = await publicClient.getBalance({
        address: smartAddress as `0x${string}`,
      });

      setBalance(formatEther(balance));
    } catch (error) {
      console.error("Failed to parse data or send transaction:", error);
    }
  };

  const mintErc721 = async () => {
    try {
      const gasPrices = await bundlerClient.getUserOperationGasPrice();
      const mint = await smartAccountClient.writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: "mint",
        args: [smartAddress],
      });
      console.log(mint);

      toast(`NFT minted successfully`, {
        action: {
          label: "View on Polygon Scan",
          onClick: () =>
            (window.location.href = `https://mumbai.polygonscan.com/tx/${mint}`),
        },
      });
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";
          // do something with `errorName`
          console.log(errorName);
          toast.error("Error On mint");
        }
      }
    }
  };

  const sendUserOp = async (data: string) => {
    try {
      const gasPrices = await bundlerClient.getUserOperationGasPrice();
      const formatedData = JSON.parse(data);
      console.log(gasPrices.fast.maxFeePerGas);
      const tx = await smartAccountClient.sendTransaction({
        ...formatedData, // Include all properties from 'data'
        maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
        maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
      });
      console.log("Transaction sent successfully:", tx);

      toast(`Transaction sent successfully`, {
        action: {
          label: "View on Polygon Scan",
          onClick: () =>
            (window.location.href = `https://mumbai.polygonscan.com/tx/${tx}`),
        },
      });
    } catch (error) {
      toast.error("Error sending Tx");
      console.error("Failed to parse data or send transaction:", error);
    }
  };

  return (
    <SmartAccountContext.Provider
      value={{
        privateKey,
        Eoa,
        smartAddress,
        balance,
        getSmartAccountBalance,
        selectedAccount,
        createSimpleAccount,
        kernelAccountAddress,
        mintErc721,
        createSafeAccount,
        createBiconomyAccount,
        smartAccountClient,
        generatePrivateKeys,
        importPrivateKeyToAccount,
        createKernelAccount,
        sendUserOp,
      }}
    >
      {children}
    </SmartAccountContext.Provider>
  );
};

// Hook
export const useSmartAccountContext = () => useContext(SmartAccountContext);

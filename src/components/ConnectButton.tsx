import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useConnect, useAccount, useDisconnect } from "wagmi";

const ConnectButton = () => {
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      {isConnected ? (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      ) : (
        <Sheet>
          <SheetTrigger>
            <Button> Connect wallet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Connect a wallet</SheetTitle>
              <SheetDescription>
                <div className="flex flex-col space-y-2">
                  {connectors.map((connector) => (
                    <Button
                      className="..."
                      disabled={!connector.ready}
                      key={connector.id}
                      onClick={() => connect({ connector })}
                    >
                      {connector.name}
                      {!connector.ready && " (unsupported)"}
                      {isLoading &&
                        connector.id === pendingConnector?.id &&
                        " (connecting)"}
                    </Button>
                  ))}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default ConnectButton;

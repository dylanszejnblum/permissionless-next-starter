import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { SendIcon } from "lucide-react";
import { useSmartAccountContext } from "@/context/SmartAccountContext";
import { parseEther } from "viem";

const SendTransactionModal = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <SendIcon className="mr-2" /> Send
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send ETH/ Matic </DialogTitle>
            <DialogDescription>
              Input the address and amount you want and send a sponsored tx!
            </DialogDescription>
          </DialogHeader>
          <TransactionForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <SendIcon className="mr-2" /> Send
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Send ETH/ Matic</DrawerTitle>
          <DrawerDescription>
            Input the address and amount you want and send a sponsored tx!
          </DrawerDescription>
        </DrawerHeader>
        <TransactionForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

function TransactionForm({ className }: React.ComponentProps<"form">) {
  const { balance, sendUserOp } = useSmartAccountContext();
  const [address, setAddress] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Handle change in the address input
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  // Handle change in the amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  // Add a submit handler if needed
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to handle form submission
    setIsLoading(true);

    try {
      // Replace with your submit logic
      await sendUserOp(
        JSON.stringify({
          to: address,
          value: parseEther(amount).toString(),
        }),
      );
      setAmount("");
      setAddress("");
    } catch (error) {
      // Handle any errors here
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={handleSubmit}
    >
      <div className="mb-5">
        <label
          htmlFor="address"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Address
        </label>
        <input
          type="text" // Changed from email to text
          id="address"
          value={address}
          onChange={handleAddressChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter address"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="amount"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Amount
        </label>
        <input
          type="text" // Changed from password to text
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <label
        htmlFor="balance"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Available Balance: {balance}
      </label>
      <div className="flex items-center justify-center mb-5 w-full">
        {isLoading ? (
          <>
            <div className="flex justify-center items-center">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
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
          <>
            <Button type="submit" className="w-full">
              Send
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

export default SendTransactionModal;

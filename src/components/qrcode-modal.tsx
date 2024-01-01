import * as React from "react";

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

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { QrCodeIcon, CopyIcon } from "lucide-react";
import { useSmartAccountContext } from "@/context/SmartAccountContext";
import { QRCodeSVG } from "qrcode.react";

const QrCodeModal = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const triggerButton = (
    <Button onClick={() => setOpen(true)}>
      <QrCodeIcon className="mr-2" /> QR-Code
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Address QRCODE</DialogTitle>
            <DialogDescription>
              Only send funds to this address in the Polygon Network
            </DialogDescription>
          </DialogHeader>
          <QrCodeCard />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Only send funds to this address in the Polygon Network
          </DrawerDescription>
        </DrawerHeader>
        <QrCodeCard className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

function QrCodeCard({}: React.ComponentProps<"form">) {
  // Handle change in the address input
  const { smartAddress, selectedAccount } = useSmartAccountContext();
  return (
    <Card>
      <CardContent>
        <QRCodeSVG
          className="w-full h-full mt-5"
          fgColor="#a855f7"
          bgColor="#faf5ff"
          value={smartAddress}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center mb-5 w-full space-y-4">
        <span className="font-bold text-xl text-purple-500">
          {selectedAccount}
        </span>
        <span className="text-center">
          Only send funds to this address in the Polygon Network
        </span>
        <Button className="w-full mt-4">
          {" "}
          {/* You can adjust mt-4 to increase or decrease the space */}
          <CopyIcon /> Copy Address
        </Button>
      </CardFooter>
    </Card>
  );
}

export default QrCodeModal;

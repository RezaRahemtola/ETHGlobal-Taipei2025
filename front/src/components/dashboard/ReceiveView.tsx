import { QRCodeSVG } from "qrcode.react";
import { Button } from "../ui/button";
import { ClipboardCopyIcon, ShareIcon } from "lucide-react";
import { toast } from "sonner";

type ReceiveViewProps = { 
  username: string | null; 
  url: string;
  isMobile?: boolean;
};

export const ReceiveView = ({ 
  username, 
  url,
  isMobile = false
}: ReceiveViewProps) => {
  if (isMobile) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Receive Money</h2>
          <p className="text-slate-600">Share this QR code to receive money</p>
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="text-center">
              <div className="p-3 bg-white rounded-lg mb-4 mx-auto inline-block shadow-sm">
                <QRCodeSVG value={url} size={150} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    toast.success("Payment link copied to clipboard", {
                      description: "Share this link with anyone who wants to send you money",
                    });
                  }}
                >
                  <ClipboardCopyIcon className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Send me money",
                          text: `Send money to ${username}`,
                          url: url,
                        })
                        .catch();
                    } else {
                      toast.error("Sharing not supported on this device");
                    }
                  }}
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Receive Money</h3>
      <p className="text-slate-600 mb-6">Share this QR code to receive money</p>
      <div className="bg-slate-50 p-8 rounded-lg">
        <div className="text-center">
          <div className="p-4 bg-white rounded-lg mb-6 mx-auto inline-block shadow-md">
            <QRCodeSVG value={url} size={200} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success("Payment link copied to clipboard", {
                  description: "Share this link with anyone who wants to send you money",
                });
              }}
            >
              <ClipboardCopyIcon className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              className="flex-1 py-3"
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: "Send me money",
                      text: `Send money to ${username}`,
                      url: url,
                    })
                    .catch((error) => toast.error("Sharing failed", { description: error.message }));
                } else {
                  toast.error("Sharing not supported on this device");
                }
              }}
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
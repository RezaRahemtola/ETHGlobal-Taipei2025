import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, CoinsIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";

export function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-700">
          About Solva
        </h1>
        <p className="text-xl text-slate-600">The easiest way to send money to anyone, anywhere.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <FeatureCard
          icon={<ZapIcon className="h-10 w-10 text-yellow-500" />}
          title="Instant Transfers"
          description="Send money in seconds, not days. Our blockchain technology ensures your money moves at the speed of light."
        />
        <FeatureCard
          icon={<ShieldCheckIcon className="h-10 w-10 text-green-500" />}
          title="Secure & Private"
          description="Your financial data is protected by military-grade encryption. We never share your information with third parties."
        />
        <FeatureCard
          icon={<CoinsIcon className="h-10 w-10 text-blue-500" />}
          title="Zero Fees"
          description="Send money to friends and family without any hidden fees or charges. Keep more of your money where it belongs."
        />
      </div>

      <Card className="mb-10 border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
          <CardTitle className="text-2xl font-bold">How It Works</CardTitle>
          <CardDescription>Simple, secure, and fast money transfers</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800">Connect Your Wallet</h3>
                <p className="text-slate-600 mt-1">
                  Securely connect your crypto wallet to get started. Don't have one? We'll help you create one in
                  seconds.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800">Choose a Username</h3>
                <p className="text-slate-600 mt-1">
                  Pick a unique username that friends can use to send you money easily, without complicated addresses.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800">Send or Receive Money</h3>
                <p className="text-slate-600 mt-1">
                  Enter the amount and recipient's username, tap send. That's it! The money arrives in seconds.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-3 rounded-md transition-colors font-medium"
        >
          Try Solva Now
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: Readonly<{
  icon: React.ReactNode;
  title: string;
  description: string;
}>) {
  return (
    <Card className="h-full overflow-hidden border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
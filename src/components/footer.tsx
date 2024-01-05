import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <footer className="dark:bg-gray m-4">
        <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

          <div className="text-center space-y-4 md:space-y-6">
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} permissionless Starter Kit
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              Made with ❤️ from 🇦🇷
            </span>

            <Link
              href={
                "https://github.com/dylanszejnblum/permissionless-next-starter"
              }
              target="_blank"
              rel="noreferrer"
            >
              <Button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <GitHubLogoIcon className="h-5 w-5 fill-current mr-2" /> Star it
                on Github
              </Button>
            </Link>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              0x202b23Ec890986BFbAD985B747b10e656cCB6DFe
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
